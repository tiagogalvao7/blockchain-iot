// Variables and requires
const { ethers } = require("ethers");
require("dotenv").config();
const providerURL = process.env.INFURA_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "DataStored",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    name: "storeData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getData",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hashes",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const wallet = new ethers.Wallet(privateKey, provider);

// Create the instance of the contract
// call functions of the contract with this instance
// contract.storeData & contract.getData
const iotContract = new ethers.Contract(contractAddress, contractABI, wallet);

// Store Data function
async function storeDataOnChain(hash) {
  try {
    // call for store data function
    const tx = await iotContract.storeData(hash);
    // wait for transaction
    const receipt = await tx.wait();
    console.log("Tx mined:", receipt.transactionHah);
    return receipt;
  } catch (err) {
    console.error("Error sending data to blockchain", err);
    throw err;
  }
}

// Get Data function
async function getDataFromChain(index) {
  return await iotContract.getData(index);
}

// export functions
module.exports = {
  storeDataOnChain,
  getDataFromChain,
};
