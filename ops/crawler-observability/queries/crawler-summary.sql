SELECT
  blob1 AS crawler,
  blob2 AS path,
  double1 AS status,
  SUM(_sample_interval) AS requests,
  MAX(timestamp) AS last_seen_at
FROM trillion_bank_ai_crawler_logs
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY crawler, path, status
ORDER BY last_seen_at DESC
LIMIT 500
