const { network } = require("hardhat");
const { verify } = require("../utils/verify");
//IMPORT LOCALLY
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");

// MAIN FUNCTION
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // const linkUsdPriceFeedAddress = networkConfig[chainId].linkUSDPriceFeed;
    // using for testnet network,
    let linkUsdPriceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const linkUsdAggregator = await deployments.get("MockV3Aggregator");
        linkUsdPriceFeedAddress = linkUsdAggregator.address;
    } else {
        linkUsdPriceFeedAddress = networkConfig[chainId].linkUSDPriceFeed;
    }

    console.log("linkUsdPriceFeedAddress: ", linkUsdPriceFeedAddress);
    console.log("deployer", deployer);

    //When going for localhost or hardhat network we want to use a mock
    const args = [linkUsdPriceFeedAddress];
    const fundMe = await deploy("Fundme", {
        from: deployer,
        args: args, // put the pricefeed address here
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API
    ) {
        await verify(fundMe.address, args);
    }

    console.log("-------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];

//10:36
