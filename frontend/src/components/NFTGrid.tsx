import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { NFT } from "../lib/types";
import { NFTCard } from "./NFTCard";

interface NFTGridProps {
  initialNFTs?: NFT[];
  total?: number;
  owner?: string;
  collection?: string;
  search?: string;
  emptyMessage?: string;
}

export function NFTGrid({
  initialNFTs,
  total: initialTotal,
  owner,
  collection,
  search: initialSearch,
  emptyMessage = "No NFTs found",
}: NFTGridProps) {
  const [nfts, setNFTs] = useState<NFT[]>(initialNFTs || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch || "");

  const limit = 24;

  useEffect(() => {
    if (initialNFTs && page === 1 && !search) return;
    fetchNFTs();
  }, [page, owner, collection, search]);

  async function fetchNFTs() {
    setLoading(true);
    try {
      const result = await api.getNFTs({
        page,
        limit,
        owner,
        collection,
        search: search || undefined,
      });
      setNFTs(result.items);
      setTotal(result.total);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyMessage}</h3>
        {initialSearch && <p>Try a different search term</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-4">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
