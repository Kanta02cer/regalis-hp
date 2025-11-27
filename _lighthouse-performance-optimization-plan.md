# Lighthouse パフォーマンス最適化計画

## 📊 現状分析

### Lighthouseスコア（モバイル）
- **Performance**: 33点（目標：90点以上）
- **Accessibility**: 100点 ✅
- **Best Practices**: 93点 ✅
- **SEO**: 100点 ✅

### 主要メトリクス
- **FCP**: 15.3秒（目標：1.8秒以下）
- **LCP**: 28.4秒（目標：2.5秒以下）
- **TBT**: 1,050ms（目標：200ms以下）
- **CLS**: 0 ✅
- **SI**: 37.3秒（目標：3.4秒以下）

### 主な問題点

1. **画像配信の最適化** - 3,589 KiB節約可能
2. **レンダリングブロッキングリクエスト** - 1,380ms節約可能
3. **JavaScript実行時間** - 3.6秒
4. **未使用JavaScript** - 896 KiB
5. **CSS/JSのminify** - 53 KiB + 45 KiB
6. **ネットワークペイロード** - 11,860 KiB（非常に大きい）
7. **キャッシュライフタイム** - 8,948 KiB節約可能

---

## 🎯 最適化計画

### Phase 1: 緊急度：高（即座に実装）

#### 1. 画像配信の最適化（3,589 KiB節約可能）

**問題点:**
- 画像サイズが大きすぎる
- `srcset`と`sizes`属性が不足
- 適切な画像形式の使用が不十分

**実装内容:**
- `srcset`と`sizes`属性の追加
- 画像サイズの最適化（適切な解像度）
- WebP形式の優先使用
- 遅延読み込みの徹底

#### 2. レンダリングブロッキングリクエストの削減（1,380ms節約可能）

**問題点:**
- CSSがレンダリングをブロックしている
- JavaScriptがレンダリングをブロックしている

**実装内容:**
- Critical CSSのインライン化
- 非Critical CSSの非同期読み込み
- JavaScriptの`defer`/`async`属性の適切な使用

#### 3. CSS/JSのminify（98 KiB節約可能）

**問題点:**
- CSS/JSがminifyされていない

**実装内容:**
- CSSのminify
- JavaScriptのminify
- GitHub Actionsでの自動minify

### Phase 2: 緊急度：中（1-2週間以内）

#### 4. JavaScript実行時間の削減（3.6秒）

**問題点:**
- JavaScriptの実行時間が長い
- 未使用JavaScriptが存在

**実装内容:**
- 未使用JavaScriptの削除
- コード分割（Code Splitting）
- 遅延読み込みの実装

#### 5. ネットワークペイロードの削減（11,860 KiB）

**問題点:**
- 総ネットワークペイロードが大きすぎる

**実装内容:**
- 画像の最適化
- フォントのサブセット化
- 動画の最適化

#### 6. キャッシュライフタイムの最適化（8,948 KiB節約可能）

**問題点:**
- キャッシュヘッダーが適切に設定されていない

**実装内容:**
- 静的アセットのキャッシュヘッダー設定
- Service Workerの実装（オプション）

---

## 📋 実装詳細

### 1. 画像配信の最適化

#### 実装例

```html
<!-- Before -->
<img src="/images/suits.photo/1.png" alt="..." loading="lazy" width="1920" height="1080">

<!-- After -->
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
    <source srcset="/images/suits.photo/1-400.png 400w,
                    /images/suits.photo/1-800.png 800w,
                    /images/suits.photo/1-1200.png 1200w,
                    /images/suits.photo/1.png 1920w"
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            type="image/png">
    <img src="/images/suits.photo/1.png" 
         alt="..." 
         loading="lazy" 
         decoding="async"
         width="1920" 
         height="1080">
</picture>
```

### 2. レンダリングブロッキングの削減

#### Critical CSSのインライン化

```html
<head>
    <style>
        /* Critical CSS here */
        body { margin: 0; }
        /* ... */
    </style>
    <link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>
</head>
```

### 3. CSS/JSのminify

#### GitHub Actionsでの自動minify

```yaml
- name: Minify CSS
  run: |
    npm install -g clean-css-cli
    cleancss -o assets/css/main.min.css assets/css/main.css

- name: Minify JavaScript
  run: |
    npm install -g terser
    terser assets/js/main.js -o assets/js/main.min.js -c -m
```

### 4. キャッシュヘッダーの設定

#### `.htaccess`またはサーバー設定

```apache
# 画像のキャッシュ（1年）
<FilesMatch "\.(jpg|jpeg|png|gif|webp|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# CSS/JSのキャッシュ（1年、バージョニング）
<FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# フォントのキャッシュ（1年）
<FilesMatch "\.(woff|woff2|ttf|otf)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

---

## 🚀 実装優先順位

1. **画像配信の最適化** - 即座に実装（影響：大）
2. **CSS/JSのminify** - 即座に実装（影響：中）
3. **レンダリングブロッキングの削減** - 即座に実装（影響：大）
4. **JavaScript実行時間の削減** - 1週間以内（影響：中）
5. **ネットワークペイロードの削減** - 2週間以内（影響：大）
6. **キャッシュライフタイムの最適化** - 2週間以内（影響：中）

---

## 📊 期待される効果

### 目標スコア
- **Performance**: 33点 → 90点以上
- **FCP**: 15.3秒 → 1.8秒以下
- **LCP**: 28.4秒 → 2.5秒以下
- **TBT**: 1,050ms → 200ms以下
- **SI**: 37.3秒 → 3.4秒以下

### 節約可能なリソース
- **画像**: 3,589 KiB
- **キャッシュ**: 8,948 KiB
- **CSS/JS**: 98 KiB
- **合計**: 約12.6 MiB

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

