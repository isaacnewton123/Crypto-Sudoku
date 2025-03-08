// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @title IRecipient
 * @notice Interface for safe withdrawal
 */
interface IRecipient {
    function onEtherReceived() external payable;
}

/**
 * @title SudokuNFT
 * @author Updated by Claude
 * @notice This contract allows users to mint Sudoku puzzle NFTs
 * @dev Extends ERC721Enumerable for better token management
 */
contract SudokuNFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    // Constants
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    
    // Using memory variables instead of constant strings to avoid gas estimation issues
    function getNftName() public pure returns (string memory) {
        return "Sudoku Puzzle";
    }
    
    function getNftDescription() public pure returns (string memory) {
        return "A unique Sudoku puzzle NFT collection";
    }
    
    function getNftImage() public pure returns (string memory) {
        return "https://raw.githubusercontent.com/isaacnewton123/Crypto-Sudoku/refs/heads/main/Sudoku_NFT.png";
    }
    
    // State variables
    uint256 public currentTokenId;
    bool public mintingActive = true;
    mapping(address => bool) public hasMinted;
    
    // Events
    event SudokuNFTMinted(address indexed minter, uint256 indexed tokenId);
    event MintingStatusChanged(bool newStatus);
    event Withdrawal(address indexed to, uint256 amount);
    
    // Custom errors
    error MintingInactive();
    error MaxSupplyReached();
    error InsufficientPayment();
    error AlreadyMinted();
    error WithdrawalFailed();
    error InvalidTokenId();
    
    /**
     * @notice Constructor initializes the NFT contract
     */
    constructor() ERC721("Sudoku_NFT", "SUDOKU") Ownable(msg.sender) {
        currentTokenId = 0;
    }
    
    /**
     * @notice Modifier to check if minting is allowed
     */
    modifier mintingAllowed() {
        if (!mintingActive) revert MintingInactive();
        if (currentTokenId >= MAX_SUPPLY) revert MaxSupplyReached();
        _;
    }
    
    /**
     * @notice Allows users to mint a Sudoku NFT
     * @dev Implements one mint per wallet restriction, except for the owner
     */
    function mint() external payable nonReentrant mintingAllowed {
        // Check payment
        if (msg.value < MINT_PRICE) revert InsufficientPayment();
        
        // Check if already minted (except for owner)
        if (msg.sender != owner() && hasMinted[msg.sender]) revert AlreadyMinted();
        
        // Effect: increment token ID and mark wallet as minted
        uint256 newTokenId = currentTokenId + 1;
        currentTokenId = newTokenId;
        
        if (msg.sender != owner()) {
            hasMinted[msg.sender] = true;
        }
        
        // Interaction: mint the token
        _safeMint(msg.sender, newTokenId);
        
        // Emit event
        emit SudokuNFTMinted(msg.sender, newTokenId);
        
        // Check if max supply reached after minting
        if (newTokenId >= MAX_SUPPLY) {
            mintingActive = false;
            emit MintingStatusChanged(false);
        }
    }
    
    /**
     * @notice Enable or disable minting functionality
     * @param _status New minting status
     */
    function setMintingActive(bool _status) external onlyOwner {
        mintingActive = _status;
        emit MintingStatusChanged(_status);
    }
    
    /**
     * @notice Returns the metadata URI for a token
     * @param tokenId The ID of the token
     * @return Metadata URI as a string
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert InvalidTokenId();
        
        string memory nftName = getNftName();
        string memory nftDescription = getNftDescription();
        string memory nftImage = getNftImage();
        string memory tokenIdStr = tokenId.toString();
        
        bytes memory dataURI = abi.encodePacked(
            "{",
                "\"name\": \"", nftName, " #", tokenIdStr, "\",",
                "\"description\": \"", nftDescription, "\",",
                "\"image\": \"", nftImage, "\",",
                "\"attributes\": [",
                    "{",
                        "\"trait_type\": \"Puzzle Number\",",
                        "\"value\": \"", tokenIdStr, "\"",
                    "}",
                "]",
            "}"
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                _encode(dataURI)
            )
        );
    }
    
    /**
     * @notice Returns the maximum supply of tokens
     * @return Maximum supply as an integer
     */
    function getMaxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }
    
    /**
     * @notice Returns current minting status
     * @return Boolean indicating if minting is active
     */
    function isMintingActive() external view returns (bool) {
        if (currentTokenId >= MAX_SUPPLY) {
            return false;
        }
        return mintingActive;
    }
    
    /**
     * @notice Checks if a wallet has already minted
     * @param wallet Address to check
     * @return Boolean indicating if wallet has minted
     */
    function hasWalletMinted(address wallet) external view returns (bool) {
        return hasMinted[wallet];
    }
    
    /**
     * @notice Returns the number of tokens remaining that can be minted
     * @return Number of tokens remaining
     */
    function remainingTokens() external view returns (uint256) {
        if (currentTokenId >= MAX_SUPPLY) {
            return 0;
        }
        uint256 remaining = MAX_SUPPLY - currentTokenId;
        return remaining;
    }
    
    /**
     * @notice Allows owner to withdraw contract funds
     * @dev Uses ReentrancyGuard to prevent reentrant calls
     * Uses the Check-Effects-Interactions pattern
     */
    function withdraw() external onlyOwner nonReentrant {
        // Check
        address payable ownerAddress = payable(owner());
        uint256 amount = address(this).balance;
        
        // Effect (no state changes needed here)
        
        // Interaction (using a safer transfer method)
        (bool success, ) = ownerAddress.call{value: amount}("");
        if (!success) revert WithdrawalFailed();
        
        // Emit after successful transfer
        emit Withdrawal(ownerAddress, amount);
    }

    /**
     * @notice Checks if a token exists
     * @param tokenId Token ID to check
     * @return Boolean indicating if token exists
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @notice Encodes data to Base64
     * @param data Bytes to encode
     * @return Base64 encoded string
     */
    function _encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";

        // Avoid division where possible by using multiplication
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        uint256 i = 0;
        uint256 j = 0;

        while (i < len) {
            uint256 a = i < len ? uint8(data[i++]) : 0;
            uint256 b = i < len ? uint8(data[i++]) : 0;
            uint256 c = i < len ? uint8(data[i++]) : 0;

            uint256 triple = (a << 16) + (b << 8) + c;

            result[j++] = bytes1(bytes(table)[uint8((triple >> 18) & 0x3F)]);
            result[j++] = bytes1(bytes(table)[uint8((triple >> 12) & 0x3F)]);
            result[j++] = bytes1(bytes(table)[uint8((triple >> 6) & 0x3F)]);
            result[j++] = bytes1(bytes(table)[uint8(triple & 0x3F)]);
        }

        if (len % 3 == 1) {
            result[encodedLen - 1] = bytes1(0x3d);  // "="
            result[encodedLen - 2] = bytes1(0x3d);  // "="
        } else if (len % 3 == 2) {
            result[encodedLen - 1] = bytes1(0x3d);  // "="
        }

        return string(result);
    }
}