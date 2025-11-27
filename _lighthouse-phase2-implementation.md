# Lighthouse パフォーマンス最適化 Phase 2 実装計画

## 🎯 Phase 2 実装項目

### 1. CSS/JSのminify（優先度：高）

**実装内容:**
- CSSのminify（8 KiB節約可能）
- JavaScriptのminify（45 KiB節約可能）
- GitHub Actionsでの自動minify

**実装方法:**
1. GitHub Actionsワークフローにminifyステップを追加
2. 本番環境ではminify版を使用、開発環境では通常版を使用
3. `_config.yml`で環境変数を設定

### 2. JavaScript実行時間の削減（優先度：高）

**実装内容:**
- 未使用JavaScriptの削除（896 KiB節約可能）
- コード分割（Code Splitting）
- 遅延読み込みの実装

**実装方法:**
1. 未使用コードの特定と削除
2. 重要なコードのみを初期読み込み
3. 非重要なコードを遅延読み込み

### 3. 画像のさらなる最適化（優先度：中）

**実装内容:**
- `srcset`と`sizes`属性の追加
- 画像サイズの最適化（適切な解像度）
- より多くの画像をWebP形式に変換

**実装方法:**
1. レスポンシブ画像の実装
2. 適切な解像度の画像を生成
3. WebP形式への変換

### 4. キャッシュライフタイムの最適化（優先度：中）

**実装内容:**
- 静的アセットのキャッシュヘッダー設定（8,948 KiB節約可能）
- Service Workerの実装（オプション）

**実装方法:**
1. GitHub Pagesの設定でキャッシュヘッダーを設定
2. または`.htaccess`ファイルで設定（サーバーが対応している場合）

---

## 📋 実装詳細

### 1. CSS/JSのminify

#### GitHub Actionsワークフロー

```yaml
- name: Minify CSS
  run: |
    npm install -g clean-css-cli
    cleancss -o assets/css/main.min.css assets/css/main.css --level 2

- name: Minify JavaScript
  run: |
    npm install -g terser
    terser assets/js/main.js -o assets/js/main.min.js -c -m --comments false
```

#### テンプレートでの使用

```html
<!-- CSS -->
{% if jekyll.environment == "production" %}
<link rel="preload" href="{{ '/assets/css/main.min.css' | relative_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
{% else %}
<link rel="preload" href="{{ '/assets/css/main.css' | relative_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
{% endif %}

<!-- JavaScript -->
{% if jekyll.environment == "production" %}
<script src="{{ '/assets/js/main.min.js' | relative_url }}" defer></script>
{% else %}
<script src="{{ '/assets/js/main.js' | relative_url }}" defer></script>
{% endif %}
```

### 2. JavaScript実行時間の削減

#### 未使用コードの削除

1. **グローバルローダーの無効化**
   - `DISABLE_GLOBAL_LOADER = true`が既に設定されている
   - 関連するコードを削除または条件分岐で無効化

2. **未使用関数の削除**
   - 使用されていない関数を特定
   - 削除またはコメントアウト

3. **コード分割**
   - 重要なコード（ナビゲーション、基本的なインタラクション）を初期読み込み
   - 非重要なコード（アニメーション、カルーセル）を遅延読み込み

#### 遅延読み込みの実装

```javascript
// 非重要な機能の遅延読み込み
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 必要なコードを読み込む
                loadNonCriticalCode();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(document.querySelector('.non-critical-section'));
}
```

### 3. 画像のさらなる最適化

#### srcsetとsizes属性の追加

```html
<picture>
    <source srcset="/images/suits.photo/1-400.webp 400w,
                    /images/suits.photo/1-800.webp 800w,
                    /images/suits.photo/1-1200.webp 1200w,
                    /images/suits.photo/1.webp 1920w"
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            type="image/webp">
    <img src="/images/suits.photo/1.png" 
         alt="..." 
         loading="lazy" 
         decoding="async"
         width="1920" 
         height="1080">
</picture>
```

### 4. キャッシュライフタイムの最適化

#### GitHub Pagesでの設定

GitHub Pagesは自動的にキャッシュヘッダーを設定しますが、より細かい制御が必要な場合は：

1. **Service Workerの実装**（オプション）
2. **CDNの使用**（Cloudflare等）
3. **サーバー設定**（`.htaccess`等、サーバーが対応している場合）

---

## 🚀 実装優先順位

1. **CSS/JSのminify** - 即座に実装（影響：中、実装容易）
2. **JavaScript実行時間の削減** - 1週間以内（影響：大、実装中程度）
3. **画像のさらなる最適化** - 2週間以内（影響：大、実装複雑）
4. **キャッシュライフタイムの最適化** - 2週間以内（影響：中、実装容易）

---

## 📊 期待される効果

### 目標スコア

- **Performance**: 50-60点 → 70-80点（Phase 2実装後）
- **FCP**: 10秒以下 → 5秒以下
- **LCP**: 15秒以下 → 8秒以下
- **TBT**: 800ms以下 → 400ms以下

### 節約可能なリソース

- **CSS/JS minify**: 98 KiB
- **未使用JavaScript**: 896 KiB
- **画像最適化**: 追加で1-2 MiB
- **合計**: 約1-2 MiB

---

## 🔍 テスト計画

1. **実装前のベースライン測定**
   - Lighthouseスコアの記録
   - Core Web Vitalsの記録

2. **実装後の測定**
   - 各最適化項目ごとに測定
   - 改善効果の確認

3. **継続的な監視**
   - 定期的なLighthouseスコアの測定
   - Core Web Vitalsの監視

