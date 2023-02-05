const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");

    beforeEach(async () => {
        // Get testing accounts from ethers
        const [acc] = await ethers.getSigners();

        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("Fundme", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    // Group test based on deffrent function
    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed();
            // expect(mockV3Aggregator.address).to.equal(response);
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough"
            );
        });
        it("updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.getFunder(0);
            console.log("funder", funder);
            assert.equal(deployer, funder);
        });
    });

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue });
        });

        it("withdraw Eth from a single founder", async () => {
            // Balance before fund
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployBalance = await fundMe.provider.getBalance(
                deployer
            );

            // Act
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            // GasUsed
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            // Balance after fund
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );
        });
        it("allows us to withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners();
            // send value from multiple accounts
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                );
                await fundMeConnectedContract.fund({ value: sendValue });
            }
            //Using withdraw function owner will reset all these other balance's
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const withdraw = await fundMe.withdraw();
            await withdraw.wait(1);

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            //all balance will be 0
            assert.equal(endingFundMeBalance, 0);
            // All mapping will be zero
            await expect(fundMe.getFunder(1)).to.be.reverted;
            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });
        it("only allows the onwer to withdraw", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.reverted;
        });
    });

    describe(" Cheaper withdraw testing...", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue });
        });

        it("withdraw Eth from a single founder", async () => {
            // Balance before fund
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const startingDeployBalance = await fundMe.provider.getBalance(
                deployer
            );

            // Act
            const transactionResponse = await fundMe.cheaperWithdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            // GasUsed
            const { gasUsed, effectiveGasPrice } = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            // Balance after fund
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            );

            assert.equal(endingFundMeBalance, 0);
            assert.equal(
                startingFundMeBalance.add(startingDeployBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            );
        });
        it("allows us to withdraw with multiple funders", async () => {
            const accounts = await ethers.getSigners();
            // send value from multiple accounts
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                );
                await fundMeConnectedContract.fund({ value: sendValue });
            }
            //Using withdraw function owner will reset all these other balance's
            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            const withdraw = await fundMe.cheaperWithdraw();
            await withdraw.wait(1);

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            );
            //all balance will be 0
            assert.equal(endingFundMeBalance, 0);
            // All mapping will be zero
            await expect(fundMe.getFunder(1)).to.be.reverted;
            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                );
            }
        });
        it("only allows the onwer to withdraw", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.cheaperWithdraw()).to.be
                .reverted;
        });
    });
});

// 11:36
