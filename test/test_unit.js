const Voting = artifacts.require("Voting");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("Voting", accounts => {

    let VotingInstance;

    const owner = accounts[0];
    const voterA = accounts[1];
    const voterB = accounts[3];
    const voterC = accounts[4];

    describe ("1st Step - RegisteringVoters", () => {
        before(async() => {
            VotingInstance = await Voting.new({from: owner});
            //VotingInstance = await Voting.deployed({from: owner});
            console.log('LOG', VotingInstance);
        })

        it("owner add voterA", async() => {
            result = VotingInstance.addVoter(voterA, {from: owner})
            await expectRevert(result, "Ownable: caller is not the owner");
        });

        it("only owner can add voter", async() => {
            result = VotingInstance.addVoter(voterB, {from: voterA})
            await expectRevert(result, "Ownable: caller is not the owner");
        });
    });


});