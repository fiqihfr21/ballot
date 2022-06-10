const Ballot = artifacts.require("./Ballot.sol");
const { ethers } = require('ethers');

contract("Ballot", accounts => {
  it("Should be the winner is the second candidate 2 (in array 1).", async () => {

    const values = [
      ["0x666f6f0000000000000000000000000000000000000000000000000000000000","0x6261720000000000000000000000000000000000000000000000000000000000"] , // [foo, bar]
      1654758242, // starttime on 9 jun 2022 00 7:04 AM
      1662756840, // endtime on 9 sep 2022 8:54 PM
    ];

    const BallotInstance = await Ballot.deployed(...values, {
      value: ethers.utils.parseEther("0.1")
    });

    // Vote 1 for second candidate
    await BallotInstance.vote(1, { from: accounts[0] });

    // Get winner candidate
    const winner = await BallotInstance.winningProposal.call();
    console.log(winner);

    assert.equal(winner, 1, "Winner is not second candidate.");
  });
});
