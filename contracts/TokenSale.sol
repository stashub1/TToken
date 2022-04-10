pragma solidity >=0.4.22 <0.9.0;
import "./TToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract TokenSale {

    using SafeMath for uint;

	address admin;
	TToken public tokenContract;
	uint public tokenPrice;
	uint public tokensSold;
	event Sell(address _buyer, uint _amount);

	constructor(TToken _tokenContract, uint _tokenPrice) public {
		 admin = msg.sender;
		 tokenContract = _tokenContract;
		 tokenPrice = _tokenPrice;

	}

	function buyTokens(uint _numberOfTokens) public payable {
		require(msg.value == SafeMath.mul(_numberOfTokens,tokenPrice), "Value passed is wrong");
		require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "Not enough tokens in smart contract");
		require(tokenContract.transfer(msg.sender, _numberOfTokens));
		tokensSold += _numberOfTokens;
		emit Sell(msg.sender, _numberOfTokens);
	}

	function endSale() public {
		require(msg.sender == admin, "Not admin can not end the sale");
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		selfdestruct(payable(admin));
		//Require only admin can do this
		//Once we add the sale - transfer amount of tokens to admin
		//Destroy the contract
	}
}
