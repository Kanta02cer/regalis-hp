"""
Content Extractor — トレンドURLからメタデータを抽出するモジュール
外部ページをスクレイピングし、AIに渡す情報を構造化する。
"""

import time, json, logging, hashlib
from pathlib import Path
from urllib.parse import urljoin
from dataclasses import dataclass, field
from typing import Optional

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False

logger = logging.getLogger(__name__)

@dataclass
class PageContent:
    url: str
    title: str
    description: str
    h1: str
    main_text: str        # article / main タグ内の主要テキスト（最大500文字）
    keywords: list[str] = field(default_factory=list)
    price_info: str = ""  # ページ内の価格情報
    fetched_ok: bool = True
    error: str = ""

class ContentExtractor:
    """トレンドURLのHTMLをスクレイピングして構造化データを抽出する"""

    def __init__(self, config: dict):
        cfg = config.get("extractor", {})
        self.delay    = cfg.get("delay_seconds", 1.0)
        self.timeout  = cfg.get("timeout", 10)
        self.ua       = cfg.get("user_agent", "Regalis-Dynamic-AIO/1.0")
        self.cache_ttl= cfg.get("cache_ttl", 21600)
        self.cache: dict[str, tuple[float, PageContent]] = {}
        self.site_url = config.get("site", {}).get("url", "")

    def _cache_key(self, url: str) -> str:
        return hashlib.md5(url.encode()).hexdigest()

    def _get_cached(self, url: str) -> Optional[PageContent]:
        key = self._cache_key(url)
        if key in self.cache:
            ts, content = self.cache[key]
            if time.time() - ts < self.cache_ttl:
                return content
        return None

    def _set_cache(self, url: str, content: PageContent):
        self.cache[self._cache_key(url)] = (time.time(), content)

    def extract_one(self, path: str) -> PageContent:
        """1つのURLのコンテンツを抽出する"""
        url = urljoin(self.site_url, path)
        cached = self._get_cached(url)
        if cached:
            logger.debug(f"キャッシュ使用: {url}")
            return cached

        if not HAS_DEPS:
            return PageContent(url=url, title="", description="", h1="",
                main_text="", fetched_ok=False, error="requests/beautifulsoup4 が未インストール")

        try:
            time.sleep(self.delay)
            res = requests.get(url, timeout=self.timeout,
                headers={"User-Agent": self.ua}, allow_redirects=True)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "lxml")

            title = (soup.find("title") or soup.find("h1") or soup.new_tag("x")).get_text(strip=True)
            desc_tag = soup.find("meta", attrs={"name": "description"})
            desc = desc_tag.get("content", "") if desc_tag else ""
            h1_tag = soup.find("h1")
            h1 = h1_tag.get_text(strip=True) if h1_tag else ""

            # main / article タグ優先でテキスト抽出
            main_tag = soup.find("article") or soup.find("main") or soup.find("body")
            main_text = main_tag.get_text(separator=" ", strip=True)[:500] if main_tag else ""

            # 価格情報の抽出（正規表現）
            import re
            price_m = re.search(r'¥[\d,]+|[\d,]+円(?:\/月|\/year)?', main_text)
            price_info = price_m.group(0) if price_m else ""

            content = PageContent(
                url=url, title=title[:100], description=desc[:200],
                h1=h1[:100], main_text=main_text, price_info=price_info,
            )
            self._set_cache(url, content)
            logger.info(f"抽出完了: {url} ({len(main_text)}文字)")
            return content

        except Exception as e:
            logger.error(f"抽出失敗: {url} — {e}")
            content = PageContent(url=url, title=path, description="", h1="",
                main_text="", fetched_ok=False, error=str(e))
            return content

    def extract_all(self, paths: list[str]) -> list[PageContent]:
        results = []
        for path in paths:
            results.append(self.extract_one(path))
        return results
