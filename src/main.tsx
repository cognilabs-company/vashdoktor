import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable scroll-reveal styling before first paint so [data-reveal] elements
// start hidden without a flash. If JS never ran, they stay visible (no class).
document.documentElement.classList.add('js-reveal');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
