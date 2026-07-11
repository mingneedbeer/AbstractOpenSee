import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Providers } from "./Providers";

const KITTY_ADDRESS = "0x865da0c38205d4489749ec8f083e8d38c17d4234";

function MintKittyInner() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState("");

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  async function handleMint() {
    setError("");
    try {
      writeContract({
        address: KITTY_ADDRESS,
        abi: [{
          name: "mintKitty",
          type: "function",
          inputs: [],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "payable",
        }],
        functionName: "mintKitty",
        args: [],
        value: parseEther("0.001"),
      }, {
        onSuccess: (hash) => setTxHash(hash),
        onError: (err) => setError(err.message),
      });
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="mint-kitty-card">
      <div className="mint-kitty-icon">🐱</div>
      <h3>Mint a CryptoKitty</h3>
      <p className="mint-kitty-desc">
        Each CryptoKitty is a unique NFT. Mint one and list it on the marketplace.
      </p>
      <div className="mint-kitty-price">0.001 ETH</div>
      <button
        onClick={handleMint}
        className="btn btn-primary"
        disabled={isPending || isConfirming || !isConnected}
        style={{ width: "100%" }}
      >
        {!isConnected
          ? "Connect Wallet"
          : isPending || isConfirming
          ? "Minting..."
          : "Mint Kitty"}
      </button>
      {txHash && (
        <a
          href={`https://explorer.testnet.abs.xyz/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: 8 }}
        >
          View Transaction
        </a>
      )}
      {error && <p className="form-error">{error}</p>}

      <style>{`
        .mint-kitty-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 32px;
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }
        .mint-kitty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        .mint-kitty-desc {
          color: var(--color-text-secondary);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .mint-kitty-price {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}

export function MintKitty() {
  return (
    <Providers>
      <MintKittyInner />
    </Providers>
  );
}
