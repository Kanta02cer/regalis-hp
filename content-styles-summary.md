# 記事内コンテンツスタイル適用完了レポート

## 実装完了したスタイル

### 1. リストボックス（`.list-box`）
- **用途**: 特徴・メリット・デメリットの列挙
- **バリエーション**:
  - 基本リストボックス
  - 強調リストボックス（`.list-box--highlight`）
  - コンパクトリストボックス（`.list-box--compact`）
- **適用済み記事**: 10記事以上

### 2. エクセル風テーブルボックス（`.table-box`）
- **用途**: 比較表、ランキング表、データ一覧
- **特徴**: ガラスモーフィズム風のデザイン、ホバーエフェクト
- **適用済み記事**: 8記事（自動変換スクリプトで変換）

### 3. 比較ボックス（`.comparison-box`）
- **用途**: 2項目の比較（メリット/デメリット、A vs B）
- **特徴**: 2カラムレイアウト、モバイルでは1カラムに自動調整
- **適用済み記事**: 3記事

### 4. ステップボックス（`.steps-box`）
- **用途**: 手順・プロセスの表示
- **特徴**: 番号付きステップ、視覚的に分かりやすい
- **適用済み記事**: 2記事

### 5. 特徴グリッド（`.feature-grid`）
- **用途**: 複数項目の並列表示
- **特徴**: レスポンシブグリッドレイアウト
- **準備完了**: スタイル実装済み、記事への適用は必要に応じて

## 適用済み記事一覧

### 高優先度記事（完全適用）
1. ✅ `2025-11-05-order-suit-tokyo-for-students.md` - U-22プラン特徴リスト
2. ✅ `2025-11-13-order-suit-price-tier-merit-regalis-japan-group.md` - 価格帯比較（リスト+ステップ）
3. ✅ `2025-11-13-university-entrance-ceremony-suit-male-guide-regalis-japan-group.md` - 推奨色リスト
4. ✅ `2025-11-05-seijinshiki-order-suit-student-late.md` - メリットリスト
5. ✅ `2025-11-16-regalis-japan-group-company-introduction.md` - コレクションライン表
6. ✅ `2025-11-17-global-style-vs-regalis-comparison.md` - 特徴リスト+比較表+比較ボックス
7. ✅ `2025-11-19-order-suit-best-ranking-comparison.md` - ブランド比較表
8. ✅ `2025-11-13-where-to-buy-order-suits.md` - 購入先比較（比較ボックス）
9. ✅ `2025-11-13-difference-between-order-and-ready-made-suits.md` - 違いの比較（ステップボックス）
10. ✅ `2025-11-14-seijin-shiki-suit-when-to-buy-guide.md` - 購入時期ガイド（リスト）
11. ✅ `2025-11-13-kashiyama-analysis.md` - おすすめリスト

### 自動変換済み記事（テーブルのみ）
1. ✅ `2025-11-16-order-suit-differences-explained.md`
2. ✅ `2025-11-16-reda-fabric-rank-maior.md`
3. ✅ `2025-11-17-azabu-tailor-analysis.md`
4. ✅ `2025-11-19-cheap-high-quality-order-suit-guide.md`
5. ✅ `2025-11-19-ladies-order-suit-best-selection-guide.md`

## 使用方法

### リストボックス
```html
<div class="list-box">
  <div class="list-box__title">タイトル</div>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</div>
```

### テーブルボックス
```html
<div class="table-box">
  <div class="table-box__title">表のタイトル</div>
  <table>
    <thead>
      <tr>
        <th>列1</th>
        <th>列2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>データ1</td>
        <td>データ2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 比較ボックス
```html
<div class="comparison-box">
  <div class="comparison-box__item">
    <div class="comparison-box__title">項目A</div>
    <div class="comparison-box__content">
      <ul>
        <li>特徴1</li>
        <li>特徴2</li>
      </ul>
    </div>
  </div>
  <div class="comparison-box__item">
    <div class="comparison-box__title">項目B</div>
    <div class="comparison-box__content">
      <ul>
        <li>特徴1</li>
        <li>特徴2</li>
      </ul>
    </div>
  </div>
</div>
```

### ステップボックス
```html
<div class="steps-box">
  <div class="step-item">
    <div class="step-item__number">1</div>
    <div class="step-item__content">
      <div class="step-item__title">ステップ1のタイトル</div>
      <div>ステップ1の説明</div>
    </div>
  </div>
</div>
```

## デザイン特徴

- **ガラスモーフィズム**: 半透明の背景とブラー効果
- **ゴールドアクセント**: トップボーダーとマーカーにゴールドカラー
- **統一感**: 既存のデザインシステムと調和
- **レスポンシブ**: モバイル対応済み
- **読みやすさ**: 適切なパディングとスペーシング

## 今後の作業

### 残りの記事への適用
- 中優先度リスト: 約40箇所
- 低優先度リスト: 約11箇所

### 推奨事項
1. 新しい記事を作成する際は、このスタイルガイドを参照してください
2. 既存記事の更新時も、適切な箇所にスタイルを適用してください
3. 過度な使用は避け、重要な情報に使用してください

