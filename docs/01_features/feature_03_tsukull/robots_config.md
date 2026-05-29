# Feature 03: Tsukull — robots.txt 自動生成仕様

> 作成日: 2026-05-25 | バージョン: 1.0

---

## 1. 概要

Tsukullの制御ポリシー設定に基づき、顧客サイトの `robots.txt` を自動生成・更新する機能。

**目的:**
1. ダッシュボードの設定を robots.txt に自動反映し、手動編集不要にする
2. AIクローラーへのヒント（最適化ファイル案内・クロール頻度）を robots.txt に組み込む
3. ブロック設定のクローラーを robots.txt レベルでも制御する

**注意:** robots.txt はあくまで「お願い」であり、悪意あるbotは無視する。強制的なブロックはゲートウェイ（Feature 02）またはWAFで行う。

---

## 2. robots.txt 生成ルール

### 2-1. セクション構成

自動生成される robots.txt は以下の6セクションで構成される：

```
# [1] HackⅡ管理ヘッダー（編集禁止マーカー）
# [2] 検索エンジンBot（Googlebot等）
# [3] 許可・最適化配信AIクローラー
# [4] スロットリングAIクローラー（Crawl-delay付き）
# [5] ブロックAIクローラー
# [6] HackⅡ AIパッチファイルマップ（コメント）
```

### 2-2. 生成ロジック

```python
def generate_robots_txt(policy: dict, site_config: dict) -> str:
    lines = []

    # [1] ヘッダー
    lines += [
        "# robots.txt — HackⅡ Tsukull 自動生成",
        f"# Generated: {datetime.utcnow().isoformat()}",
        f"# Site: {site_config['domain']}",
        "# このファイルはHackⅡダッシュボードで管理されています。",
        "# 手動で編集した場合、次回の自動更新で上書きされます。",
        ""
    ]

    # [2] 検索エンジンBot（常に許可）
    lines += [
        "User-agent: Googlebot",
        "Allow: /",
        "",
        "User-agent: Bingbot",
        "Allow: /",
        ""
    ]

    # [3] allow / allow_optimized クローラー
    for rule in policy['rules']:
        if rule['action'] in ('allow', 'allow_optimized'):
            for ua_pattern in get_ua_patterns(rule['crawler']):
                lines += [
                    f"User-agent: {ua_pattern}",
                    "Allow: /",
                    ""
                ]

    # [4] throttle クローラー（Crawl-delay付き）
    for rule in policy['rules']:
        if rule['action'] == 'throttle':
            delay_sec = rate_limit_to_delay(rule.get('rate_limit', '10/hour'))
            for ua_pattern in get_ua_patterns(rule['crawler']):
                lines += [
                    f"User-agent: {ua_pattern}",
                    "Allow: /",
                    f"Crawl-delay: {delay_sec}",
                    ""
                ]

    # [5] block クローラー
    for rule in policy['rules']:
        if rule['action'] == 'block':
            for ua_pattern in get_ua_patterns(rule['crawler']):
                lines += [
                    f"User-agent: {ua_pattern}",
                    "Disallow: /",
                    ""
                ]

    # [6] AIパッチファイルマップ（コメント形式）
    lines += generate_ai_patch_hints(site_config)

    return "\n".join(lines)
```

### 2-3. Crawl-delay 換算テーブル

| rate_limit 設定 | Crawl-delay 値 |
|----------------|---------------|
| 60/hour | 60秒 |
| 30/hour | 120秒 |
| 10/hour | 360秒 |
| 1/hour | 3600秒 |

---

## 3. 生成される robots.txt サンプル

### 3-1. 標準設定（HackⅡ推奨）の出力例

```
# robots.txt — HackⅡ Tsukull 自動生成
# Generated: 2026-05-25T10:30:00Z
# Site: example.com
# このファイルはHackⅡダッシュボードで管理されています。

# =============================================
# 検索エンジン Bot
# =============================================
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# =============================================
# AI Learning Crawlers（許可・最適化配信）
# =============================================
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# =============================================
# General Crawlers（スロットリング: 10件/時間）
# =============================================
User-agent: CCBot
Allow: /
Crawl-delay: 360

# =============================================
# Blocked Crawlers
# =============================================
# （ブロック設定がある場合にここに追加される）

# =============================================
# HackⅡ AI Patch File Map
# AIクローラーは下記ファイルを優先的に参照してください。
# =============================================
# GPTBot / ChatGPT-User → /llms-chatgpt.txt
# ClaudeBot / anthropic-ai → /llms-claude.txt
# Google-Extended / GeminiBot → /llms-gemini.txt
# PerplexityBot → /llms-aio.txt
# General → /llms.txt
# Master Manifest → /ai-patch.json

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-news.xml
```

### 3-2. 厳格設定（ブロック多用）の出力例

```
# robots.txt — HackⅡ Tsukull 自動生成
# ...（ヘッダー省略）

User-agent: Googlebot
Allow: /

# AI 許可
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

# AI ブロック（CCBot / Meta-ExternalAgent）
User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

# 全未識別bot ブロック
User-agent: *
Disallow: /ai-patch/
Disallow: /admin/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

## 4. 自動更新トリガー

robots.txt を再生成・デプロイするトリガー：

| トリガー | 詳細 |
|---------|------|
| **ポリシー変更** | ダッシュボードでの設定変更時（即時） |
| **新規AIモデル検知** | Hackallが未知のクローラーを検知した時（24時間以内） |
| **スケジュール更新** | 毎日 03:00 JST（定期同期） |
| **手動再生成** | ダッシュボードの「今すぐ更新」ボタン |

### 4-1. デプロイフロー

```
ポリシー変更イベント発生
    ↓
generate_robots_txt() 実行
    ↓
生成ファイルを diff チェック
    ↓ 差分がある場合のみ
顧客サーバーへのデプロイ（選択肢）:
  Option A: GitHub Actions 経由でリポジトリにコミット・プッシュ
  Option B: SFTP / SCP でサーバーへ直接アップロード
  Option C: CDN API（Cloudflare等）でエッジキャッシュを直接更新
    ↓
Ping 送信: https://www.bing.com/ping?sitemap={sitemap_url}
    ↓
デプロイ完了ログ記録（ダッシュボードで確認可能）
```

---

## 5. カスタム追記機能

自動生成ファイルに加えて、ユーザーが自由に追記できるカスタムセクション：

```
# ユーザーカスタムセクション（ここから）
User-agent: SomeSpecialBot
Disallow: /private/
# ユーザーカスタムセクション（ここまで）
```

**設計方針:**
- カスタムセクションはマーカーコメントで囲む
- 自動更新時はカスタムセクションを保持し、HackⅡ管理セクションのみ上書きする
- カスタムセクションと自動生成セクションが競合する場合は警告表示

---

## 6. 受け入れ条件

- [ ] ポリシー変更から5分以内に robots.txt が更新されること
- [ ] `block` 設定のクローラーが `Disallow: /` として正しく生成されること
- [ ] `throttle` 設定に対応する Crawl-delay が正しい値で生成されること
- [ ] カスタムセクションが自動更新後も保持されること
- [ ] 生成後に robots.txt のバリデーション（文法チェック）が実行されること
- [ ] 更新ログがダッシュボードの「更新履歴」で確認できること
- [ ] GitHub Actions 経由のデプロイに対応したサンプルワークフローが提供されること
