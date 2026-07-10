import { useState } from "react";
import { WalletConnect } from "./WalletConnect";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="/" className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">OpenSee</span>
        </a>

        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <a href="/explore" className="nav-link" onClick={() => setMenuOpen(false)}>
            Explore
          </a>
          <a href="/create" className="nav-link" onClick={() => setMenuOpen(false)}>
            Create
          </a>
          <a
            href="https://explorer.testnet.abs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Explorer
          </a>
        </nav>

        <div className="header-actions">
          <WalletConnect />
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
          height: var(--header-height);
        }
        .header-inner {
          display: flex;
          align-items: center;
          height: 100%;
          gap: 32px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 800;
        }
        .logo-icon {
          font-size: 24px;
          color: var(--color-primary);
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .nav-link {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          transition: all 0.2s;
        }
        .nav-link:hover {
          color: var(--color-text);
          background: var(--color-bg-hover);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
        }
        .menu-toggle span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--color-text);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .wallet-container {
          position: relative;
        }
        .wallet-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 13px;
        }
        .wallet-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-success);
        }
        .wallet-balance {
          font-size: 12px;
          color: var(--color-text-secondary);
          font-weight: 400;
        }
        .wallet-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99;
        }
        .wallet-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 100;
          width: 280px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .wallet-dropdown-header {
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
        }
        .wallet-balance-lg {
          font-size: 18px;
          font-weight: 600;
          margin-top: 4px;
        }
        .wallet-dropdown-actions {
          padding: 8px;
        }
        .wallet-action {
          display: block;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--color-text);
          transition: background 0.2s;
        }
        .wallet-action:hover {
          background: var(--color-bg-hover);
        }
        .wallet-dropdown-footer {
          padding: 8px;
          border-top: 1px solid var(--color-border);
        }
        @media (max-width: 768px) {
          .nav {
            display: none;
            position: absolute;
            top: var(--header-height);
            left: 0;
            right: 0;
            background: var(--color-bg);
            border-bottom: 1px solid var(--color-border);
            flex-direction: column;
            padding: 16px;
          }
          .nav-open {
            display: flex;
          }
          .menu-toggle {
            display: flex;
          }
          .header-actions {
            margin-left: auto;
          }
        }
      `}</style>
    </header>
  );
}
