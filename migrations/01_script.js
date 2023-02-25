const voting = artifacts.require("Voting");

module.exports= async (deployer)=>{
    await deployer.deploy(voting);
    let instance = await voting.deployed();
}
