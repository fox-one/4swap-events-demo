# 4swap-sync-demo

A simple demo of getting the [uniwap v2](https://docs.uniswap.org/protocol/V2/introduction) events from specific endpoint and contract.

These events include two parts,

- From Factory

```
event PairCreated(address indexed token0, address indexed token1, address pair, uint);
```

- From Pair

```
event Mint(address indexed sender, uint amount0, uint amount1);
event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);
```

## Run

Tested on node versions `v16.14.2` and `v17.6.0`.

1. Clone the project and enter it.
2. Run `npm install` to install dependencies.
3. Run `node subscribe.js <endpoint> <contract_address>`.
