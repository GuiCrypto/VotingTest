const Voting = artifacts.require("Voting");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("Voting", accounts => {

    let VotingInstance;

    const owner = accounts[0];
    const voterA = accounts[1];
    const voterB = accounts[3];
    const voterC = accounts[4];
    console.log("owner", owner)
    console.log("voterA", voterA)
    console.log("voterB", voterB)
    console.log("voterC", voterC)

    describe ("1st Step - RegisteringVoters", () => {
        before(async() => {
            VotingInstance = await Voting.new({from: owner});
            //VotingInstance = await Voting.deployed({from: owner});
            // console.log('LOG', VotingInstance);
        })

        it("owner add voterA", async() => {
            result = await VotingInstance.addVoter(voterA, {from: owner})
            console.log(result);
            await expectEvent(result, 'VoterRegistered', {voterAddress: voterA});
        });

        it("only owner can add voter", async() => {
            result = VotingInstance.addVoter(voterB, {from: voterA})
            await expectRevert(result, "Ownable: caller is not the owner");
        });
    });


});