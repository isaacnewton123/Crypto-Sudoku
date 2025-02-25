// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract SudokuNFT is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public currentTokenId;
    string public constant NFT_NAME = "Sudoku Puzzle";
    string public constant NFT_DESCRIPTION = "A unique Sudoku puzzle NFT collection";
    string public constant NFT_IMAGE = "https://raw.githubusercontent.com/isaacnewton123/sudoku-NFT/refs/heads/main/image%20(1).png";
    
    constructor() ERC721("SudokuNFT", "SDKU") Ownable(msg.sender) {
        currentTokenId = 0;
    }
    
    function mint() external payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        currentTokenId++;
        _safeMint(msg.sender, currentTokenId);
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert("ERC721: invalid token ID");
        
        bytes memory dataURI = abi.encodePacked(
            "{",
                '"name": "', NFT_NAME, " #", tokenId.toString(), '",',
                '"description": "', NFT_DESCRIPTION, '",',
                '"image": "', NFT_IMAGE, '"',
            "}"
        );
        
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                _encode(dataURI)
            )
        );
    }
    
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function _encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";

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