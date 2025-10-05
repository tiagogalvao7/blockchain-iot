// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract IotDataStorage {
    bytes32[] public hashes;

    // Define Events
    event DataStored(bytes32);
    event BatchDataStored(bytes32[] hashes);

    // Store 1 hash
    function storeData(bytes32 hash) public {
        hashes.push(hash);
        emit DataStored(hash);
    }

    // Store several hashes
    function storeBatchData(bytes32[] memory newHashes) public {   
        for (uint i = 0; i < newHashes.length; i++) {
            hashes.push(newHashes[i]);
        }
        emit BatchDataStored(newHashes);
    }

    function getData(uint id) public view returns (bytes32) {
        return hashes[id];
    }

    function totalStored() public view returns (uint) {
        return hashes.length;
    }
}
