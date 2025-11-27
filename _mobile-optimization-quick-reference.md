# モバイル最適化 クイックリファレンス

## 🎯 実装済み項目（Phase 1）

### ✅ タイポグラフィ

```css
/* ベースフォントサイズ */
body {
    font-size: 16px; /* 最小16pxで可読性を確保 */
    line-height: 1.75;
    letter-spacing: 0.02em;
}

/* 見出しサイズ（可変） */
h1 { font-size: clamp(2rem, 8vw, 3rem); }
h2 { font-size: clamp(1.75rem, 6vw, 2.5rem); }
h3 { font-size: clamp(1.5rem, 5vw, 2rem); }
```

### ✅ タッチターゲット

```css
/* ボタン */
.btn {
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;
}

/* フォーム要素 */
input, textarea, select {
    min-height: 44px;
    font-size: 16px; /* iOSでのズームを防止 */
}
```

### ✅ レイアウト

```css
/* セクションの余白 */
.section {
    padding: clamp(3rem, 8vw, 4rem) 1.25rem;
}

/* コレクションカード */
.collection-item {
    grid-template-columns: 1fr; /* モバイルは1列 */
    gap: 2rem;
}
```

### ✅ ヒーローセクション

```css
.section--hero {
    min-height: 70vh;
}

.hero-frame h1 {
    font-size: clamp(2rem, 10vw, 3rem);
}

.hero-cta {
    flex-direction: column; /* 縦並び */
    width: 100%;
}
```

---

## 📱 ブレークポイント

### 現在の実装

- **モバイル**: `max-width: 768px`
- **小型スマートフォン**: `max-width: 480px`
- **タブレット**: `min-width: 768px`
- **デスクトップ**: `min-width: 1024px`

### 推奨する追加ブレークポイント

- **中型スマートフォン**: `max-width: 640px`
- **大型デスクトップ**: `min-width: 1280px`

---

## 🔧 よく使うパターン

### 1. 可変フォントサイズ

```css
font-size: clamp(最小値, 推奨値, 最大値);
```

**例:**
```css
h1 { font-size: clamp(2rem, 8vw, 3rem); }
```

### 2. タッチターゲットの最適化

```css
.element {
    min-width: 44px;
    min-height: 44px;
    touch-action: manipulation;
}
```

### 3. モバイルでの1列レイアウト

```css
.grid {
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

### 4. 可変パディング

```css
padding: clamp(最小値, 推奨値, 最大値);
```

**例:**
```css
.section {
    padding: clamp(3rem, 8vw, 4rem) 1.25rem;
}
```

---

## 📋 チェックリスト

### 実装前の確認

- [ ] viewportメタタグが設定されている
- [ ] フォントサイズが16px以上
- [ ] タッチターゲットが44x44px以上
- [ ] 行間が適切に設定されている（1.5-1.8）
- [ ] 画像がレスポンシブ対応している

### 実装後の確認

- [ ] 実機でのテストを実施
- [ ] Lighthouseモバイルスコアが90点以上
- [ ] Core Web Vitalsが「良好」
- [ ] すべてのデバイスで正しく表示される

---

## 🚀 次のステップ

1. **パフォーマンス最適化**（Phase 2）
   - 画像の最適化
   - フォント読み込みの最適化
   - CSS/JSの最小化

2. **ユーザビリティ改善**（Phase 2）
   - スクロール体験の改善
   - アニメーションの最適化
   - フォーム入力の最適化

3. **高度な機能**（Phase 3）
   - スワイプジェスチャー
   - プルツリフレッシュ
   - オフライン対応

---

## 📚 参考リソース

- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Web.dev - Mobile-Friendly](https://web.dev/mobile-friendly/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

