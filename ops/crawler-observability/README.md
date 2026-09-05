# AIクローラー到達ログ

GitHub Pagesには利用者が確認できるリクエストログがないため、`trillion-bank.jp`の手前にCloudflare Workerを置き、AI検索クローラーをAnalytics Engineへ記録する。

## 記録する内容

- クローラー名
- パス、HTTPメソッド、HTTP状態
- User-Agent、国、ASN
- 到達日時

IPアドレスとクエリ文字列は保存しない。記録はUser-Agentの自己申告に基づくため、これだけで公式クローラーと断定しない。厳密な検証が必要な場合は、Cloudflare Bot ManagementまたはHTTP Logpushで接続元IPを取得し、各社が公開するIP範囲と照合する。

## 前提

1. `trillion-bank.jp`をCloudflareの有効なゾーンへ追加する
2. GitHub Pages向けDNSレコードをCloudflareでプロキシ有効にする
3. CloudflareアカウントでWranglerへログインする

WorkerはRouteとして既存のGitHub Pagesオリジンの手前で動く。`fetch(request)`はCloudflare DNSに設定した既存オリジンへ転送する。

## 検証とデプロイ

    npm install
    npm run check
    npm run deploy

初回の書き込み時に`trillion_bank_ai_crawler_logs`データセットが作成される。

## ログ照会

Cloudflare APIトークンへ`Account Analytics Read`権限を付け、SQL APIへ`queries/recent-ai-crawlers.sql`または`queries/crawler-summary.sql`を送る。トークンはリポジトリへ保存しない。

    curl "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/analytics_engine/sql" \
      --header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      --data-binary @queries/recent-ai-crawlers.sql

## 301統合

同一Workerで旧会社概要URLと重複記事URLを主URLへHTTP 301で統合する。Cloudflare導入前のGitHub Pagesでは、HTML上のcanonicalと転送のみになる。

## 公式資料

- Workers Route: https://developers.cloudflare.com/workers/configuration/routing/routes/
- Analytics Engine: https://developers.cloudflare.com/analytics/analytics-engine/get-started/
- SQL API: https://developers.cloudflare.com/analytics/analytics-engine/sql-api/
- OpenAI crawler: https://help.openai.com/en/articles/9237897
- Perplexity crawler: https://docs.perplexity.ai/docs/resources/perplexity-crawlers

