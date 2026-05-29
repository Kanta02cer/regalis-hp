# HackⅡ 機能別開発委託資料 — 全体概要

> 作成日: 2026-05-25  
> 作成: Regalis Japan Group株式会社  
> 機密区分: 社外秘 / 委託先開示用  
> バージョン: 1.0

---

## このドキュメントの目的

本ディレクトリは、HackⅡシステムを構成する4機能を**独立したサブシステムとして外部エンジニアチームに委託**する際に提供する技術資料をまとめたものです。

各機能は独立して開発・リリース可能ですが、最終的には一つのプラットフォームとして統合されます。

---

## 4機能の位置づけ

| # | 機能名 | コードネーム | 役割 | 開発優先度 |
|---|--------|------------|------|-----------|
| 1 | AIクローリング計測 | **Hackall（ハカル）** | センサー — いつ・どのAIに読まれたかを可視化 | **最優先** |
| 2 | Pay per Crawl | **PPC** | マネタイズ — クローリングをAPI課金に変換 | フェーズ3 |
| 3 | AIクローリング対策 | **Tsukull（ツクル）** | 防御 — 不要AIをブロック・適正配信を制御 | フェーズ2 |
| 4 | AIパッチ生成 | **Misell（ミセル）** | プロダクト — AI学習用最適化データを自動生成 | フェーズ2 |

---

## 開発フェーズと依存関係

```
Phase 1: Hackall（計測基盤）
    ↓ 計測データを基に設計
Phase 2: Tsukull（制御）+ Misell/AIパッチ（データ商品化）
    ↓ 制御×データを統合
Phase 3: Pay per Crawl（収益化）
```

**理由:** Hackallが計測基盤であり、他3機能はそのデータを前提に動作します。

---

## ディレクトリ構成

```
docs/01_features/
├── README.md                       ← この資料（全体概要）
├── feature_01_hackall/             # 計測・ロギング系
│   ├── requirements.md             # 要件定義 / 検知トリガー定義
│   └── api_log_spec.md             # ログ仕様 / APIエンドポイント仕様
├── feature_02_pay_per_crawl/       # 課金・APIゲートウェイ系
│   ├── business_logic.md           # 課金ロジック / 料金モデル
│   └── api_gateway_spec.md         # APIゲートウェイ仕様
├── feature_03_tsukull/             # セキュリティ・制御系
│   ├── access_control.md           # AIエージェント選別 / 制御ポリシー
│   └── robots_config.md            # 設定自動生成ルール
└── feature_04_ai_patch/            # AIモデル用データ出力系
    ├── data_format_spec.md         # 学習データ形式 / 変換ルール
    └── patch_distribution.md       # 配布・管理フロー
```

---

## 共通技術前提

| 項目 | 選定技術 | 備考 |
|------|---------|------|
| 言語 | TypeScript / Python | TS: フロント・API層, Python: データ処理層 |
| インフラ | AWS or Cloudflare Workers | Hackallはエッジコンピューティング推奨 |
| DB | PostgreSQL + Redis | ログDB + キャッシュ/レートリミット |
| 認証 | JWT + API Key | 外部クライアント向けはAPI Key |
| CI/CD | GitHub Actions | 既存パイプラインと統合 |

---

## 連絡先・NDA

本資料の取り扱いについては、委託契約書および秘密保持契約（NDA）に従ってください。  
技術的な質問は Regalis Japan Group 代表・井上幹太（kanta@regalis-order-suits.com）まで。
