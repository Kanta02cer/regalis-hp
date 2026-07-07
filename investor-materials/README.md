# 投資家向け資料 — Regalis Japan Group

このディレクトリには、Regalis Japan Group株式会社の投資家向け／会社紹介資料を格納しています。

## 成果物

| ファイル | 内容 | 形式 |
|---|---|---|
| `Regalis_投資家向け事業計画書_2026.pptx` | 投資家向けピッチ資料（全20枚）。エグゼクティブサマリー→市場→課題→プロダクト(HackⅡ)→技術→差別化→ビジネスモデル→トラクション→事業ポートフォリオ→GTM→財務計画→前提→マイルストーン→KPI→経営陣→リスク→ビジョン→会社概要 | PowerPoint 16:9 |
| `Regalis_投資家向け事業計画書_2026.pdf` | 上記のPDF版（閲覧・配布用） | PDF |
| `Regalis_会社紹介ワンパゲャー.pptx` | 会社紹介ワンパゲャー（A4縦・1枚） | PowerPoint A4 |
| `Regalis_会社紹介ワンパゲャー.pdf` | 上記のPDF版 | PDF |
| `build_deck.py` / `build_onepager.py` | 各資料の再生成スクリプト（python-pptx） | Python |

## 重要な注意（財務数値の扱い）

- **財務計画・KPI・ユニットエコノミクスの数値は、すべて「前提を明示した想定モデル（ベースシナリオ）」であり、実績値ではありません。**
- 主要な前提は資料内「KEY ASSUMPTIONS（前提条件）」スライドに集約しています。実績が判明した時点で各ドライバーを更新してください。
- 料金・実績（134件+・成約率4.4倍・AICSスコア改善+26.9pt・外部顧問8名・特許出願中 等）は、サイトの公開情報（`llms-facts.txt` 等）に基づきます。
- 市場規模（TAM/SAM/SOM）は各種公開統計を基にした想定レンジであり、投資判断前に一次情報での確認が必要です。
- 本資料はConfidentialです。無断転載・二次配布を禁じます。

## 再生成方法

```bash
pip install python-pptx
python3 build_deck.py       # 事業計画書(.pptx)を生成
python3 build_onepager.py   # ワンパゲャー(.pptx)を生成

# PDF化（LibreOffice。日本語ファイル名は一旦ASCII名にコピーしてから変換）
cp "Regalis_投資家向け事業計画書_2026.pptx" deck.pptx
soffice --headless --convert-to pdf deck.pptx
```

数値・前提を変更する場合は、各スクリプト冒頭付近の該当データ（`chart_data`・`frows`・`rows`・`ue` 等）を編集して再実行してください。
