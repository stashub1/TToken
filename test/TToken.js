var TToken = artifacts.require("./TToken.sol");


contract('TToken', function(accounts) {

	var tokenInstance;

	it('sete total supply unpon deloyment', function() {
		return TToken.deployed()
		.then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000, "totalSupply is wrong");
			
		})
	
	})
})  