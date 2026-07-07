# 投資家向け資料 — Trillion Bank

このディレクトリには、Trillion Bank の投資家向け／会社紹介資料を格納しています。
ブランド（社名表記・ロゴ・配色）は Trillion Bank ロゴに準拠。事業内容・数値は事業計画のベースシナリオを維持しています。

## 成果物

| ファイル | 内容 | 形式 |
|---|---|---|
| `TrillionBank_投資家向け事業計画書_2026.pptx` | 投資家向けピッチ資料（全20枚）。エグゼクティブサマリー→市場→課題→プロダクト(HackⅡ)→技術→差別化→ビジネスモデル→トラクション→事業ポートフォリオ→GTM→財務計画→前提→マイルストーン→KPI→経営陣→リスク→ビジョン→会社概要 | PowerPoint 16:9 |
| `TrillionBank_投資家向け事業計画書_2026.pdf` | 上記のPDF版（閲覧・配布用） | PDF |
| `TrillionBank_会社紹介ワンパゲャー.pptx` | 会社紹介ワンパゲャー（A4縦・1枚） | PowerPoint A4 |
| `TrillionBank_会社紹介ワンパゲャー.pdf` | 上記のPDF版 | PDF |
| `build_deck.py` / `build_onepager.py` | 各資料の再生成スクリプト（python-pptx） | Python |
| `trillion-logo-horizontal.png` | 横ロゴ（シンボル＋ワードマーク・白地用・透過） | PNG |
| `trillion-symbol.png` | シンボルのみ（ネイビー＋ゴールド・白地用・透過） | PNG |
| `trillion-symbol-dark.png` | シンボル濃色地用（白茎＋ゴールド・透過） | PNG |

## ブランド設定（ロゴ準拠）

- ブランドネイビー：`#082858`（カバー・濃色面・表ヘッダー）
- ブランドゴールド：`#C0902F`（アクセント）／濃ゴールド `#946C24`（白地の文字用）
- ロゴ配置：カバー・フッター・ビジョン・会社概要（横ロゴ）・ワンパゲャー・ヘッダー

## 重要な注意

- **財務計画・KPI・ユニットエコノミクスの数値は、すべて「前提を明示した想定モデル（ベースシナリオ）」であり実績値ではありません。** 主要な前提は資料内「KEY ASSUMPTIONS（前提条件）」スライドに集約しています。
- 市場規模（TAM/SAM/SOM）は各種公開統計を基にした想定レンジであり、投資判断前に一次情報での確認が必要です。
- 連絡先の Web ドメイン（`regalis-order-suits.com`）は既存の稼働URLをそのまま記載しています。Trillion Bank の正式ドメイン・連絡先が確定したら差し替えてください。
- 本資料はConfidentialです。無断転載・二次配布を禁じます。

## 再生成方法

```bash
pip install python-pptx pillow
python3 build_deck.py       # 事業計画書(.pptx)を生成
python3 build_onepager.py   # ワンパゲャー(.pptx)を生成

# PDF化（LibreOffice Impress。日本語ファイル名は一旦ASCII名にコピーしてから変換）
cp "TrillionBank_投資家向け事業計画書_2026.pptx" deck.pptx
soffice --headless --convert-to pdf deck.pptx
```

数値・前提を変更する場合は各スクリプト内のデータ（`chart_data`・`frows`・`rows`・`ue` 等）を、
ブランド配色を変更する場合は各スクリプト冒頭のカラー定義（`BLACK`/`GOLD`/`GOLDD` 等）を編集して再実行してください。
