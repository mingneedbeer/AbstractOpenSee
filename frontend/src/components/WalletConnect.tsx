import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { useCallback, useState } from "react";
import { Providers } from "./Providers";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function WalletConnectInner() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [open, setOpen] = useState(false);

  const handleConnect = useCallback(() => {
    const connector = connectors[0];
    if (connector) connect({ connector });
  }, [connect, connectors]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setOpen(false);
  }, [disconnect]);

  if (isConnected && address) {
    return (
      <div className="wallet-container">
        <button
          className="btn btn-secondary wallet-btn"
          onClick={() => setOpen(!open)}
        >
          <span className="wallet-dot" />
          {truncateAddress(address)}
          {balance && (
            <span className="wallet-balance">
              {parseFloat(balance.formatted).toFixed(4)} ETH
            </span>
          )}
        </button>
        {open && (
          <>
            <div className="wallet-backdrop" onClick={() => setOpen(false)} />
            <div className="wallet-dropdown">
              <div className="wallet-dropdown-header">
                <p className="address-truncated">{address}</p>
                {balance && (
                  <p className="wallet-balance-lg">
                    {parseFloat(balance.formatted).toFixed(4)} ETH
                  </p>
                )}
              </div>
              <div className="wallet-dropdown-actions">
                <a
                  href={`/profile/${address}`}
                  className="wallet-action"
                  onClick={() => setOpen(false)}
                >
                  My Profile
                </a>
                <a
                  href={`/profile/${address}?tab=created`}
                  className="wallet-action"
                  onClick={() => setOpen(false)}
                >
                  My NFTs
                </a>
              </div>
              <div className="wallet-dropdown-footer">
                <button
                  className="btn btn-ghost"
                  onClick={handleDisconnect}
                  style={{ width: "100%" }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={handleConnect}
      disabled={isPending}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}

export function WalletConnect() {
  return (
    <Providers>
      <WalletConnectInner />
    </Providers>
  );
}
