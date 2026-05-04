"""
Dynamic Generator — llms.txt 動的再構成モジュール
トレンドコンテンツをllms.txtの冒頭に追記して上書き保存する。
これが特許候補3の核心部分。
"""

import re, shutil, logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dataclasses import dataclass
from .trend_analyzer import TrendResult
from .content_extractor import PageContent

logger = logging.getLogger(__name__)
JST = timezone(timedelta(hours=9))

# llms.txtの冒頭に挿入するセクションのマーカー
HOT_SECTION_START = "<!-- DYNAMIC_AIO_HOT_START -->"
HOT_SECTION_END   = "<!-- DYNAMIC_AIO_HOT_END -->"

@dataclass
class GenerationResult:
    success: bool
    llms_path: str
    hot_section: str
    char_count_before: int
    char_count_after: int
    trends_count: int
    timestamp: str
    error: str = ""

class DynamicGenerator:
    """
    トレンドコンテンツを受け取り、llms.txtの先頭に
    「Hot Topics」セクションを動的生成・挿入する。

    特許性のポイント:
    - 人間のトラフィックトレンドをリアルタイムでllms.txtに反映
    - AIクローラーに「今バズっているコンテンツ」を優先的に読み込ませる
    - トレンドが変わるたびに自動でファイルを更新する動的最適化
    """

    def __init__(self, config: dict):
        cfg = config.get("generator", {})
        self.site_url       = config.get("site", {}).get("url", "")
        self.llms_path      = Path(config.get("site", {}).get("llms_txt_path", "llms.txt"))
        self.hot_title      = cfg.get("hot_section_title", "Hot Topics（直近のトレンドページ）")
        self.backup_enabled = cfg.get("backup_enabled", True)
        self.backup_dir     = Path(cfg.get("backup_dir", "data/llms_history"))
        self.backup_keep    = cfg.get("backup_keep", 30)

    def _build_hot_section(self, trends: list[TrendResult],
                            contents: list[PageContent]) -> str:
        """
        Hot Topicsセクションを構築する（Markdown形式）
        """
        now_str = datetime.now(JST).strftime("%Y-%m-%d %H:%M JST")
        lines = [
            HOT_SECTION_START,
            f"## {self.hot_title}",
            f"> 自動生成セクション（最終更新: {now_str}）",
            f"> このセクションはRegalis Dynamic AIOシステムが直近のトラフィックを分析して自動生成します。",
            "",
        ]
        content_map = {c.url: c for c in contents}
        for trend in trends:
            url = self.site_url + trend.url
            page = content_map.get(url)
            if page and page.fetched_ok:
                name = page.h1 or page.title or trend.url
                desc = page.description or page.main_text[:120]
                line = f"- [{name}]({url})"
                if desc:
                    line += f": {desc}"
                if page.price_info:
                    line += f"（{page.price_info}）"
                lines.append(line)
                if trend.growth_pct > 0:
                    lines.append(f"  - 直近アクセス数: {trend.current_count}件（前日比+{trend.growth_pct:.0f}%）")
            else:
                lines.append(f"- [{trend.url}]({url}): 直近アクセス数 {trend.current_count}件")
        lines.append("")
        lines.append(HOT_SECTION_END)
        return "\n".join(lines)

    def _strip_existing_hot_section(self, text: str) -> str:
        """既存のHot Topicsセクションを除去する"""
        pattern = re.compile(
            re.escape(HOT_SECTION_START) + r".*?" + re.escape(HOT_SECTION_END) + r"\n?",
            re.DOTALL
        )
        return pattern.sub("", text)

    def _backup(self):
        """llms.txtのバックアップを取る"""
        if not self.backup_enabled or not self.llms_path.exists():
            return
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.now(JST).strftime("%Y%m%d_%H%M%S")
        dest = self.backup_dir / f"llms_{ts}.txt"
        shutil.copy2(self.llms_path, dest)
        logger.info(f"バックアップ作成: {dest}")
        # 古いバックアップを削除
        backups = sorted(self.backup_dir.glob("llms_*.txt"))
        for old in backups[:-self.backup_keep]:
            old.unlink()

    def generate(self, trends: list[TrendResult],
                 contents: list[PageContent]) -> GenerationResult:
        """
        メイン処理:
        1. 既存llms.txtを読み込む
        2. 既存Hot Topicsセクションを除去
        3. 新しいHot Topicsセクションを先頭に挿入
        4. ファイルに上書き保存
        """
        now_str = datetime.now(JST).strftime("%Y-%m-%d %H:%M:%S JST")
        if not self.llms_path.exists():
            return GenerationResult(
                success=False, llms_path=str(self.llms_path),
                hot_section="", char_count_before=0, char_count_after=0,
                trends_count=0, timestamp=now_str,
                error=f"llms.txtが見つかりません: {self.llms_path}"
            )

        original = self.llms_path.read_text(encoding="utf-8")
        char_before = len(original)

        # 既存Hot Topicsを除去
        clean = self._strip_existing_hot_section(original)

        # Hot Topicsセクション構築
        hot_section = ""
        if trends:
            hot_section = self._build_hot_section(trends, contents)
            new_content = hot_section + "\n\n" + clean
        else:
            logger.info("トレンドなし — Hot Topicsセクションは追加しません")
            new_content = clean

        self._backup()

        self.llms_path.write_text(new_content, encoding="utf-8")
        char_after = len(new_content)

        logger.info(
            f"llms.txt 更新完了: {char_before}文字 → {char_after}文字"
            f" (Hot Topics: {len(trends)}件)"
        )
        return GenerationResult(
            success=True, llms_path=str(self.llms_path),
            hot_section=hot_section, char_count_before=char_before,
            char_count_after=char_after, trends_count=len(trends),
            timestamp=now_str,
        )
