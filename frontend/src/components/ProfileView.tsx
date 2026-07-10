import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { User, NFT } from "../lib/types";
import { NFTGrid } from "./NFTGrid";

interface ProfileViewProps {
  address: string;
}

export function ProfileView({ address }: ProfileViewProps) {
  const [user, setUser] = useState<User | null>(null);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUser(address).catch(() => null),
      api.getUserNFTs(address),
    ])
      .then(([userData, nftData]) => {
        setUser(userData);
        setNFTs(nftData.items);
      })
      .finally(() => setLoading(false));
  }, [address]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  function truncate(addr: string) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt="" />
          ) : (
            <div className="profile-avatar-placeholder">
              {address.slice(2, 4).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">
            {user?.username || truncate(address)}
          </h1>
          <p className="profile-address address-truncated">{address}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{nfts.length}</span>
              <span className="stat-label">NFTs</span>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Collected</h2>
        <NFTGrid
          initialNFTs={nfts}
          total={nfts.length}
          owner={address}
          emptyMessage="No NFTs collected yet"
        />
      </div>
      <style>{`
        .profile-header {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          padding: 40px 0;
          border-bottom: 1px solid var(--color-border);
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-primary), #a29bfe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 700;
        }
        .profile-username {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .profile-address {
          margin-bottom: 12px;
        }
        .profile-bio {
          font-size: 15px;
          color: var(--color-text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .profile-stats {
          display: flex;
          gap: 24px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }
        .stat-label {
          font-size: 13px;
          color: var(--color-text-secondary);
        }
        @media (max-width: 640px) {
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
