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

    describe ("1nd Step - RegisteringProposal", () => {
        before(async() => {
            VotingInstance = await Voting.new({from: owner});
            await VotingInstance.addVoter(voterA, {from: owner})
            await VotingInstance.addVoter(voterB, {from: owner})
            await VotingInstance.addVoter(voterC, {from: owner})
            await VotingInstance.startProposalsRegistering({from: owner})

        })

        context ("Regular Usage", () => {

            it("Check WorkflowStatus", async() => {
                result = await VotingInstance.workflowStatus()
                expect(result).to.be.bignumber.equal(new BN(1));
            });

            it("Voter A AddProposal 1", async() => {
                result = await VotingInstance.addProposal("Proposition 1", {from: voterA})
                await expectEvent(result, 'ProposalRegistered', {proposalId: BN(1)});
            });

            it("Voter B AddProposal 2", async() => {
                result = await VotingInstance.addProposal("Proposition 2", {from: voterB})
                await expectEvent(result, 'ProposalRegistered', {proposalId: BN(2)});
            });

            it("Voter C AddProposal 3", async() => {
                result = await VotingInstance.addProposal("Proposition 3", {from: voterC})
                await expectEvent(result, 'ProposalRegistered', {proposalId: BN(3)});
            });

            it("Voter A GetProposal 1", async() => {
                result = await VotingInstance.getOneProposal(1, {from: voterA})
                expect(result.description).to.equal("Proposition 1");
                expect(result.voteCount).to.be.bignumber.equal(BN(0));
            });

            it("Voter A GetProposal 2", async() => {
                result = await VotingInstance.getOneProposal(2, {from: voterA})
                expect(result.description).to.equal("Proposition 2");
                expect(result.voteCount).to.be.bignumber.equal(BN(0));
            });

            it("Voter A GetProposal 3", async() => {
                result = await VotingInstance.getOneProposal(3, {from: voterA})
                expect(result.description).to.equal("Proposition 3");
                expect(result.voteCount).to.be.bignumber.equal(BN(0));
            });

            it("Check GENSIS Proposal", async() => {
                result = await VotingInstance.getOneProposal(0, {from: voterA})
                expect(result.description).to.equal("GENESIS");
                expect(result.voteCount).to.be.bignumber.equal(BN(0));
            });

            it("Check ProposalID", async() => {
                result = await VotingInstance.winningProposalID();
                expect(result).to.be.bignumber.equal(new BN(0));
            });


        })

        context ("Deviant Usage", () => {

            it("Owner cannot add new voter", async() => {
                result = VotingInstance.addVoter(other, {from: owner})
                await expectRevert(result, "Voters registration is not open yet");
            });

            it("Owner get Proposal", async() => {
                result = VotingInstance.getOneProposal(0, {from: owner})
                await expectRevert(result, "You're not a voter");
            });

            it("Other get Proposal", async() => {
                result = VotingInstance.getOneProposal(0, {from: other})
                await expectRevert(result, "You're not a voter");
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

            it("Owner from RegisteringVoters to ProposalsRegistrationStarted", async() => {
                result = VotingInstance.startProposalsRegistering({from: owner})
                await expectRevert(result, "Registering proposals cant be started now");
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
            it("from ProposalsRegistrationStarted to endProposalsRegistering", async() => {
                await VotingInstance.endProposalsRegistering({from: owner})
                result = await VotingInstance.workflowStatus();
                expect(result).to.be.bignumber.equal(new BN(2));
            });
        })

    });


});