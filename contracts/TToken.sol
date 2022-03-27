pragma solidity >=0.4.22 <0.9.0;

contract TToken {

	uint public totalSupply;
	string public name;
	string public symbol;
	mapping(address => uint) public balanceOf;

	event Transfer(address indexed _from, address indexed _to, uint _amount);

	constructor(uint _initialSupply, string memory _name, string memory _symbol ) public {
		name = _name;
		symbol = _symbol;
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
	}

	function transfer(address _to, uint _amount) public returns(bool success) {
		require(balanceOf[msg.sender] >= _amount, 
				"There is not enough tokens at sender's account");
		balanceOf[msg.sender]-= _amount;
		balanceOf[_to] += _amount;
		emit Transfer(msg.sender, _to, _amount);
		return true;
	}
}