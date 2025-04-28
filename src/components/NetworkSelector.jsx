// src/components/NetworkSelector.jsx
import { useChainId, useSwitchChain } from 'wagmi';
import '../styles/network-selector.css';
import { mintSepolia, monadTestnet } from '../config/networks';

const NetworkSelector = () => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const supportedNetworks = [mintSepolia, monadTestnet];

  const getNetworkName = (id) => {
    const network = supportedNetworks.find(net => net.id === id);
    return network ? network.name : 'Unknown Network';
  };

  const handleNetworkChange = (e) => {
    const selectedNetworkId = Number(e.target.value);
    if (selectedNetworkId !== chainId) {
      switchChain({ chainId: selectedNetworkId });
    }
  };

  // Adding correct return statement
  return (
    <div className="network-selector">
      <select 
        className="network-dropdown"
        value={chainId}
        onChange={handleNetworkChange}
      >
        {supportedNetworks.map(network => (
          <option key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSelector;