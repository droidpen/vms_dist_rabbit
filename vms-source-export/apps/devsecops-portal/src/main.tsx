import React from 'react';
import ReactDOM from 'react-dom/client';
import { DevSecOpsDashboard } from '../../../src/app/components/DevSecOpsDashboard';
import '../../../src/styles/index.css';

console.log('DevSecOps Portal main.tsx loading...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevSecOpsDashboard />
  </React.StrictMode>
);
