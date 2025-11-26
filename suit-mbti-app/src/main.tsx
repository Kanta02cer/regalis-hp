import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 既存のHTMLサイトに埋め込むためのエントリーポイント
// <div id="regalis-suit-app"></div> にマウントします
const rootElement = document.getElementById('regalis-suit-app')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  console.error('Element with id "regalis-suit-app" not found')
}

