var TToken = artifacts.require("./TToken.sol");


contract('TToken', function(accounts) {

	var tokenInstance;

	it('initializes contract with name and symbol', function() {
		return TToken.deployed() 
		.then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(instanceName) {
			assert.equal(instanceName, 'TToken', "Name is wrong");
			return tokenInstance.symbol();
		}).then(function(instanceSymbol) {
			assert.equal(instanceSymbol, "TT", "Symbol is wrong");
		})
	})

	it('sets total supply unpon deloyment', function() {
		console.log(accounts);
		return TToken.deployed() 
		.then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, "totalSupply is wrong");
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance, 1000000, "Admin's account balance is wong");
		})
	})

	it('Token transfers', function() {
		return tokenInstance.transfer(accounts[1], 100000, {from : accounts[0]})
		.then(function (recipt) {
			assert.equal(recipt.logs.length, 1, "One event");
			assert.equal(recipt.logs[0].event, "Transfer", "Incorrect recipt event name");
			assert.equal(recipt.logs[0].args._from, accounts[0], "Incorrect recipt transfer from ");
			assert.equal(recipt.logs[0].args._to, accounts[1], "Incorrect recipt transfer to");
			assert.equal(recipt.logs[0].args._amount, 100000, "Incorrect recipt transfer amount");
			console.log(recipt);
			return tokenInstance.transfer.call(accounts[1], 10, {from : accounts[0]})
		}).then(function(success) {
			assert.equal(success, true, "Returned bool");
			return tokenInstance.balanceOf(accounts[1])
		}).then(function(balance) {
			assert(balance.toNumber(), 100000, "Balance of account of receiver is not correct");
			return tokenInstance.balanceOf(accounts[0])
		}).then(function(balance) {
			assert(balance.toNumber(), 900000, "Balance of admin is wrong");
		})
	})
})  