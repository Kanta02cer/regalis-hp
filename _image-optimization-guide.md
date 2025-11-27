# 画像最適化ガイド

## OurEcosystemセクション画像の反映

### 実装内容

1. **画像ファイルの確認**
   - ファイルパス: `images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.png`
   - WebP形式への変換をGitHub Actionsで自動化

2. **OurEcosystemセクションへの反映**
   - `<picture>`要素を使用してWebP/PNGの切り替え
   - `loading="lazy"`と`decoding="async"`を追加
   - 適切な`alt`属性を設定

### 実装コード

```html
<div class="relative h-96 rounded-2xl overflow-hidden" role="img" aria-label="四ツ谷麹町のRegalisラウンジ">
    <picture>
        <source srcset="{{ '/images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.webp' | relative_url }}" media="(min-width: 801px)" type="image/webp">
        <source srcset="{{ '/images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.png' | relative_url }}" media="(max-width: 800px)" type="image/png">
        <img src="{{ '/images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.png' | relative_url }}" 
             alt="四ツ谷麹町で世代が交差するRegalisコミュニティ" 
             loading="lazy" 
             decoding="async"
             class="w-full h-full object-cover"
             width="1920" 
             height="1080">
    </picture>
</div>
```

### WebP変換

GitHub Actionsワークフローで自動的にWebP形式に変換されます。

**手動で変換する場合:**
```bash
# cwebpがインストールされている場合
cwebp -q 85 images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.png -o images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.webp

# またはImageMagickを使用
convert images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.png -quality 85 images/Gemini_Generated_Image_dfwfbzdfwfbzdfwf.webp
```

### 期待される効果

- **ファイルサイズ**: WebP形式により、通常30-50%のサイズ削減
- **読み込み速度**: 画像の読み込み時間の短縮
- **パフォーマンス**: LCP（Largest Contentful Paint）の改善

---

## 画像最適化のベストプラクティス

### 1. 画像形式の選択

- **WebP**: モダンブラウザでサポート、高い圧縮率
- **PNG**: 透明度が必要な場合、フォールバック用
- **JPEG**: 写真に適しているが、WebPが優先

### 2. レスポンシブ画像

- `<picture>`要素で複数の画像ソースを提供
- `srcset`と`sizes`属性で適切なサイズを選択
- モバイルとデスクトップで異なる画像を使用

### 3. 遅延読み込み

- `loading="lazy"`でビューポート外の画像を遅延読み込み
- `decoding="async"`で非同期デコード

### 4. 画像サイズの最適化

- 適切な解像度の画像を使用（1920px幅が最大）
- モバイル用にはより小さい画像を使用

---

## 次のステップ

1. **画像のさらなる最適化**
   - `srcset`と`sizes`属性の追加
   - 複数の解像度の画像を生成

2. **画像のCDN配信**
   - CDNを使用して画像の配信を高速化
   - キャッシュの最適化

