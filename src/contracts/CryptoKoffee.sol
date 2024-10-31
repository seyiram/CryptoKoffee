// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CryptoKoffee {
    address public owner;
    uint public totalBalance;
    uint public totalNumberOfDonations;
    bool private _entered;

    struct Payment {
        uint amount;
        uint timeStamp;
        address sender;
        address recipient;
        string description;
    }

    struct WalletInfo {
        address walletAddress;
        uint currentBalance;
        uint numOfDonations;
    }

    mapping(address => Payment[]) public payments;
    mapping(address => WalletInfo) private walletMapping;

    event DonationEvent(uint amount, address indexed donor, uint indexed timeStamp, address indexed recipient);
    event WalletInfoEvent(address walletAddress, uint currentWalletBalance, uint numOfDonations);
    event PaymentEvent(uint indexed amount, uint indexed timeStamp, address sender, address indexed recipient, string description);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        _entered = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier validateTransferAmount() {
        require(msg.value > 0, "Transfer amount has to be greater than 0.");
        _;
    }

    modifier validateWalletOwner(address ownerAddress) {
        require(walletMapping[ownerAddress].walletAddress == msg.sender, "Only Wallet owner can perform this activity.");
        _;
    }

    modifier validateRecipientAddress(address recipientAddress) {
        require(walletMapping[recipientAddress].walletAddress != address(0), "Your address is not registered on CryptoKoffee.");
        _;
    }

    modifier validateIfWalletExists(address senderAddress) {
        require(walletMapping[senderAddress].walletAddress != msg.sender, "A wallet is already associated to this address.");
        _;
    }

    modifier validateRecipientBalance(address recipientAddress) {
        require(walletMapping[recipientAddress].currentBalance > 0, "You don't have enough balance to withdraw.");
        _;
    }

    modifier nonReentrant() {
        require(!_entered, "ReentrancyGuard: reentrant call");
        _entered = true;
        _;
        _entered = false;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function hash(string memory _string) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(_string));
    }

    function createWallet() public validateIfWalletExists(msg.sender) {
        WalletInfo memory _wallet = WalletInfo(msg.sender, 0, 0);
        walletMapping[msg.sender] = _wallet;
        emit WalletInfoEvent(msg.sender, 0, 0);
    }

    function getWallet() public view returns(address walletAddress, uint walletBalance, uint numOfDonations) {
        WalletInfo storage _walletInfo = walletMapping[msg.sender];
        return (_walletInfo.walletAddress, _walletInfo.currentBalance, _walletInfo.numOfDonations);
    }

    function donate(address donationAddress) public payable validateRecipientAddress(donationAddress) validateTransferAmount nonReentrant {
        uint fee = msg.value * 5 / 100;
        uint donationAmount = msg.value - fee;

        totalBalance += donationAmount;

        totalNumberOfDonations++;
        walletMapping[donationAddress].currentBalance += donationAmount;
        walletMapping[donationAddress].numOfDonations++;

        emit DonationEvent(donationAmount, msg.sender, block.timestamp, donationAddress);
        emit PaymentEvent(donationAmount, block.timestamp, msg.sender, donationAddress, "donation");

        (bool success, ) = owner.call{value: fee}("");
        require(success, "Fee transfer failed.");
    }

    function getDonationBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawFunds(address payable _to, uint _amount) public payable validateWalletOwner(msg.sender) validateRecipientAddress(_to) validateRecipientBalance(_to) nonReentrant {
        require(walletMapping[_to].currentBalance >= _amount, "You can't withdraw more than you have in your wallet!");
        walletMapping[_to].currentBalance -= _amount;
        totalBalance -= _amount;
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed.");
        emit PaymentEvent(_amount, block.timestamp, msg.sender, _to, "withdraw");
    }
}
