const TToken = artifacts.require("./TToken.sol");

module.exports = function (deployer) {
  deployer.deploy(TToken);
};
	