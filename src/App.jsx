// src/App.jsx
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mintSepolia, monadTestnet } from './config/networks';
import { ThemeProvider } from './context/ThemeContext';
import Game from './components/Game';
import './styles/global.css';
import './styles/theme.css';
import '@rainbow-me/rainbowkit/styles.css';

// Konfigurasi dengan kedua jaringan (Mint Sepolia dan Monad Testnet)
const config = getDefaultConfig({
  appName: 'Sudoku NFT Game',
  projectId: 'abd69daf0c462c572fc2c5237e05430d',
  chains: [mintSepolia, monadTestnet],
  transports: {
    [mintSepolia.id]: http(),
    [monadTestnet.id]: http()
  }
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <div className="app">
              <Game />
            </div>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;