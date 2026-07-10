import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { api } from "../lib/api";

const MARKETPLACE_ADDRESS = "0x0000000000000000000000000000000000000000";

export function ListingForm() {
  const { address, isConnected } = useAccount();
  const [form, setForm] = useState({
    nftContract: "",
    tokenId: "",
    price: "",
    name: "",
    description: "",
    image: "",
  });
  const [step, setStep] = useState<"form" | "approve" | "list" | "done">("form");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState("");

  const { writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    const nftContract = form.nftContract as `0x${string}`;
    const tokenId = BigInt(form.tokenId);
    const price = form.price;

    if (!nftContract || !tokenId || !price || !form.name) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setStep("approve");
      writeContract({
        address: nftContract,
        abi: [{
          name: "approve",
          type: "function",
          inputs: [
            { name: "to", type: "address" },
            { name: "tokenId", type: "uint256" },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        }],
        functionName: "approve",
        args: [MARKETPLACE_ADDRESS, tokenId],
      }, {
        onSuccess: (hash) => setTxHash(hash),
        onError: (err) => {
          setError(err.message);
          setStep("form");
        },
      });
    } catch (err: any) {
      setError(err.message);
      setStep("form");
    }
  }

  async function handleList() {
    setError("");
    const nftContract = form.nftContract as `0x${string}`;
    const tokenId = BigInt(form.tokenId);
    const price = parseEther(form.price);

    try {
      setStep("list");
      writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: [{
          name: "listNFT",
          type: "function",
          inputs: [
            { name: "nftContract", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "nonpayable",
        }],
        functionName: "listNFT",
        args: [nftContract, tokenId, price],
      }, {
        onSuccess: async (hash) => {
          setTxHash(hash);
          await api.createNFT({
            token_id: Number(form.tokenId),
            contract_address: nftContract,
            name: form.name,
            description: form.description,
            image: form.image || undefined,
            owner: address,
          });
          setStep("done");
        },
        onError: (err) => {
          setError(err.message);
          setStep("form");
        },
      });
    } catch (err: any) {
      setError(err.message);
      setStep("form");
    }
  }

  if (step === "done") {
    return (
      <div className="empty-state">
        <div style={{ fontSize: 48, marginBottom: 16 }}>◆</div>
        <h3>NFT Listed Successfully!</h3>
        <p>Your NFT is now listed on OpenSee marketplace.</p>
        <a href="/explore" className="btn btn-primary" style={{ marginTop: 24, display: "inline-flex" }}>
          View Marketplace
        </a>
      </div>
    );
  }

  if (step === "approve" || step === "list") {
    return (
      <div className="loading" style={{ flexDirection: "column", gap: 16 }}>
        <div className="spinner" />
        <p style={{ color: "var(--color-text-secondary)" }}>
          {step === "approve" ? "Approving marketplace to transfer NFT..." : "Creating listing..."}
        </p>
        {txHash && (
          <a
            href={`https://explorer.testnet.abs.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View transaction
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <div className="listing-form-grid">
        <div className="form-group">
          <label className="form-label">NFT Contract Address *</label>
          <input
            name="nftContract"
            value={form.nftContract}
            onChange={handleChange}
            placeholder="0x..."
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Token ID *</label>
          <input
            name="tokenId"
            value={form.tokenId}
            onChange={handleChange}
            placeholder="1"
            type="number"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Price (ETH) *</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.01"
            type="number"
            step="0.0001"
            min="0.0001"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">NFT Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="My Awesome NFT"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your NFT..."
            rows={3}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending || !isConnected}
        style={{ width: "100%", marginTop: 16 }}
      >
        {isPending ? "Confirm in Wallet..." : "List NFT"}
      </button>
      {!isConnected && (
        <p className="form-hint">Connect your wallet to list an NFT</p>
      )}
      <style>{`
        .listing-form {
          max-width: 600px;
          margin: 0 auto;
        }
        .listing-form-grid {
          display: grid;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .form-error {
          color: var(--color-danger);
          font-size: 13px;
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(255, 71, 87, 0.1);
          border-radius: var(--radius-sm);
        }
        .form-hint {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-top: 8px;
        }
      `}</style>
    </form>
  );
}
