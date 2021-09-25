// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;




import "/v1contract.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Demonzv2 is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public MAX_TOKENS = 15000;
    uint256 public MAX_PER_TX = 20;
    uint256 public MAX_PER_WALLET = 50;
    uint256 public PRICE = 0.06 ether;
    uint256 public CURRENT_TOKEN_ID = 0; // for testing 

    string public BEGINNING_URI = "test";
    string public ENDING_URI = ".json";

    MockDemonzv1 public demonzv1;

    bool public ALLOW_MINTING = false;

    constructor(MockDemonzv1 _demonzv1) ERC721 ("CryptoDemonzV2", "DEMONZv2") {
        demonzv1 = _demonzv1;
    }

    modifier safeMinting {
        require(ALLOW_MINTING, "Minting has not begun yet");
        _;
    }

    event tokenMinted(address _sender, uint256 _amount);
    event tokenSacrificed(address _sender);    

    /// @notice standard minting function
    /// @param _amount to be minted
    function mintToken(uint256 _amount) external payable safeMinting() {
        require(msg.value == _amount * PRICE, "Incorrect amount of ETH sent");
        require(_amount <= MAX_PER_TX, "Too many tokens queried for minting");
        require(totalSupply() + _amount <= MAX_TOKENS, "Not enough NFTs left to mint");
        require(balanceOf(msg.sender) + _amount <= MAX_PER_WALLET, "Exceeds wallet max allowed balance");

        for (uint256 i=0; i<_amount; ++i) {
            _safeMint(msg.sender, totalSupply());
            _incrementTokenId();
        }

        emit tokenMinted(msg.sender, _amount);
    }

    /// @notice will mint demonzv2 for 3 demonzv1
    /// @param _ids array of demonzv1 ids to be burned
    function burnV1(uint256[] memory _ids) external payable safeMinting() {
        require(_ids.length == 3, "You should burn only 3");
        require(totalSupply() + _ids.length <= MAX_TOKENS, "Not enough NFTs left to mint");
        require(balanceOf(msg.sender) + _ids.length <= MAX_PER_WALLET, "Exceeds wallet max allowed balance");
        for (uint256 i=0; i<_ids.length; ++i) {
            require(IERC721(demonzv1).ownerOf(_ids[i]) == msg.sender, "Sender is not owner");
            IERC721(demonzv1).safeTransferFrom(msg.sender, address(this), _ids[i]);
            demonzv1.burnToken(_ids[i]);
        }

        _safeMint(msg.sender, totalSupply());
        _incrementTokenId();
        
        emit tokenSacrificed(msg.sender);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(BEGINNING_URI, tokenId.toString(), ENDING_URI));
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function toggleMinting() external onlyOwner {
        ALLOW_MINTING = !ALLOW_MINTING;
    }

    function setBeginningURI(string memory _new_uri) external onlyOwner {
        BEGINNING_URI = _new_uri;
    }

    function setEndingURI(string memory _new_uri) external onlyOwner {
        ENDING_URI = _new_uri;
    }

    /// @notice dummy function for unit testing
    function _incrementTokenId() internal {
        ++CURRENT_TOKEN_ID;
    }

    /// @notice dummy function for unit testing
    function getCurrentTokenId() view external returns (uint256) {
        return CURRENT_TOKEN_ID;
    }

    /// @dev DO NOT FORMAT THIS TO PURE, even tho compiler is asking
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
     
}