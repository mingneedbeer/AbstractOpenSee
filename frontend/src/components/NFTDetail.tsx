import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther } from "viem";
import { api } from "../lib/api";
import type { NFT } from "../lib/types";
import { Providers } from "./Providers";

const MARKETPLACE_ADDRESS = "0x0000000000000000000000000000000000000000";

const MARKETPLACE_ABI = [
  {
    name: "listings",
    type: "function",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "seller", type: "address" },
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    name: "buyNFT",
    type: "function",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    name: "cancelListing",
    type: "function",
    inputs: [{ name: "listingId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

interface NFTDetailProps {
  nft: NFT;
}

function NFTDetailInner({ nft }: NFTDetailProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [actionError, setActionError] = useState("");

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const isOwner = isConnected && address?.toLowerCase() === nft.owner.toLowerCase();

  function truncate(addr: string) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  async function handleBuy() {
    setActionError("");
    try {
      writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: "buyNFT",
        args: [BigInt(1)],
        value: parseEther("0.01"),
      }, {
        onSuccess: (hash) => setTxHash(hash),
        onError: (err) => setActionError(err.message),
      });
    } catch (err: any) {
      setActionError(err.message);
    }
  }

  return (
    <div className="nft-detail">
      <div className="nft-detail-image-section">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="nft-detail-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x600/2a2a2a/ffffff?text=${encodeURIComponent(nft.name)}`;
            }}
          />
        ) : (
          <div className="nft-detail-placeholder">◆</div>
        )}
      </div>
      <div className="nft-detail-info">
        <h1 className="nft-detail-title">{nft.name}</h1>
        <p className="nft-detail-id">Token ID: #{nft.token_id}</p>

        <div className="nft-detail-section">
          <h3>Description</h3>
          <p>{nft.description || "No description provided."}</p>
        </div>

        <div className="nft-detail-meta">
          <div className="nft-detail-meta-item">
            <span className="meta-label">Contract</span>
            <span className="address-truncated">{truncate(nft.contract_address)}</span>
          </div>
          <div className="nft-detail-meta-item">
            <span className="meta-label">Owner</span>
            <a href={`/profile/${nft.owner}`} className="address-truncated" style={{ color: "var(--color-primary)" }}>
              {truncate(nft.owner)}
            </a>
          </div>
        </div>

        <div className="nft-detail-actions">
          {isOwner ? (
            <button className="btn btn-danger" onClick={handleBuy} disabled={isPending || isConfirming}>
              {isPending || isConfirming ? "Processing..." : "Cancel Listing"}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleBuy} disabled={isPending || isConfirming || !isConnected}>
              {!isConnected
                ? "Connect to Buy"
                : isPending || isConfirming
                ? "Processing..."
                : "Buy Now"}
            </button>
          )}
          {txHash && (
            <a
              href={`https://explorer.testnet.abs.xyz/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              View on Explorer
            </a>
          )}
        </div>
        {actionError && <p className="form-error">{actionError}</p>}
      </div>
      <style>{`
        .nft-detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 40px 0;
        }
        .nft-detail-image-section {
          position: sticky;
          top: calc(var(--header-height) + 40px);
          height: fit-content;
        }
        .nft-detail-image {
          width: 100%;
          border-radius: var(--radius-lg);
          background: var(--color-bg);
        }
        .nft-detail-placeholder {
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          color: var(--color-primary);
        }
        .nft-detail-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .nft-detail-id {
          font-size: 14px;
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }
        .nft-detail-section {
          margin-bottom: 24px;
        }
        .nft-detail-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .nft-detail-section p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }
        .nft-detail-meta {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: var(--color-bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          margin-bottom: 24px;
        }
        .nft-detail-meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .meta-label {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        .nft-detail-actions {
          display: flex;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .nft-detail {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .nft-detail-image-section {
            position: static;
          }
          .nft-detail-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export function NFTDetail(props: NFTDetailProps) {
  return (
    <Providers>
      <NFTDetailInner {...props} />
    </Providers>
  );
}
