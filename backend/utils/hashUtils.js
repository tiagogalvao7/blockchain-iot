const { ethers } = require("ethers");

function generateHash(_id, createdAt, temperature, humidity) {
  try {
    return ethers.solidityPackedKeccak256(
      ["string", "string", "uint256", "uint256"],
      [String(_id), String(createdAt), Number(temperature), Number(humidity)]
    );
  } catch (err) {
    console.error("Internal error generating hash:", err);
    return null;
  }
}

module.exports = { generateHash };
