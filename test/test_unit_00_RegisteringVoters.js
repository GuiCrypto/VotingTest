const Voting = artifacts.require("Voting");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("Voting", accounts => {

    let VotingInstance;

    const owner = accounts[0];
    const voterA = accounts[1];
    const voterB = accounts[3];
    const voterC = accounts[4];
    const other = accounts[5];
    console.log("owner", owner)
    console.log("voterA", voterA)
    console.log("voterB", voterB)
    console.log("voterC", voterC)
    console.log("other", other)

    describe ("1st Step - RegisteringVoters", () => {
        before(async() => {
            VotingInstance = await Voting.new({from: owner});
        })

        context ("Regular Usage", () => {

            it("Check WorkflowStatus", async() => {
                result = await VotingInstance.workflowStatus();
                expect(result).to.be.bignumber.equal(new BN(0));
            });

            it("owner add voterA", async() => {
                result = await VotingInstance.addVoter(voterA, {from: owner})
                await expectEvent(result, 'VoterRegistered', {voterAddress: voterA});
            });

            it("owner add voterB", async() => {
                result = await VotingInstance.addVoter(voterB, {from: owner})
                await expectEvent(result, 'VoterRegistered', {voterAddress: voterB});
            });

            it("VoterA get voterB", async() => {
                result = await VotingInstance.getVoter(voterB, {from: voterA})
                expect(result.isRegistered).to.equal(true);
                expect(result.hasVoted).to.equal(false);
                expect(result.votedProposalId).to.be.bignumber.equal(BN(0));
            });

            it("VoterB get other", async() => {
                result = await VotingInstance.getVoter(other, {from: voterB})
                expect(result.isRegistered).to.equal(false);
                expect(result.hasVoted).to.equal(false);
                expect(result.votedProposalId).to.be.bignumber.equal(new BN(0));

            });


            it("Check ProposalID", async() => {
                result = await VotingInstance.winningProposalID();
                expect(result).to.be.bignumber.equal(new BN(0));
            });


        })

        context ("Deviant Usage", () => {

            // it("Check GENSIS Proposal", async() => {
            //     result = VotingInstance.getOneProposal(0, {from: voterA})
            //     await expectRevert(result, "Index out of range");
            // });

            it("Voter cannot add voter", async() => {
                result = VotingInstance.addVoter(voterB, {from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Other cannot add voter", async() => {
                result = VotingInstance.addVoter(voterB, {from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });


            it("add two time same voter", async() => {
                result = VotingInstance.addVoter(voterB, {from: owner})
                await expectRevert(result, "Already registered");
            });

            it("Owner get Proposal", async() => {
                result = VotingInstance.getOneProposal(0, {from: owner})
                await expectRevert(result, "You're not a voter");
            });

            it("Other get Proposal", async() => {
                result = VotingInstance.getOneProposal(0, {from: other})
                await expectRevert(result, "You're not a voter");
            });

            it("Owner AddProposal", async() => {
                result = VotingInstance.addProposal("Proposition 1", {from: owner})
                await expectRevert(result, "You're not a voter");
            });

            it("Other AddProposal", async() => {
                result = VotingInstance.addProposal("Proposition 1", {from: other})
                await expectRevert(result, "You're not a voter");
            });

            it("Voter AddProposal", async() => {
                result = VotingInstance.addProposal("Proposition 1", {from: voterA})
                await expectRevert(result, "Proposals are not allowed yet");
            });

            it("Owner launch endProposalsRegistering", async() => {
                result = VotingInstance.endProposalsRegistering({from: owner})
                await expectRevert(result, "Registering proposals havent started yet");
            });

            it("Other launch endProposalsRegistering", async() => {
                result = VotingInstance.endProposalsRegistering({from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Voter launch endProposalsRegistering", async() => {
                result = VotingInstance.endProposalsRegistering({from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Owner launch endVotingSession", async() => {
                result = VotingInstance.endVotingSession({from: owner})
                await expectRevert(result, "Voting session havent started yet");
            });

            it("Other launch endVotingSession", async() => {
                result = VotingInstance.endVotingSession({from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Voter launch endVotingSession", async() => {
                result = VotingInstance.endVotingSession({from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Owner launch startVotingSession", async() => {
                result = VotingInstance.startVotingSession({from: owner})
                await expectRevert(result, "Registering proposals phase is not finished");
            });

            it("Other launch startVotingSession", async() => {
                result = VotingInstance.startVotingSession({from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Voter launch startVotingSession", async() => {
                result = VotingInstance.startVotingSession({from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Owner launch tallyVotes", async() => {
                result = VotingInstance.tallyVotes({from: owner})
                await expectRevert(result, "Current status is not voting session ended");
            });

            it("Other launch tallyVotes", async() => {
                result = VotingInstance.tallyVotes({from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Voter launch tallyVotes", async() => {
                result = VotingInstance.tallyVotes({from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Owner launch GetVoter", async() => {
                result = VotingInstance.getVoter( voterA, {from: owner})
                await expectRevert(result, "You're not a voter");
            });

            it("Other launch GetVoter", async() => {
                result = VotingInstance.getVoter(voterA, {from: other})
                await expectRevert(result, "You're not a voter");
            });

            it("Other from RegisteringVoters to ProposalsRegistrationStarted", async() => {
                result = VotingInstance.startProposalsRegistering({from: other})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

            it("Voterfrom RegisteringVoters to ProposalsRegistrationStarted", async() => {
                result =  VotingInstance.startProposalsRegistering({from: voterA})
                await expectRevert(result, "Ownable: caller is not the owner");
            });

        })

        context ("Check next level passing", () => {
            it("from RegisteringVoters to ProposalsRegistrationStarted", async() => {
                await VotingInstance.startProposalsRegistering({from: owner})
                result = await VotingInstance.workflowStatus();
                expect(result).to.be.bignumber.equal(new BN(1));
            });
        })

    });


});