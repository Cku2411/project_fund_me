const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    console.log("deployer", deployer);

    // Check the chainId of hardhat network
    if (developmentChains.includes(network.name)) {
        console.log("local network dectedted, deploying mock...");
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        console.log("Mocks deployed");
        console.log("---------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
