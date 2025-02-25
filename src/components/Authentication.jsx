// src/components/Authentication.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/auth.css';

const Authentication = () => {
  return (
    <div className="auth-container">
      <h1 className="auth-title">Sudoku NFT Game</h1>
      <p className="auth-description">
        Connect your wallet to play this NFT-gated Sudoku game
      </p>
      <ConnectButton />
      
      <div className="auth-info">
        <div className="network-info">
          <h3>Network Details</h3>
          <p>Network: <span className="highlight">Mint Sepolia Testnet</span></p>
          <p>Chain ID: <span className="highlight">1687</span></p>
          <p>Currency: <span className="highlight">0x697ETH</span></p>
        </div>
        <div className="nft-info">
          <h3>NFT Contract</h3>
          <p className="contract-address">
            {NFT_CONTRACT}
          </p>
          <a 
            href={`https://sepolia-testnet-explorer.mintchain.io/address/${NFT_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="explorer-link"
          >
            View on Explorer ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
