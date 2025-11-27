# モバイル最適化 開発計画書

## 📋 目次

1. [現状分析](#現状分析)
2. [改善目標](#改善目標)
3. [優先順位付け](#優先順位付け)
4. [詳細実装計画](#詳細実装計画)
5. [テスト計画](#テスト計画)
6. [実装スケジュール](#実装スケジュール)

---

## 1. 現状分析

### 1.1 現在のモバイル対応状況

#### ✅ 実装済み項目

- **viewportメタタグ**: `width=device-width, initial-scale=1.0` 設定済み
- **ハンバーガーメニュー**: モバイル用ナビゲーション実装済み
- **基本的なメディアクエリ**: `@media (max-width: 768px)` 実装済み
- **画像のレスポンシブ対応**: `<picture>`要素でWebP/PNG切り替え実装済み
- **フォントサイズの調整**: モバイルで18pxに設定

#### ⚠️ 改善が必要な項目

1. **タイポグラフィ**
   - フォントサイズの最適化不足（特に見出し）
   - 行間（line-height）の調整が必要
   - 文字間隔（letter-spacing）の最適化

2. **レイアウト**
   - セクション間の余白（padding/margin）の最適化
   - グリッドレイアウトのモバイル対応
   - コレクションカードの表示最適化

3. **タッチターゲット**
   - ボタンサイズの最適化（最小44x44px）
   - リンクのタッチ領域の拡大
   - フォーム要素の最適化

4. **パフォーマンス**
   - 画像の遅延読み込み（一部実装済み）
   - フォント読み込みの最適化
   - CSS/JSの最適化

5. **ユーザビリティ**
   - スクロール体験の改善
   - アニメーションの最適化（モバイルでの軽量化）
   - フォーム入力の最適化

### 1.2 主要なブレークポイント

現在の実装：
- `max-width: 768px` - モバイル
- `min-width: 768px` - タブレット
- `min-width: 1024px` - デスクトップ

推奨する追加ブレークポイント：
- `max-width: 480px` - 小型スマートフォン
- `max-width: 640px` - 中型スマートフォン
- `min-width: 1280px` - 大型デスクトップ

---

## 2. 改善目標

### 2.1 主要目標

1. **可読性の向上**
   - モバイルでの文字サイズを最適化（最小16px）
   - 行間を適切に設定（1.5-1.8）
   - コントラスト比の確保（WCAG AA準拠）

2. **操作性の向上**
   - タッチターゲットを44x44px以上に設定
   - ボタン間の適切な間隔を確保（最小8px）
   - スワイプジェスチャーの対応

3. **パフォーマンスの向上**
   - モバイルでの読み込み速度を3秒以内
   - First Contentful Paint (FCP) を1.5秒以内
   - Largest Contentful Paint (LCP) を2.5秒以内

4. **視覚的な一貫性**
   - デスクトップとモバイルでブランドイメージを統一
   - ラグジュアリー感を保ちながらモバイル最適化

### 2.2 成功指標（KPI）

- **Lighthouseモバイルスコア**: 90点以上
- **Core Web Vitals**: すべて「良好」
- **ユーザビリティテスト**: タスク完了率90%以上
- **バウンス率**: モバイルで10%以下

---

## 3. 優先順位付け

### Phase 1: 緊急度：高（即座に実装）

1. **タイポグラフィの最適化**
   - 見出しサイズの調整（clamp関数の活用）
   - 本文のフォントサイズ最適化
   - 行間の調整

2. **タッチターゲットの最適化**
   - ボタンサイズの拡大（最小44x44px）
   - リンクのタッチ領域の拡大
   - フォーム要素の最適化

3. **レイアウトの最適化**
   - セクション間の余白調整
   - コレクションカードのモバイル表示
   - グリッドレイアウトの最適化

### Phase 2: 緊急度：中（1-2週間以内）

4. **パフォーマンス最適化**
   - 画像の最適化（WebP、適切なサイズ）
   - フォント読み込みの最適化
   - CSS/JSの最小化

5. **ユーザビリティ改善**
   - スクロール体験の改善
   - アニメーションの最適化
   - フォーム入力の最適化

### Phase 3: 緊急度：低（継続的改善）

6. **高度な機能**
   - スワイプジェスチャーの実装
   - プルツリフレッシュ
   - オフライン対応

---

## 4. 詳細実装計画

### 4.1 タイポグラフィの最適化

#### 実装内容

```css
/* モバイル用タイポグラフィ */
@media (max-width: 768px) {
    /* ベースフォントサイズ */
    body {
        font-size: 16px; /* 最小16pxで可読性を確保 */
        line-height: 1.75; /* 行間を適切に設定 */
        letter-spacing: 0.02em; /* 文字間隔を調整 */
    }
    
    /* 見出しサイズの最適化 */
    h1 {
        font-size: clamp(2rem, 8vw, 3rem); /* 2rem-3remの範囲で可変 */
        line-height: 1.3;
        margin-bottom: 1.5rem;
    }
    
    h2 {
        font-size: clamp(1.75rem, 6vw, 2.5rem);
        line-height: 1.4;
        margin-bottom: 1.25rem;
    }
    
    h3 {
        font-size: clamp(1.5rem, 5vw, 2rem);
        line-height: 1.5;
        margin-bottom: 1rem;
    }
    
    /* 本文の最適化 */
    p {
        font-size: 1rem;
        line-height: 1.8;
        margin-bottom: 1.25rem;
    }
    
    /* セクションキッカーの最適化 */
    .section-kicker {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        margin-bottom: 0.75rem;
    }
}
```

#### 対象ファイル
- `assets/css/main.css`

#### 実装優先度
- **緊急度**: 高
- **工数**: 2時間

---

### 4.2 タッチターゲットの最適化

#### 実装内容

```css
/* モバイル用タッチターゲット */
@media (max-width: 768px) {
    /* ボタンの最適化 */
    .btn,
    .btn-primary,
    .btn-ghost {
        min-width: 44px;
        min-height: 44px;
        padding: 0.875rem 1.75rem;
        font-size: 1rem;
        line-height: 1.5;
        touch-action: manipulation; /* ダブルタップズームを防止 */
    }
    
    /* リンクのタッチ領域拡大 */
    a {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        margin: -0.5rem -0.75rem; /* タッチ領域を拡大 */
    }
    
    /* フォーム要素の最適化 */
    input,
    textarea,
    select {
        min-height: 44px;
        font-size: 16px; /* iOSでのズームを防止 */
        padding: 0.75rem 1rem;
        border-radius: 8px;
    }
    
    /* ハンバーガーメニューの最適化 */
    #hamburger-button {
        min-width: 56px;
        min-height: 56px;
        padding: 1rem;
    }
    
    /* ナビゲーションアイテムの最適化 */
    .nav-item {
        min-height: 56px;
        padding: 1rem 1.25rem;
        font-size: 1.5rem;
    }
}
```

#### 対象ファイル
- `assets/css/main.css`
- `_includes/header.html`（必要に応じて）

#### 実装優先度
- **緊急度**: 高
- **工数**: 3時間

---

### 4.3 レイアウトの最適化

#### 実装内容

```css
/* モバイル用レイアウト */
@media (max-width: 768px) {
    /* セクションの余白調整 */
    .section {
        padding: clamp(3rem, 8vw, 4rem) 1.25rem;
    }
    
    .section--narrow {
        padding: clamp(2.5rem, 6vw, 3.5rem) 1.25rem;
    }
    
    /* セクションコンテンツの最適化 */
    .section-content {
        max-width: 100%;
        padding: 0;
    }
    
    /* コレクションリストの最適化 */
    .collections-list {
        gap: 3rem;
        margin-top: 2.5rem;
    }
    
    .collection-item {
        gap: 2rem;
        padding: 0;
    }
    
    .collection-item__content {
        gap: 1.25rem;
    }
    
    .collection-item__header {
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1.25rem;
    }
    
    .collection-item__title {
        font-size: clamp(1.5rem, 5vw, 1.75rem);
        line-height: 1.4;
    }
    
    .collection-item__price {
        align-items: flex-start;
        margin-top: 0.5rem;
    }
    
    .price-value {
        font-size: 1.5rem;
    }
    
    .collection-item__desc {
        font-size: 0.9375rem;
        line-height: 1.85;
    }
    
    .collection-item__specs {
        grid-template-columns: 1fr;
        gap: 1.25rem;
        padding-top: 1.25rem;
    }
    
    .collection-item__image {
        aspect-ratio: 16 / 9;
        border-radius: 12px;
    }
    
    /* フローグリッドの最適化 */
    .flow-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .flow-card {
        padding: 1.5rem;
        min-height: auto;
    }
    
    /* クラフトグリッドの最適化 */
    .craft-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .craft-card {
        padding: 1.25rem;
    }
    
    /* FAQリストの最適化 */
    .faq-list {
        gap: 1.5rem;
    }
    
    .faq-item {
        padding: 1.5rem 0;
    }
    
    .faq-question {
        font-size: 1.125rem;
        margin-bottom: 0.75rem;
    }
    
    .faq-answer {
        font-size: 0.9375rem;
        line-height: 1.85;
    }
}
```

#### 対象ファイル
- `assets/css/main.css`
- `index.html`（必要に応じて）

#### 実装優先度
- **緊急度**: 高
- **工数**: 4時間

---

### 4.4 ヒーローセクションの最適化

#### 実装内容

```css
/* モバイル用ヒーローセクション */
@media (max-width: 768px) {
    #hero {
        min-height: 70vh;
        padding: 2rem 1.25rem;
    }
    
    .hero-frame {
        padding: 2rem 1.5rem;
        max-width: 100%;
    }
    
    .hero-frame h1 {
        font-size: clamp(2rem, 10vw, 3rem);
        line-height: 1.2;
        margin-bottom: 1.5rem;
    }
    
    .hero-frame p {
        font-size: 0.9375rem;
        line-height: 1.75;
        margin-bottom: 2rem;
    }
    
    .hero-cta {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
    
    .hero-cta .btn {
        width: 100%;
        justify-content: center;
    }
    
    .hero-video {
        object-fit: cover;
        object-position: center;
    }
}
```

#### 対象ファイル
- `assets/css/main.css`
- `index.html`

#### 実装優先度
- **緊急度**: 高
- **工数**: 2時間

---

### 4.5 パフォーマンス最適化

#### 実装内容

1. **画像の最適化**
   - WebP形式の使用（既に実装済み）
   - 適切な画像サイズの設定
   - 遅延読み込みの最適化

2. **フォント読み込みの最適化**
   - `font-display: swap`の設定
   - フォントのサブセット化
   - 非同期読み込み（既に実装済み）

3. **CSS/JSの最適化**
   - 未使用CSSの削除
   - Critical CSSのインライン化
   - JavaScriptの最小化

#### 対象ファイル
- `_includes/head.html`
- `assets/css/main.css`
- `assets/js/main.js`

#### 実装優先度
- **緊急度**: 中
- **工数**: 6時間

---

### 4.6 ユーザビリティ改善

#### 実装内容

1. **スクロール体験の改善**
   - スムーススクロールの実装
   - スクロールインジケーターの追加
   - 固定ヘッダーの最適化

2. **アニメーションの最適化**
   - モバイルでのアニメーション軽量化
   - `prefers-reduced-motion`の対応（既に実装済み）
   - タッチデバイスでのアニメーション無効化

3. **フォーム入力の最適化**
   - 適切な入力タイプの設定
   - オートコンプリートの最適化
   - エラーメッセージの改善

#### 対象ファイル
- `assets/css/main.css`
- `assets/js/main.js`
- `contact.html`

#### 実装優先度
- **緊急度**: 中
- **工数**: 4時間

---

### 4.7 小型スマートフォン対応（480px以下）

#### 実装内容

```css
/* 小型スマートフォン用 */
@media (max-width: 480px) {
    body {
        font-size: 15px;
    }
    
    .section {
        padding: 2.5rem 1rem;
    }
    
    .section-content {
        padding: 0;
    }
    
    h1 {
        font-size: clamp(1.75rem, 9vw, 2.5rem);
    }
    
    h2 {
        font-size: clamp(1.5rem, 7vw, 2rem);
    }
    
    .collection-item__title {
        font-size: 1.375rem;
    }
    
    .btn {
        padding: 0.75rem 1.5rem;
        font-size: 0.9375rem;
    }
    
    .nav-item {
        font-size: 1.375rem;
        padding: 0.875rem 1rem;
    }
}
```

#### 対象ファイル
- `assets/css/main.css`

#### 実装優先度
- **緊急度**: 中
- **工数**: 2時間

---

## 5. テスト計画

### 5.1 デバイステスト

#### テスト対象デバイス

1. **iOS**
   - iPhone SE (375px)
   - iPhone 12/13 (390px)
   - iPhone 14 Pro Max (430px)
   - iPad (768px)

2. **Android**
   - Galaxy S21 (360px)
   - Pixel 5 (393px)
   - Galaxy Note 20 Ultra (412px)

3. **ブラウザ**
   - Safari (iOS)
   - Chrome (Android)
   - Firefox (Android)

### 5.2 テスト項目

1. **レイアウトテスト**
   - [ ] すべてのセクションが正しく表示される
   - [ ] テキストが適切に折り返される
   - [ ] 画像が適切に表示される
   - [ ] グリッドレイアウトが正しく動作する

2. **操作性テスト**
   - [ ] ボタンがタッチしやすい（44x44px以上）
   - [ ] リンクがタッチしやすい
   - [ ] フォーム入力が快適
   - [ ] ハンバーガーメニューが正しく動作する

3. **パフォーマンステスト**
   - [ ] ページ読み込み速度が3秒以内
   - [ ] FCPが1.5秒以内
   - [ ] LCPが2.5秒以内
   - [ ] 画像の読み込みが最適化されている

4. **ユーザビリティテスト**
   - [ ] スクロールがスムーズ
   - [ ] アニメーションが軽快
   - [ ] フォーム入力が快適
   - [ ] エラーメッセージが分かりやすい

### 5.3 テストツール

1. **Lighthouse**
   - モバイルスコアの測定
   - Core Web Vitalsの確認

2. **Chrome DevTools**
   - レスポンシブデザインモード
   - ネットワークスロットリング

3. **実機テスト**
   - 実際のデバイスでの動作確認

---

## 6. 実装スケジュール

### Week 1: Phase 1（緊急度：高）

**Day 1-2: タイポグラフィの最適化**
- 見出しサイズの調整
- 本文のフォントサイズ最適化
- 行間の調整

**Day 3-4: タッチターゲットの最適化**
- ボタンサイズの拡大
- リンクのタッチ領域の拡大
- フォーム要素の最適化

**Day 5: レイアウトの最適化**
- セクション間の余白調整
- コレクションカードのモバイル表示
- グリッドレイアウトの最適化

### Week 2: Phase 2（緊急度：中）

**Day 1-2: パフォーマンス最適化**
- 画像の最適化
- フォント読み込みの最適化
- CSS/JSの最小化

**Day 3-4: ユーザビリティ改善**
- スクロール体験の改善
- アニメーションの最適化
- フォーム入力の最適化

**Day 5: テストと修正**
- デバイステスト
- パフォーマンステスト
- バグ修正

### Week 3: Phase 3（継続的改善）

**Day 1-2: 高度な機能**
- スワイプジェスチャーの実装
- プルツリフレッシュ
- オフライン対応

**Day 3-5: 最終調整**
- 最終テスト
- ドキュメント更新
- デプロイ

---

## 7. 実装チェックリスト

### Phase 1: 緊急度：高

- [ ] タイポグラフィの最適化
  - [ ] 見出しサイズの調整（clamp関数）
  - [ ] 本文のフォントサイズ最適化
  - [ ] 行間の調整
  - [ ] 文字間隔の調整

- [ ] タッチターゲットの最適化
  - [ ] ボタンサイズの拡大（44x44px以上）
  - [ ] リンクのタッチ領域の拡大
  - [ ] フォーム要素の最適化
  - [ ] ハンバーガーメニューの最適化

- [ ] レイアウトの最適化
  - [ ] セクション間の余白調整
  - [ ] コレクションカードのモバイル表示
  - [ ] グリッドレイアウトの最適化
  - [ ] ヒーローセクションの最適化

### Phase 2: 緊急度：中

- [ ] パフォーマンス最適化
  - [ ] 画像の最適化（WebP、適切なサイズ）
  - [ ] フォント読み込みの最適化
  - [ ] CSS/JSの最小化
  - [ ] Critical CSSのインライン化

- [ ] ユーザビリティ改善
  - [ ] スクロール体験の改善
  - [ ] アニメーションの最適化
  - [ ] フォーム入力の最適化
  - [ ] エラーメッセージの改善

### Phase 3: 継続的改善

- [ ] 高度な機能
  - [ ] スワイプジェスチャーの実装
  - [ ] プルツリフレッシュ
  - [ ] オフライン対応

---

## 8. 参考リソース

### ガイドライン

- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Web.dev - Mobile-Friendly](https://web.dev/mobile-friendly/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### ツール

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Responsive Design Mode](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode)

---

## 9. 注意事項

### 実装時の注意点

1. **ブランドイメージの維持**
   - ラグジュアリー感を保ちながらモバイル最適化
   - デスクトップとモバイルで一貫性を保つ

2. **パフォーマンスとのバランス**
   - 見た目の美しさとパフォーマンスのバランス
   - 過度なアニメーションは避ける

3. **アクセシビリティ**
   - WCAG 2.1 AA準拠
   - キーボードナビゲーションの対応
   - スクリーンリーダーの対応

4. **テストの徹底**
   - 実機でのテストを必ず実施
   - 複数のブラウザでのテスト
   - ネットワーク速度を変えたテスト

---

## 10. 成功指標（KPI）

### 定量的指標

- **Lighthouseモバイルスコア**: 90点以上
- **Core Web Vitals**: すべて「良好」
  - LCP: 2.5秒以内
  - FID: 100ミリ秒以内
  - CLS: 0.1以下
- **ページ読み込み速度**: 3秒以内
- **バウンス率**: 10%以下

### 定性的指標

- **ユーザビリティテスト**: タスク完了率90%以上
- **ユーザーフィードバック**: 満足度4.0/5.0以上
- **ブランドイメージ**: ラグジュアリー感の維持

---

## 11. 次のステップ

1. **Phase 1の実装開始**
   - タイポグラフィの最適化から開始
   - タッチターゲットの最適化
   - レイアウトの最適化

2. **テストの実施**
   - 実機でのテスト
   - パフォーマンステスト
   - ユーザビリティテスト

3. **継続的改善**
   - ユーザーフィードバックの収集
   - パフォーマンスの監視
   - 定期的な最適化

---

## 12. 関連ドキュメント

- [既存記事最適化ガイドライン](_existing-posts-optimization-guide.md)
- [内部リンク最適化サマリー](_internal-links-optimization-summary.md)
- [AIO実装サマリー](_aio-implementation-summary.md)

