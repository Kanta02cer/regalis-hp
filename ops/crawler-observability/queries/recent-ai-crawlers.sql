SELECT
  timestamp,
  blob1 AS crawler,
  blob2 AS path,
  blob3 AS method,
  blob5 AS country,
  blob6 AS asn,
  blob7 AS verification,
  double1 AS status
FROM trillion_bank_ai_crawler_logs
WHERE timestamp >= NOW() - INTERVAL '7' DAY
ORDER BY timestamp DESC
LIMIT 200
