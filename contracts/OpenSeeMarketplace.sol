// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract OpenSeeMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    uint256 private _nextListingId;
    mapping(uint256 => Listing) public listings;
    uint256 public feePercent = 250;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    event ListingCancelled(uint256 indexed listingId);
    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 price
    );

    constructor() Ownable(msg.sender) {}

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        IERC721 nft = IERC721(nftContract);
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "Not the owner of this NFT"
        );
        require(
            nft.getApproved(tokenId) == address(this) ||
                nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        nft.transferFrom(msg.sender, address(this), tokenId);
        uint256 listingId = _nextListingId++;
        listings[listingId] = Listing(
            msg.sender,
            nftContract,
            tokenId,
            price,
            true
        );
        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, price);
        return listingId;
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        listing.active = false;
        IERC721(listing.nftContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        emit ListingCancelled(listingId);
    }

    function buyNFT(
        uint256 listingId
    ) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        listing.active = false;
        uint256 fee = (listing.price * feePercent) / 10000;
        uint256 sellerProceeds = listing.price - fee;
        IERC721(listing.nftContract).transferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );
        payable(listing.seller).transfer(sellerProceeds);
        emit ItemSold(listingId, msg.sender, listing.price);
    }

    function setFeePercent(uint256 _feePercent) external onlyOwner {
        feePercent = _feePercent;
    }

    function getActiveListings(
        uint256 offset,
        uint256 limit
    ) external view returns (Listing[] memory) {
        uint256 total = _nextListingId;
        uint256 count = 0;
        for (uint256 i = offset; i < total && count < limit; i++) {
            if (listings[i].active) count++;
        }
        Listing[] memory result = new Listing[](count);
        uint256 idx = 0;
        for (uint256 i = offset; i < total && idx < limit; i++) {
            if (listings[i].active) {
                result[idx] = listings[i];
                idx++;
            }
        }
        return result;
    }
}
