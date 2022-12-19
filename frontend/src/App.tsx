import { MantineProvider } from '@mantine/core';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import BuySeed from './pages/BuySeedPage';

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
