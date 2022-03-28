// node subscribe.js "ws://localhost:8545" 0x0AfCeA5C523A1D3ec219ca662d16C2DBa83ABc85
// node subscribe.js "http://localhost:8545" 0x0AfCeA5C523A1D3ec219ca662d16C2DBa83ABc85
//
var args = process.argv.slice(2);
if (args.length < 2) {
  console.log("not enough parameters");
  process.exit(1);
}

if (
  !(
    args[0].startsWith("ws://") ||
    args[0].startsWith("wss://") ||
    args[0].startsWith("http://") ||
    args[0].startsWith("https://")
  )
) {
  console.log("invalid endpoint:", args[0]);
  process.exit(1);
}

const Web3 = require("web3");
var web3 = new Web3(args[0]);

var contractAddress = args[1];
var factoryTopics = [
  web3.utils.sha3("PairCreated(address,address,address,uint256)"),
];

var pairTopics = [
  [
    web3.utils.sha3("Mint(address,uint256,uint256)"),
    web3.utils.sha3("Burn(address,uint256,uint256,address)"),

    web3.utils.sha3("Swap(address,uint256,uint256,uint256,uint256,address)"),
    web3.utils.sha3("Sync(uint112,uint112)"),
  ],
];

if (args[0].startsWith("ws://") || args[0].startsWith("wss://")) {
  handleFactoryEvent(function (data) {
    console.log("FACTORY:", data);
    const pairAddress = decodePairAddress(data.data);
    handlePairEvent(pairAddress, function (data2) {
      console.log("PAIR:", data2);
    });
  });
} else {
  web3.eth
    .getPastLogs({
      address: contractAddress,
      topics: factoryTopics,
      fromBlock: 0,
    })
    .then((items) => {
      items.forEach((data) => {
        console.log("FACTORY:", data);
        const pairAddress = decodePairAddress(data.data);
        web3.eth
          .getPastLogs({
            address: pairAddress,
            topics: pairTopics,
            fromBlock: 0,
          })
          .then((data2) => {
            data2.forEach((x) => {
              console.log("PAIR:", x);
            });
          });
      });
    });
}

function handleFactoryEvent(callback) {
  web3.eth
    .subscribe("logs", {
      fromBlock: 0,
      address: contractAddress,
      topics: factoryTopics,
    })
    .on("data", callback);
}

function handlePairEvent(pairAddress, callback) {
  web3.eth
    .subscribe("logs", {
      fromBlock: 0,
      address: pairAddress,
      topics: pairTopics,
    })
    .on("data", callback);
}

function decodePairAddress(data) {
  const typesArray = [{ type: "address", name: "pair" }];
  const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);
  return decodedParameters.pair;
}
