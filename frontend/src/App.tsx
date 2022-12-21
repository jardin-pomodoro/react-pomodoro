import { MantineProvider } from '@mantine/core';

import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <Routes>
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
        colorScheme: 'dark',
      }}
    >
      <HashRouter>
        <App />
      </HashRouter>
    </MantineProvider>
  );
}
