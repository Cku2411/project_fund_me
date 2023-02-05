const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("Fundme", deployer);
    console.log("Funding contract...");
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.1"),
    });
    await transactionResponse.wait(1);
    console.log("Funded");
};

main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
