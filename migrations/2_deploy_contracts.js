const TToken = artifacts.require("./TToken.sol");

module.exports = function (deployer) {
  deployer.deploy(TToken, 1000000, 'TToken', 'TT');
};
	