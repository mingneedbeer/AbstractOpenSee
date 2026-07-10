export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-icon" style={{ fontSize: 18 }}>◆</span>
          <span style={{ fontWeight: 700 }}>OpenSee</span>
          <span className="footer-text">NFT Marketplace on Abstract Testnet</span>
        </div>
        <div className="footer-links">
          <a
            href="https://abs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Abstract Chain
          </a>
          <a
            href="https://github.com/ming/AbstractOpenSee"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
        </div>
      </div>
      <style>{`
        .footer {
          border-top: 1px solid var(--color-border);
          padding: 32px 0;
          margin-top: 64px;
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-text {
          font-size: 13px;
          color: var(--color-text-secondary);
          margin-left: 8px;
        }
        .footer-links {
          display: flex;
          gap: 16px;
        }
        .footer-link {
          font-size: 13px;
          color: var(--color-text-secondary);
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--color-text);
        }
        @media (max-width: 640px) {
          .footer-inner {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .footer-text {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}
