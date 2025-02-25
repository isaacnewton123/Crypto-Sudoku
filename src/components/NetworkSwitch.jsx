// src/components/NetworkSwitch.jsx
import { useEffect } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { mintSepolia } from '../config/networks';

const NetworkSwitch = ({ children }) => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (isConnected && chain?.id !== mintSepolia.id) {
      switchNetwork?.(mintSepolia.id);
    }
  }, [chain, isConnected, switchNetwork]);

  if (!isConnected) {
    return children;
  }

  if (chain?.id !== mintSepolia.id) {
    return (
      <div className="wrong-network-container">
        <div className="wrong-network-modal">
          <h2>Wrong Network</h2>
          <p>Please switch to Mint Sepolia Testnet to continue</p>
          <button
            className="switch-network-btn"
            onClick={() => switchNetwork?.(mintSepolia.id)}
          >
            Switch to Mint Sepolia
          </button>
        </div>
      </div>
    );
  }

  return children;
}