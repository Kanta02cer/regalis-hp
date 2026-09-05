const CRAWLER_PATTERNS = [
  ['OpenAI Search', /OAI-SearchBot/i],
  ['ChatGPT User', /ChatGPT-User/i],
  ['OpenAI Training', /GPTBot/i],
  ['Perplexity Search', /PerplexityBot/i],
  ['Perplexity User', /Perplexity-User/i],
  ['Anthropic Search', /ClaudeBot/i],
  ['Anthropic User', /Claude-User/i],
  ['Google Search', /Googlebot/i],
  ['Google Training', /Google-Extended/i],
  ['Microsoft Search', /bingbot/i],
] as const;

const PERMANENT_REDIRECTS = new Map<string, string>([
  ['/about/', '/trillionbank/company/'],
  ['/about/company.html', '/trillionbank/company/'],
  ['/about/company/', '/trillionbank/company/'],
  ['/company.html', '/trillionbank/company/'],
  ['/news/perplexity-ai-seo-taisaku/', '/news/perplexity-search-seo-taisaku/'],
  ['/news/chatgpt-search-listing-standards-seo/', '/news/chatgpt-search-seo-taisaku/'],
  ['/news/google-ai-overview-taisaku/', '/trillionbank/news/google-ai-optimization-guide-kaisetsu/'],
  ['/news/ai-overview-instant-seo/', '/trillionbank/news/google-ai-optimization-guide-kaisetsu/'],
  ['/news/google-ai-mode-seo-taisaku/', '/trillionbank/news/google-ai-optimization-guide-kaisetsu/'],
]);

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const crawler = identifyCrawler(request.headers.get('user-agent') ?? '');
    const redirectPath = PERMANENT_REDIRECTS.get(normalizePath(url.pathname));

    if (redirectPath) {
      const destination = new URL(redirectPath, url.origin);
      destination.search = url.search;
      const response = Response.redirect(destination.toString(), 301);
      if (crawler) recordCrawlerVisit(env, request, response, crawler);
      return response;
    }

    const response = await fetch(request);
    if (crawler) recordCrawlerVisit(env, request, response, crawler);
    return response;
  },
} satisfies ExportedHandler<Env>;

function identifyCrawler(userAgent: string): string | null {
  for (const [name, pattern] of CRAWLER_PATTERNS) {
    if (pattern.test(userAgent)) return name;
  }
  return null;
}

function normalizePath(pathname: string): string {
  if (pathname === '/') return pathname;
  return pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;
}

function recordCrawlerVisit(env: Env, request: Request, response: Response, crawler: string): void {
  const url = new URL(request.url);
  const cf = request.cf;
  const userAgent = request.headers.get('user-agent') ?? '';

  env.AI_CRAWLER_LOGS.writeDataPoint({
    blobs: [
      crawler,
      url.pathname,
      request.method,
      userAgent.slice(0, 512),
      typeof cf?.country === 'string' ? cf.country : '',
      typeof cf?.asn === 'number' ? String(cf.asn) : '',
      'user-agent-claim',
    ],
    doubles: [response.status],
    indexes: [crawler],
  });

  console.log(
    JSON.stringify({
      event: 'crawler_request',
      crawler,
      path: url.pathname,
      method: request.method,
      status: response.status,
      country: typeof cf?.country === 'string' ? cf.country : null,
      asn: typeof cf?.asn === 'number' ? cf.asn : null,
      verification: 'user-agent-claim',
    }),
  );
}
