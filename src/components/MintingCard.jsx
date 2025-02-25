import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/web3Config';

export function MintingCard() {
  const { isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  // Read contract data
  const { data: mintPrice } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'MINT_PRICE',
  });

  const { data: currentTokenId } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'currentTokenId',
    watch: true,
  });

  // Write contract
  const { write: mint, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mint',
    value: mintPrice,
  });

  const { isLoading: isTransactionPending } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    setIsMinting(isTransactionPending);
  }, [isTransactionPending]);

  const handleMint = async () => {
    try {
      await mint?.();
    } catch (error) {
      console.error('Error minting:', error);
    }
  };

  return (
    <div className="mint-container">
      <div className="card">
        <h1>Sudoku NFT Collection</h1>
        <p>Mint your unique Sudoku puzzle NFT</p>
        
        <div className="stats">
          <div className="stat-card">
            <div className="stat-value">{currentTokenId?.toString() || '0'}</div>
            <div className="stat-label">NFTs Minted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {mintPrice ? `${parseFloat(mintPrice) / 10**18} ETH` : '0.001 ETH'}
            </div>
            <div className="stat-label">Mint Price</div>
          </div>
        </div>

        <button 
          className="button"
          onClick={handleMint}
          disabled={!isConnected || isMinting}
        >
          {!isConnected 
            ? 'Connect Wallet'
            : isMinting 
              ? 'Minting...'
              : 'Mint NFT'
          }
        </button>
      </div>
    </div>
  );
}