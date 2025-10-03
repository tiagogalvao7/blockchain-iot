const { ethers } = require("ethers");

function generateHash(_id, createdAt, temperature, humidity) {
  try {
    return ethers.solidityPackedKeccak256(
      ["string", "string", "string", "string"],
      [String(_id), String(createdAt), String(temperature), String(humidity)]
    );
  } catch (err) {
    console.error("Internal error generating hash:", err);
    return null;
  }
}

module.exports = { generateHash };
