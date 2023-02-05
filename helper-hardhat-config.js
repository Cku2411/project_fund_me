const networkConfig = {
    5: {
        name: "goerli",
        linkUSDPriceFeed: "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
    },
    56: {
        name: "bnb",
        linkUSDPriceFeed: "0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f",
    },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
};
