// src/components/HomeScreen.jsx
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useChainId, useSwitchChain } from 'wagmi'
import '../styles/home.css'
import { mintSepolia, monadTestnet } from '../config/networks'

const HomeScreen = ({ onStart, hasNFT, networkName, isSignatureVerifying = false }) => {
  const MINT_URL = "https://mint.cryptosudoku.xyz"
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  const handleExit = () => {
    window.location.href = "https://cryptosudoku.xyz"
  }

  const supportedNetworks = [mintSepolia, monadTestnet]

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Crypto Sudoku Game</h1>
        
        <div className="wallet-section">
          <div className="connect-wallet-wrapper">
            <ConnectButton label="Connect Wallet" />
          </div>
        </div>

        {hasNFT ? (
          <div className="status-message success">
            You are eligible to play this game. Click Start to continue.
          </div>
        ) : (
          <div className="status-message error">
            You need to own an NFT to play this game. Mint one{' '}
            <a href={MINT_URL} target="_blank" rel="noopener noreferrer">
              here
            </a>
          </div>
        )}

        <div className="action-buttons">
          {hasNFT && (
            <button 
              className="btn btn-primary btn-large" 
              onClick={onStart}
              disabled={isSignatureVerifying}
            >
              {isSignatureVerifying ? 'Please sign message...' : 'Start Game'}
            </button>
          )}
          <button className="btn btn-secondary btn-large" onClick={handleExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen