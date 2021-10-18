pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERC20 is AccessControl {
   string public name;
   string public symbol;
   uint8 public decimals;
   uint public totalSupply;
   mapping(address => uint) public balances;
   mapping(address => mapping(address => uint)) public allowed;
   
   event Transfer(address indexed _from, address indexed _to, uint256 _value);
   event Approval(address indexed _owner, address indexed _spender, uint256 _value);

   bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
   bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
   
   constructor(
       string memory _name,
       string memory _symbol,
       uint8 _decimals,
       uint _totalSupply,
       address minter,
       address burner
   ) {
       name = _name;
       symbol = _symbol;
       decimals = _decimals;
       totalSupply = _totalSupply;
       balances[msg.sender] = _totalSupply;
       _setupRole(MINTER_ROLE, minter);
       _setupRole(BURNER_ROLE, burner);
   }

   function transfer(address _to, uint _value) public returns (bool success) {
       require(balances[msg.sender] >= _value, 'balance must be >= _value');
       balances[msg.sender] -= _value;
       balances[_to] += _value;
       emit Transfer(msg.sender, _to, _value);
       return true;
   }

   function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
       require(allowed[_from][msg.sender] >= _value, 'msg.sender must be approved to transfer >= _value');
       require(balances[_from] >= _value, 'balance of _from must be >= _value');
       allowed[_from][msg.sender] -= _value;
       balances[_from] -= _value;
       balances[_to] += _value;
       emit Transfer(msg.sender, _to, _value);
       return true;
   }

   function approve(address _spender, uint _value) public returns (bool) {
       require(msg.sender != _spender);
       allowed[msg.sender][_spender] = _value;
       emit Approval(msg.sender, _spender, _value);
       return true;
   }

   function increaseAllowance(address _spender, uint _value) public returns (bool){
       uint allowedValue = allowed[msg.sender][_spender];
       approve(_spender, allowedValue + _value);
       return true;
   }

   function decreaseAllowance(address _spender, uint _value) public returns (bool){
       uint allowedValue = allowed[msg.sender][_spender];
       require(allowedValue >= _value, '_value must be <= allowedValue');
       approve(_spender, allowedValue - _value);
       return true;
   }

   function mint(address _to, uint _value)  public {
       require(hasRole(MINTER_ROLE, msg.sender), "msg.sender must be a minter");
       totalSupply += _value;
       balances[_to] += _value;
       emit Transfer(address(0), _to, _value);
   }

   function burn(address _from, uint _value)  public {
       require(hasRole(BURNER_ROLE, msg.sender), "msg.sender must be a burner");
       require(allowed[_from][msg.sender] >= _value, 'burner must be approved to burn >= _value');
       require(balances[_from] >= _value, 'balance must be >= _value');
       balances[_from] -= _value;
       totalSupply -= _value;
       emit Transfer(msg.sender, address(0), _value);
   }

   function balanceOf(address _owner) public view returns (uint) {
       return balances[_owner];
   }

   function allowance(address _owner, address _spender) public view returns (uint) {
       return allowed[_owner][_spender];
   }

}