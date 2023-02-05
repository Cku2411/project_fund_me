//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getDecimals() internal view returns (uint8) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB
        );
        uint8 decimals = priceFeed.decimals();
        return decimals;
    }

    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB
        // );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 10000000000);
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB
        );
        return priceFeed.version();
    }

    function getDescription() internal view returns (string memory) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB
        );
        return priceFeed.description();
    }

    function getConversionRater(
        uint256 gpuAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint gpuPrice = getPrice(priceFeed);
        uint256 gpuAmountInUsd = (gpuAmount * gpuPrice) / 1000000000000000000;
        return gpuAmountInUsd;
    }
}
