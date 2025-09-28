// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract IotDataStorage {
    bytes32[] public hashes;

    // event
    event DataStored(bytes32);

    function storeData(bytes32 hash) public {
        hashes.push(hash);
        emit DataStored(hash);
    }

    function getData(uint id) public view returns (bytes32) {
        return hashes[id];
    }
}
