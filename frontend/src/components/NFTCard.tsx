import type { NFT } from "../lib/types";

interface NFTCardProps {
  nft: NFT;
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <a href={`/nft/${nft.id}`} className="nft-card-link">
      <article className="card nft-card">
        <div className="nft-card-image-wrapper">
          {nft.image ? (
            <img
              src={nft.image}
              alt={nft.name}
              className="nft-card-image"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/400x400/2a2a2a/ffffff?text=${encodeURIComponent(nft.name)}`;
              }}
            />
          ) : (
            <div className="nft-card-placeholder">
              <span>◆</span>
            </div>
          )}
        </div>
        <div className="nft-card-body">
          <h3 className="nft-card-title">{nft.name}</h3>
          <p className="nft-card-id">
            #{nft.token_id}
          </p>
          <div className="nft-card-footer">
            <span className="address-truncated">
              {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </span>
          </div>
        </div>
      </article>
      <style>{`
        .nft-card-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .nft-card {
          cursor: pointer;
        }
        .nft-card-image-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          background: var(--color-bg);
          overflow: hidden;
        }
        .nft-card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .card:hover .nft-card-image {
          transform: scale(1.05);
        }
        .nft-card-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: var(--color-primary);
          background: linear-gradient(135deg, #1a1a2e, #16213e);
        }
        .nft-card-body {
          padding: 16px;
        }
        .nft-card-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nft-card-id {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-bottom: 8px;
        }
        .nft-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid var(--color-border);
        }
      `}</style>
    </a>
  );
}
