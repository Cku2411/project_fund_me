//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// import
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// error codes
error FundMe__NotOwner();

// Contract
/** @title A contract for crowd fungding
 * @author Cku2411
 * @notice this contract is to demo a sample funding contract
 * @dev this implements price feeds as our library
 * */

contract Fundme {
    // Type declaration
    // state Variable
    AggregatorV3Interface private s_priceFeed;
    uint256 public constant minimumUsd = 50 * 10 ** 18;
    address[] private s_funders;
    address private immutable i_owner;
    mapping(address => uint256) private s_addressToAmountFunded;

    // Modifier
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    // CONSTRUCTOR
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //What happens if someone sedns this contracat ETH without calling the fund function
    //receiver()
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice this function funds this contract
     * @dev this implements price feeds as our library
     *
     * */

    function callMeRightAway() public {}

    function fund() public payable {
        //Want to be able to set a minimum amount in USD
        require(
            PriceConverter.getConversionRater(msg.value, s_priceFeed) >
                minimumUsd,
            "Didn't send enough"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        //reset the array
        s_funders = new address[](0);
        //actual withdraw ETH

        //transfer

        //send
        // bool sendSuccess =  payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        //call, return 2 variables
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        // the purpose is to read array in memory other than reading from storage
        // so we create a copy array in memory and using looping there.
        address[] memory funders = s_funders;
        //mapping can't be in memory
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    // GETTER FUNCTION

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getAddressToAmountFunded(
        address _funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[_funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
