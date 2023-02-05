const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("Fundme", deployer);
    console.log("withdraw contract...");
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log("withdrawed");
};

main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
