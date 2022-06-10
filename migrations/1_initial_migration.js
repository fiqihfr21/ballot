var Ballot = artifacts.require("./Ballot.sol");
const { ethers } = require('ethers');

module.exports = function(deployer) {

  deployer.deploy(Ballot, 
    ["0x666f6f0000000000000000000000000000000000000000000000000000000000","0x6261720000000000000000000000000000000000000000000000000000000000"] , // [foo, bar]
    1654758242, // starttime on 9 jun 2022 00 7:04 AM
    1662756840, // endtime on 9 sep 2022 8:54 PM
    {
      value: ethers.utils.parseEther("0.1")
    }
  );
};
