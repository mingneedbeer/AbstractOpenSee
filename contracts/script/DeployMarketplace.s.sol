// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OpenSeeMarketplace.sol";

contract DeployMarketplace is Script {
    function run() external {
        vm.startBroadcast();
        OpenSeeMarketplace marketplace = new OpenSeeMarketplace();
        console.log("OpenSeeMarketplace deployed at:", address(marketplace));
        vm.stopBroadcast();
    }
}
