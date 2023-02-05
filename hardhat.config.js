require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("./tasks/block-number");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_PROVIDER = process.env.GOERLI_PROVIDER;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        goerli: {
            url: RPC_PROVIDER,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmation: 6,
        },
        bnbtestnet: {
            url: process.env.BNB_PROVIDER,
            accounts: [PRIVATE_KEY],
            chainId: 97,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API,
    },
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: process.env.COINMARKETCAP_API,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};
