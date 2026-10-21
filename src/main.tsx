import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * ⚡ LIGHT-SPEED PWA LOADER & SELF-RELOAD SENTINEL
 * Hooks into mobile device browser engines, registers caching scripts, 
 * and handles background application hot-upgrades automatically.
 */
function initLightSpeedPwaSentinel() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  let refreshing = false;

  // Handle seamless hot-reload when new service worker takes over
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('⚡ [PWA HOT-SWAP] New service worker active. Refreshing application shell...');
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('⚡ [PWA SENTINEL] Service worker registered with scope:', registration.scope);

        // Check for updates on every launch
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('⚡ [PWA SENTINEL] New version available; skipping waiting...');
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('⚡ [PWA SENTINEL] Registration note:', err.message);
      });
  });
}

initLightSpeedPwaSentinel();

createRoot(document.getElementById('root')!).render(<App />);
