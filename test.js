import { Contract, formatUnits } from "ethers";
import { ethers, formatEther } from "ethers";

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
  console.log(event.log)
  console.log(`${ from } => ${ to }: ${ amount }`);

  // The `event.log` has the entire EventLog

  // Optionally, stop listening
  //event.removeListener();
});