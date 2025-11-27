import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 既存のHTMLサイトに埋め込むためのエントリーポイント
// <div id="regalis-suit-app"></div> にマウントします
console.log('React app script loaded');

function mountApp() {
const rootElement = document.getElementById('regalis-suit-app')

  if (!rootElement) {
    console.error('ERROR: Element with id "regalis-suit-app" not found');
    console.log('Available elements:', document.querySelectorAll('[id]'));
    return;
  }
  
  console.log('Found #regalis-suit-app element, mounting React app...');
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    );
    console.log('✓ React app mounted successfully');
  } catch (error) {
    console.error('ERROR mounting React app:', error);
  }
}

// DOMContentLoadedを待つ
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // DOMContentLoadedが既に発火している場合
  mountApp();
}

