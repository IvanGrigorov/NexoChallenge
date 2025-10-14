const {
    Contract,
    formatUnits,
    ethers,
    formatEther } = require("ethers");
const { getActiveConfig } = require("./helpers/dbHelper")
const { applyFilters } = require("./helpers/filterHelper")


async function monitor() {
	const configData = await getActiveConfig();

	const url = "https://mainnet.infura.io/v3/f851eb2c9a944168a3551be3b950a6a5"
	const provider = new ethers.JsonRpcProvider(url);

	//const balance = await provider.getBalance("0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97")


	// The contract ABI (fragments we care about)
	const abi = [
		"event Transfer(address indexed from, address indexed to, uint amount)"
	]

	// Create a contract; connected to a Provider, so it may
	// only access read-only methods (like view and pure)
	const contract = new Contract("0xdAC17F958D2ee523a2206206994597C13D831ec7", abi, provider)


	contract.on("Transfer", (from, to, _amount, event) => {
		const amount = formatEther(_amount, 18)
		const toSave = applyFilters(configData.config, from, to, amount)
		
		console.log(toSave)
		if (toSave) {
			console.log(`Saved ${ from } => ${ to }: ${ amount }`);

		}
		else {
			console.log(`Skipped ${ from } => ${ to }: ${ amount }`);

		}
	})
}

monitor();