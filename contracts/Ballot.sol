// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract Ballot {
    struct Voter {
        uint256 weight; // weight is accumulated by delegation
        bool voted; // if true, that person already voted
        uint256 vote; // index of the voted proposal
    }

    struct Proposal {
        // If you can limit the length to a certain number of bytes,
        // always use one of bytes1 to bytes32 because they are much cheaper
        bytes32 name; // short name (up to 32 bytes)
        uint256 voteCount; // number of accumulated votes
    }

    address public chairperson;
    uint256 public rewardValue = 0.1 ether;
    uint256 public voteStartTime;
    uint256 public voteEndTime;
    // address payable public randomVoterHighestVoted;
    bool ended;

    Proposal[] public proposals;
    address[] public voterAdresses;

    mapping(address => Voter) public voters;

    /**
     * @dev Create a new ballot to choose one of 'proposalNames'.
     */
    constructor(
        bytes32[] memory proposalNames_,
        uint256 voteStartTime_,
        uint256 voteEndTime_
    )
    payable
    {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        voteStartTime = voteStartTime_;
        voteEndTime = voteEndTime_;

        for (uint256 i = 0; i < proposalNames_.length; i++) {
            proposals.push(Proposal({name: proposalNames_[i], voteCount: 0}));
        }
    }

    /**
     * @dev Give 'voter' the right to vote on this ballot. May only be called by 'chairperson'.
     */
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
        uint256 currentVoterAddresess = voterAdresses.length;
        voterAdresses[currentVoterAddresess] = voter;
    }

    /**
     * @dev Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'.
     */
    function vote(uint256 proposal) public {
        Voter storage sender = voters[msg.sender];
        require(block.timestamp > voteStartTime, "Voting hasn't started yet");
        require(block.timestamp < voteEndTime, "Voting ends");
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If 'proposal' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;
    }

    /**
     * @dev Computes the winning proposal taking all previous votes into account.
     */
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function randomVoterHighestVoted() internal view returns (address) {

        uint256 winningVoteCount = winningProposal();
        address[] memory _voters;
        uint256 _index;
        address temp;

        for (uint256 v = 0; v < voterAdresses.length; v++) {
            if (voters[voterAdresses[v]].vote == winningVoteCount) {
                _voters[_index] = voterAdresses[v];
                _index++;
            }
        }

        for (uint256 i = 0; i < _voters.length; i++) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(block.timestamp))) % (_voters.length - i);
            temp = _voters[n];
        }

        return temp;
    }

    /**
     * @dev Calls winningProposal() function to get the index of the winner contained in the proposals array
     */
    function winnerName()
        public
        view
        returns (bytes32 winnerName_, uint256 voteCount_)
    {
        winnerName_ = proposals[winningProposal()].name;
        voteCount_ = proposals[winningProposal()].voteCount;
    }

    /**
     * @dev Computes the winning proposal taking all previous votes into account.
     */
    function countEachProposal()
        public
        view
        returns (Proposal[] memory)
    {
        Proposal[] memory eachProposals = new Proposal[](proposals.length);
        for (uint i = 0; i < proposals.length; i++) {
            Proposal memory eachProposal = proposals[i];
            eachProposals[i] = eachProposal;
        }
        return eachProposals;
    }

    /**
     * @dev End the vote and send a random voter from the highest voted choice with 0.1ETH.
     */
    function VotingEnd() external {
        // 1. Conditions
        require(
            msg.sender == chairperson,
            "Only chairperson can end voting."
        );
        require(block.timestamp > voteEndTime, "Voting is not over yets");
        require(ended, "The function VotingEnd has already been called ");

        // 2. Effects
        address winner = randomVoterHighestVoted();

        // 3. Interaction
        require(address(this).balance > rewardValue, "Insufficient ETH");
        payable(winner).transfer(rewardValue);

        ended = true;
    }

}
