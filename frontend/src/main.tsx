import React from 'react';
import ReactDOM from 'react-dom/client';
import { WrappedApp } from './App';
import { SmartContractService } from './services/smart-contract.service';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>
);
