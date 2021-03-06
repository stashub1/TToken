pragma solidity >=0.4.22 <0.9.0;

contract TToken {

	uint public totalSupply;
	string public name;
	string public symbol;
	mapping(address => uint) public balanceOf;
	mapping(address => mapping(address => uint)) public allowance;

	event Transfer(address indexed _from, address indexed _to, uint _amount);
	event Approval(address indexed _owner, address indexed _spender, uint _amount);

	constructor(uint _initialSupply, string memory _name, 
										string memory _symbol ) public {
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

	function approve(address _spender, uint _amount) public returns(bool success) {
		allowance[msg.sender][_spender] = _amount;
		emit Approval(msg.sender, _spender, _amount);
		return true;
	}

	function transferFrom(address _from, address _to, uint _amount) public returns(bool success) {
		require(balanceOf[_from] >= _amount, "Not anough balance");
		require(allowance[_from][msg.sender] >= _amount, "Not enough allowance");
		balanceOf[_from] -= _amount;
		balanceOf[_to] += _amount;
		allowance[_from][msg.sender] -= _amount;
		emit Transfer(_from, _to, _amount);	
		return true;
	}

}