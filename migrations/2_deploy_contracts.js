const path = require("path");
require('dotenv').config({path: path.join(__dirname, '../.env')});
const fs = require('fs');


const TRACTeleport = artifacts.require("TRACTeleport");
const TestTraceToken = artifacts.require("TestTraceToken");

module.exports = async function (deployer, network, accounts) {
    // const constants = require('../constants.js')[network];
    // if (constants.staking_address) {
    //     throw Error(`Contract is already deployed on ${network}, remove the file first before deployment`);
    // }
    let trac_contract, teleport_contract;
    const address_filepath = `./contract_addresses/${network}_address.json`;

    if (network === 'ganache' || network === 'development') {

        const startTime = 1;

        await deployer.deploy(TestTraceToken);
        trac_contract = await TestTraceToken.deployed();
        await deployer.deploy(TRACTeleport, 0, trac_contract.address);

        teleport_contract = await TRACTeleport.deployed();
        const data = {address: teleport_contract.address};
        fs.writeFileSync(address_filepath, JSON.stringify(data, null, 4));

    }

    if (network === 'mumbai') {
        // only deploying one batch on testnet for interface testing
        const startTime = process.env.MUMBAI_START_TIME;
        const trac_address = process.env.MUMBAI_TRAC_ADDRESS;//'0x10ed38c374b2f5bba3e85b9c478b9fc69559355b';

        await deployer.deploy(TRACTeleport, startTime, trac_address);
        teleport_contract = await TRACTeleport.deployed();
        const data = {address: teleport_contract.address};
        fs.writeFileSync(address_filepath, JSON.stringify(data, null, 4));
    }

    if (network === 'mainnet') {

        if (!process.env.MAINNET_SAFEOWNER) {
            console.log('MAINNET_SAFEOWNER for deployment not defined in env file! Aborting')
            process.exit(1);
        }
        if (!process.env.MAINNET_BATCH) {
            console.log('Mainnet BATCH for deployment not defined in env file! Aborting')
            process.exit(1);
        }
        const batch = process.env.MAINNET_BATCH;
        const newOwner = process.env.MAINNET_SAFEOWNER;
        console.log('Deploying contracts for BATCH=', batch);

        let batchParams = JSON.parse(fs.readFileSync('batch_params.json'));
        const startTime = batchParams[batch].startTime;
        const trac_address = process.env.MAINNET_TRAC_ADDRESS;//'0x10ed38c374b2f5bba3e85b9c478b9fc69559355b';

        console.log("Parameters: startTime=" + startTime + " , trac_address=" + trac_address);

        await deployer.deploy(TRACTeleport, startTime, trac_address);
        teleport_contract = await TRACTeleport.deployed();
        const data = {address: teleport_contract.address};

        console.log("Transferring ownership to: " + newOwner)
        await teleport_contract.transferOwnership(newOwner);

        let readOwner = await teleport_contract.owner.call();
        console.log("Observed owner: ",readOwner);
        fs.writeFileSync(address_filepath, JSON.stringify(data, null, 4));

    }
};