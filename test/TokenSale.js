var TokenSale = artifacts.require("./TokenSale.sol");
var TToken = artifacts.require("./TToken.sol");

contract('TokenSale', function(accounts) {

	var tokenSaleInstance;
	var tokenInstance;
	var admin = accounts[0];
	var tokenPrice = 1000000000000000;
	var buyer = accounts[1];
	var tokensAvailable = 750000;
	var numberOfTokens = 10;

	it('Initializes TokenSale contract with initial values', function() {
		return TokenSale.deployed()
		.then(function(instance) {
			tokenSaleInstance  = instance;
			return tokenSaleInstance.address
		}).then(function(address) {
			assert.notEqual(address, 0x0, "Contract has a Zero address")
			return tokenSaleInstance.tokenContract;
		}).then(function(tokenContractAdr) {
			assert.notEqual(tokenContractAdr, 0x0, "No token contract");
			return tokenSaleInstance.tokenPrice()
			.then(function (price) {
				assert.equal(price, tokenPrice, 'Not correct token price' )
			})
		})
	})

	it("Buying tokens testing", function() {
		return TToken.deployed()
		.then(function (instance) {
			tokenInstance = instance;
			return TokenSale.deployed()
		}).then(function (instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance;			
		}).then(function (instance) {
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from : admin})
		}).then(function (receipt) {
			return tokenSaleInstance.buyTokens(numberOfTokens,
					 {from : buyer, value : numberOfTokens * tokenPrice} )
		}).then(function(receipt) {
			console.log(receipt);
			assert.equal(receipt.logs.length, 1, "Not a 1 log inside receipt")
			assert.equal(receipt.logs[0].event, "Sell", "Not a sell event");
			assert.equal(receipt.logs[0].args._buyer, buyer, "Wrong buyer")
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, "Wrong number of tokens");
			return tokenSaleInstance.tokensSold();
		}).then(function(amount) { 
			assert.equal(amount.toNumber(), numberOfTokens, "Wrong number of tokens sold");
			return tokenInstance.balanceOf(buyer)
		}).then(function(balance) {
			console.log("Buyer Balance", balance);
			assert.equal(balance.toNumber(), numberOfTokens, "Balance is not correct");
			//Buy tokens for lower amunt of value
			return tokenInstance.balanceOf(tokenSaleInstance.address)
		}).then(function(balance) {
			console.log("TokenSaleInstance Balance", balance);
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, "Amount of tokens is wrong");
			return tokenSaleInstance.buyTokens(numberOfTokens, { from : buyer, value : 1} )
		}).then(assert.fail).catch(function (error) {
			assert(error.message.indexOf('revert') >= 0,  "Message value is wrong for buying tokens");
			return tokenSaleInstance.buyTokens(800000,
					 {from : buyer, value : numberOfTokens * tokenPrice} )		
		}).then(assert.fail).catch(function (error) {
			assert(error.message.indexOf('revert') >= 0,  
							"Cannot purchase more tokens than available");		
		})
	})
// 		.then(function(receipt) {
// 
// 		})

	it('Ends tokensale', function () {
			//Get token instance first
		return TToken.deployed()
		.then(function (instance) {
			tokenInstance = instance;
			//Get tokensale instance secondly
			return TokenSale.deployed()
		}).then(function (instance) {
			tokenSaleInstance = instance;
			//Try to end sale not by admin
			return tokenSaleInstance.endSale( {from : accounts[5]})
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 
				"No revert was done after ending sale by not admin");
			return tokenSaleInstance.endSale({from : admin})
		}).then(function (receipt) {
			return tokenInstance.balanceOf(admin) 
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 999990, 
					"Wrong amount of tokens in admin account after end of sale" );
			return tokenSaleInstance.tokenPrice()
		}).then(function(tokenPrice) {
			assert.equal(tokenPrice, 0, "Token price is not initialized back to 0");
		})
	})

});