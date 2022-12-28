import { MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import BuySeed from './pages/BuySeedPage';
import { contract as contractAbi, contractAddress } from './utils/constants';

export function App() {
  return (
    <Routes>
      <Route path="/buy" element={<BuySeed />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export function WrappedApp() {
  //const web3 = new Web3('ws://localhost:8545');
  //const contract = new web3.eth.Contract(contractAbi, contractAddress);
  return (
    <MantineProvider
      withCSSVariables
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  );
}
