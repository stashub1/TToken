const TToken = artifacts.require("./TToken.sol");
const TokenSale = artifacts.require("./TokenSale.sol");

module.exports = function (deployer) {

  var tokenPrice = 1000000000000000;

  deployer.deploy(TToken, 1000000, 'TToken', 'TT')
  .then(function() {
  	return deployer.deploy(TokenSale, TToken.address, tokenPrice);
  })
  

};
	