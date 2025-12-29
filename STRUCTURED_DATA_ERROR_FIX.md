# 構造化データエラー修正レポート

## 📋 修正日時
2025年12月29日

## 🚨 検出されたエラー

### 重大な問題
1. **FAQPageの重複**: 2件の無効なアイテムが検出されました
   - `index.html`でMicrodata形式（`itemscope itemtype="https://schema.org/FAQPage"`）
   - `_includes/head.html`でJSON-LD形式（`"@type": "FAQPage"`）
   - 同じページに2つのFAQPageが定義されていたため、重複エラーが発生

### 重大ではない問題（商品スニペット）
- 項目「priceValidUntil」が不足（任意項目）

---

## ✅ 実施した修正

### 1. FAQPageの重複を解消

**修正内容:**
- `index.html`の485行目からMicrodata形式のFAQPage定義を削除
- JSON-LD形式（`_includes/head.html`）のみを残す

**修正前:**
```html
<section id="faq-section" class="section section--narrow" itemscope itemtype="https://schema.org/FAQPage">
  <article class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    ...
  </article>
</section>
```

**修正後:**
```html
<section id="faq-section" class="section section--narrow">
  <article class="faq-item">
    ...
  </article>
</section>
```

**理由:**
- JSON-LD形式の方が推奨されている
- 同じページに2つの構造化データがあると、Googleが混乱する
- Microdata形式を削除することで、重複を解消

### 2. priceValidUntilを追加

**修正内容:**
全ての製品の`offers`内に`priceValidUntil`を追加しました。

**追加した製品:**
- Regalis Bespoke Suit（既に追加済み）
- NOBLE Line
- URBAN Line
- ROYAL Line
- CEREMONY Line（ProductCollection内）
- NOBLE Line（collections.htmlページ）
- URBAN Line（collections.htmlページ）
- ROYAL Line（collections.htmlページ）
- CEREMONY Line（collections.htmlページ）

**追加したコード:**
```json
"priceValidUntil": "2026-12-31"
```

**理由:**
- Googleが推奨する任意項目
- 価格の有効期限を明確にすることで、検索結果の信頼性が向上

---

## 📍 修正箇所

### 1. `index.html`
- **485行目**: FAQPageのMicrodata形式を削除
- **493-539行目**: 各FAQアイテムのMicrodata属性を削除

### 2. `_includes/head.html`
- **ProductCollection内の各製品**: `priceValidUntil`を追加
- **collections.htmlページの各製品**: `priceValidUntil`を追加

---

## 🔍 確認方法

### Rich Results Testで確認
1. https://search.google.com/test/rich-results にアクセス
2. `https://regalis-order-suits.com/` を入力
3. 「URL をテスト」をクリック
4. 結果を確認：
   - ✅ FAQPageの重複エラーが解消されている
   - ✅ 商品スニペットの`priceValidUntil`が追加されている

### 期待される結果
- **よくある質問**: エラーが解消され、有効なアイテムとして表示される
- **商品スニペット**: `priceValidUntil`の警告が解消される

---

## 📝 次のステップ

### 1. 変更をコミット・プッシュ
```bash
git add index.html _includes/head.html
git commit -m "構造化データエラーを修正 - FAQPageの重複を解消、priceValidUntilを追加"
git push
```

### 2. デプロイ後の確認
1. Rich Results Testで再テスト
2. Google検索コンソールでエラーが解消されているか確認
3. 数日後に再度確認

---

## ⚠️ 注意事項

1. **Microdata形式の削除**: `index.html`のFAQセクションからMicrodata形式を削除しましたが、表示には影響ありません。JSON-LD形式が正しく機能します。

2. **priceValidUntilの日付**: 現在は`2026-12-31`に設定していますが、実際の価格有効期限に合わせて更新してください。

---

## 📚 参考情報

- [Google検索セントラル - FAQ構造化データ](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google検索セントラル - 商品の構造化データ](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Schema.org - FAQPage](https://schema.org/FAQPage)
- [Schema.org - Offer](https://schema.org/Offer)

---

**修正完了日**: 2025年12月29日  
**修正者**: AI Assistant (Cursor)

