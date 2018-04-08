const Web3 = require('web3')
const contract = require("truffle-contract")

let provider = new Web3.providers.HttpProvider("http://localhost:7545")
let contracts = require("../../solidity/build/contracts/Recorder.json")
let MyContract = contract(contracts)

MyContract.setProvider(provider)

exports.get_state = function (req, res){
  MyContract.deployed().then(function(instance) {
    console.log(instance)
    return instance.getRecords(req.params.userId, req.params.socketId).then(function(result) {
      let lastState = result[0].map((col, i) => result.map(row => row[i]))
      // console.log(lastState)
      res.send(lastState[lastState.length-1])
    })
  }).catch(function(err){
      console.log(err)
  });
}

exports.start_contract = function (req, res){
  MyContract.deployed().then(function(instance) {
      return instance.startRecord(req.params.userId, req.params.socketId, 0,{ from: MyContract.web3.eth.accounts[0] }) // start with 0 Wh
    })
    .catch(function(err){
      console.log(err)
  });
  res.json(
    '{"message": "You started power consumption", "socketId": "' + req.params.socketId + '"}'
  );
}

exports.stop_contract = function (req, res){
  MyContract.deployed().then(function(instance) {
      return instance.stopRecord(req.params.userId, req.params.socketId, Math.random() * 100,{ from: MyContract.web3.eth.accounts[0] }) // start with 0 Wh
    })
    .catch(function(err){
      console.log(err)
  });
  res.json(
    '{"message": "You stopped power consumption", "socketId": "' + req.params.socketId + '"}'
  );
}