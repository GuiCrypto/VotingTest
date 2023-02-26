# VotingTest

Here we are testing all functions, event, mapping, enum, struc and array of `Voting.sol` smart contract.

## testing files

All testing files are allowed a `test` directory of this project.

There is a testing file for each step of `Voting.sol` smart contracts.

Each step are defined in enum `WorkflowStatus`, there is 6 steps then 6 tests file that are : 
* **RegisteringVoters** `test_unit_00_RegisteringVoters.js`,
* **ProposalsRegistrationStarted** `test_unit_01_RegisteringProposal.js`,
* **ProposalsRegistrationEnded** `test_unit_02_ProposalsRegistrationEnded.js`,
* **VotingSessionStarted** `test_unit_03_VotingSessionStarted.js`,
* **VotingSessionEnded** `test_unit_04_VotingSessionEnded.js`,
* **VotesTallied** `test_unit_05_VotesTallied.js`


All test files have the same organisation.


## tests organisation in each testing file

### 1 before hook

Here we create the voting conditions that allow us to reach the step (of the workflow status) that we want to test.

### Regular Usage

This step will test the elements of the script for normal use as defined by its specifications.

#### Check WorkflowStatus

We check that we have reached the workflowStatus that we want to test.

#### Do what is allowed at this step

We test the functionalities that become achievable in this step.

#### check initialized Getter

We check the state of the global variables for the proper functioning of the script for this step.

### Deviant Usage

During this step, we will test the uses that provoke reverts of the smart contract. We verify then that it is not possible to carry out actions that are not foreseen at the time ( `workflowStatus` step) we execute these tests.

#### Deviant only at this step

We test the uses specific to the `workflowStatus` tested.

#### Deviant for other steps too

We test the uses which must return an error but which are not specific to this `workflowStatus`. In other words we verify that what should return an error does return an error.

### Check next level passing

Finally we check that the transition to the next `workflowStatus` is correct.

## How to run the tests 

### default network

By default your tests are running on development network. To work properly you have to launch locally ganache on your network.

`ganache`

### All tests

To run all tests (by default on the development network) :

`truffle test`

To run all tests on Goerli :

`truffle test --network goerli`

> Do not forget to add .env file to configure your private key (mnemonic phrase) to access to an other network than development network.

> You can edit `truffle-config.js` and add specific configuration for an other network. 

### Run tests just for a specific WorkflowStatus

To run the tests only at the VotingSessionStarted stage.

`truffle test test/test_unit_03_VotingSessionStarted.js`

