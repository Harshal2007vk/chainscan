// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChain {
    struct Product {
        string  id;
        string  name;
        string  origin;
        string  shipment;
        uint256 cost;
        uint256 bulkPrice;
        string  batchId;
        string  temperature;
        uint256 manufacturedDate;
        uint256 expiryDate;
        uint256 scanCount;
        bool    exists;
    }

    mapping(string => Product) private products;
    address public owner;

    event ProductAdded(string productId, string name);
    event ProductScanned(string productId, uint256 timestamp);

    constructor() { owner = msg.sender; }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function addProduct(
        string memory _id, string memory _name,
        string memory _origin, string memory _shipment,
        uint256 _cost, uint256 _bulkPrice,
        string memory _batchId, string memory _temperature,
        uint256 _manufacturedDate, uint256 _expiryDate
    ) public onlyOwner {
        require(!products[_id].exists, "Product already exists");
        products[_id] = Product(
            _id, _name, _origin, _shipment,
            _cost, _bulkPrice, _batchId, _temperature,
            _manufacturedDate, _expiryDate, 0, true
        );
        emit ProductAdded(_id, _name);
    }

    function getProduct(string memory _id) public view returns (Product memory) {
        require(products[_id].exists, "Product not found");
        return products[_id];
    }

    function incrementScanCount(string memory _id) public {
        require(products[_id].exists, "Product not found");
        products[_id].scanCount++;
        emit ProductScanned(_id, block.timestamp);
    }

    function productExists(string memory _id) public view returns (bool) {
        return products[_id].exists;
    }
}
