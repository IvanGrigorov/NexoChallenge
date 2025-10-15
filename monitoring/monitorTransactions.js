require('dotenv').config()
const {
    Contract,
    ethers,
    formatEther } = require("ethers");
const { getActiveConfig, saveTransaction } = require("./helpers/dbHelper")
const { applyFilters } = require("./helpers/filterHelper")
const { log, logError } = require("./helpers/loggerHelper")

// Using only one connection for the DB
// to avoid too many spawned connections
const { Client } = require('pg')
const client = new Client();

async function monitor() {

	// Single connection established
	await client.connect();


	const configData = await getActiveConfig(client);
	if (!configData) {
		logError("No config provided");
		// Exit
		throw new Error("Program exited!")
	}

	const url = process.env.INFURA_URL;
	const provider = new ethers.JsonRpcProvider(url);

	// The contract ABI
	const abi = [
		"event Transfer(address indexed from, address indexed to, uint amount)"
	]

	// Create a contract; connected to a Provider
	const contract = new Contract(process.env.CONTRACT, abi, provider)

	// Start monitoring
	attachMonitoring(client, contract, configData, log);

	// Uncomment for config autoupdating
	autoUpdate(client, contract, log);

}

function attachMonitoring(client, contract, configData, log) {
	contract.on("Transfer", async (from, to, _amount, event) => {
		console.log("===========");
		console.log("===========");
		console.log(configData.id);
		console.log("===========");
		console.log("===========");

		log("New transaction: " + event.log.transactionHash )
		const amount = formatEther(_amount, process.env.ETHER_NUMBER_FORMAT)
		const toSave = applyFilters(configData.config, from, to, amount)
		
		if (toSave) {
			console.log(`Saved ${ from } => ${ to }: ${ amount }`);
			try {
				const insertedTransaction = await saveTransaction(client, event.log.transactionHash, configData.id)
				if (!insertedTransaction) {
					logError(`Wrongly saved transaction with hash ${event.log.transactionHash}`);
					// Exit
					throw new Error("Program exited!")
				}
				log(`Saved ${ from } => ${ to }: ${ amount }`)
				log(`The transaction:  ${ insertedTransaction.id }`)
			}
			catch(error) {
				logError(error.message)
			}

		}
		else {
			log(`Skipped ${ from } => ${ to }: ${ amount }`)
		}
	})
}

function autoUpdate(client, contract, log) {
	setInterval(async () => {

		log("Start updating config...");

		// Clear current listeners
		contract.removeAllListeners("Transfer");

		// Retrieve probable new config
		const configData = await getActiveConfig(client);
		if (!configData) {
			logError("No config provided");
			// Exit
			throw new Error("Program exited!")
		}
		log("Probable new config gathered");


		// Attach the monitoring with the new config again
		attachMonitoring(client, contract, configData, log);
		log("Probable new config attached");

	}, process.env.AUTO_UPDATE_INTERVAL_IN_SECONDS)

}

monitor();