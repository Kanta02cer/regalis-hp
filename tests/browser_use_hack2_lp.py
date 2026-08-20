#!/usr/bin/env python3
"""Browser Use based behavior tests for the Hack II Founding Monitor LP.

The suite uses Browser Use's deterministic Actor API (Browser -> Page -> Element)
without an LLM or API key. It is safe against the production page: valid form
submission is exercised only for the local Jekyll build.
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import importlib.metadata
import json
import os
import sys
import time
import traceback
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Awaitable, Callable

from browser_use import Browser


@dataclass
class Check:
    name: str
    status: str
    severity: str
    details: str
    elapsed_ms: int


class Report:
    def __init__(self, mode: str, base_url: str) -> None:
        self.mode = mode
        self.base_url = base_url
        self.started_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        self.checks: list[Check] = []
        self.notes: list[str] = []
        self.metadata: dict[str, Any] = {
            "browser_use_version": importlib.metadata.version("browser-use"),
            "python": sys.version.split()[0],
        }

    async def run(
        self,
        name: str,
        fn: Callable[[], Awaitable[tuple[bool, str] | bool]],
        *,
        severity: str = "critical",
    ) -> None:
        started = time.monotonic()
        try:
            result = await fn()
            if isinstance(result, tuple):
                passed, details = result
            else:
                passed, details = bool(result), ""
            status = "pass" if passed else ("warn" if severity == "warning" else "fail")
        except Exception as exc:  # noqa: BLE001 - test report must keep running
            passed = False
            status = "warn" if severity == "warning" else "fail"
            details = f"{type(exc).__name__}: {exc}"
        elapsed = int((time.monotonic() - started) * 1000)
        self.checks.append(Check(name, status, severity, details, elapsed))
        print(f"[{status.upper():4}] {name}: {details}", flush=True)

    def add_result(
        self,
        name: str,
        passed: bool,
        details: str = "",
        *,
        severity: str = "critical",
        elapsed_ms: int = 0,
    ) -> None:
        status = "pass" if passed else ("warn" if severity == "warning" else "fail")
        self.checks.append(Check(name, status, severity, details, elapsed_ms))
        print(f"[{status.upper():4}] {name}: {details}", flush=True)

    @property
    def failures(self) -> list[Check]:
        return [c for c in self.checks if c.status == "fail"]

    @property
    def warnings(self) -> list[Check]:
        return [c for c in self.checks if c.status == "warn"]

    def write(self, output_dir: Path) -> None:
        output_dir.mkdir(parents=True, exist_ok=True)
        payload = {
            "mode": self.mode,
            "base_url": self.base_url,
            "started_at": self.started_at,
            "metadata": self.metadata,
            "summary": {
                "total": len(self.checks),
                "passed": sum(c.status == "pass" for c in self.checks),
                "failed": len(self.failures),
                "warnings": len(self.warnings),
            },
            "checks": [asdict(c) for c in self.checks],
            "notes": self.notes,
        }
        (output_dir / f"browser-use-{self.mode}-report.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        lines = [
            f"# Browser Use LP Test Report ({self.mode})",
            "",
            f"- Target: `{self.base_url}`",
            f"- Browser Use: `{self.metadata['browser_use_version']}`",
            f"- Result: **{payload['summary']['passed']} passed / {payload['summary']['failed']} failed / {payload['summary']['warnings']} warnings**",
            "",
            "| Result | Severity | Check | Details |",
            "|---|---|---|---|",
        ]
        icon = {"pass": "PASS", "fail": "FAIL", "warn": "WARN"}
        for check in self.checks:
            details = check.details.replace("|", "\\|").replace("\n", " ")
            lines.append(
                f"| {icon[check.status]} | {check.severity} | {check.name} | {details} |"
            )
        if self.notes:
            lines.extend(["", "## Notes", ""])
            lines.extend(f"- {note}" for note in self.notes)
        (output_dir / f"browser-use-{self.mode}-report.md").write_text(
            "\n".join(lines) + "\n", encoding="utf-8"
        )


async def evaluate(page: Any, expression: str, *args: Any) -> Any:
    value = await page.evaluate(expression, *args)
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "true":
            return True
        if stripped == "false":
            return False
        if stripped == "null":
            return None
        if stripped.startswith("{") or stripped.startswith("["):
            try:
                return json.loads(stripped)
            except json.JSONDecodeError:
                return value
    return value


async def wait_for(
    page: Any,
    expression: str,
    *,
    timeout: float = 8.0,
    interval: float = 0.15,
) -> Any:
    deadline = time.monotonic() + timeout
    last: Any = None
    while time.monotonic() < deadline:
        last = await evaluate(page, expression)
        if last:
            return last
        await asyncio.sleep(interval)
    raise TimeoutError(f"Timed out waiting for: {expression}; last={last!r}")


async def first(page: Any, selector: str) -> Any:
    elements = await page.get_elements_by_css_selector(selector)
    if not elements:
        raise AssertionError(f"Element not found: {selector}")
    return elements[0]


async def save_screenshot(page: Any, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = await page.screenshot(format="png")
    if isinstance(encoded, bytes):
        path.write_bytes(encoded)
        return
    if not isinstance(encoded, str):
        raise TypeError(f"Unexpected screenshot type: {type(encoded)!r}")
    if encoded.startswith("data:"):
        encoded = encoded.split(",", 1)[1]
    path.write_bytes(base64.b64decode(encoded))


async def fill_required_form(page: Any, site_url: str) -> None:
    values = {
        "#fUrl": site_url,
        "#fCompany": "Browser Use QA株式会社",
        "#fName": "自動テスト",
        "#fEmail": "qa-browser-use@example.invalid",
        "#fProduct": "AI検索モニタリング",
    }
    for selector, value in values.items():
        await (await first(page, selector)).fill(value)
    select = await first(page, "#fType")
    await select.select_option("代理店")
    consent = await first(page, "#fConsent")
    is_checked = await evaluate(page, "() => document.getElementById('fConsent').checked")
    if not is_checked:
        await consent.check()


async def clear_form(page: Any) -> None:
    await evaluate(
        page,
        """() => {
          document.getElementById('lpForm').reset();
          document.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
          document.querySelectorAll('.lp-error').forEach((el) => el.style.display = '');
          document.getElementById('fDomain').value = '';
          localStorage.removeItem('lp_submissions');
        }""",
    )


async def run_suite(mode: str, base_url: str, output_dir: Path, chrome_path: str | None) -> Report:
    report = Report(mode, base_url)
    browser: Any = None
    page: Any = None
    query = "utm_source=browser-use&utm_medium=qa&utm_campaign=founding-monitor&u=bu-e2e"
    target_url = f"{base_url.rstrip('/')}/?{query}"

    try:
        browser_kwargs: dict[str, Any] = {"headless": True}
        if chrome_path:
            browser_kwargs["executable_path"] = chrome_path
        browser = Browser(**browser_kwargs)
        await browser.start()
        page = await browser.new_page(target_url)
        await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
        await asyncio.sleep(1.0)

        report.metadata["resolved_url"] = await page.get_url()
        report.metadata["title"] = await page.get_title()

        await report.run(
            "page_loads_and_title_is_correct",
            lambda: _bool_detail(
                "Founding Monitor" in str(report.metadata["title"]),
                f"title={report.metadata['title']!r}",
            ),
        )

        await report.run(
            "required_meta_and_canonical_exist",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const description = document.querySelector('meta[name="description"]')?.content || '';
                  const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
                  const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
                  return JSON.stringify({
                    ok: description.length > 20 && canonical.includes('/lp/hack2/founding-monitor/') && ogTitle.length > 0,
                    description, canonical, ogTitle
                  });
                }""",
            ),
        )

        await report.run(
            "utm_and_u_parameters_are_captured",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const actual = {
                    source: document.getElementById('fUtmSource').value,
                    medium: document.getElementById('fUtmMedium').value,
                    campaign: document.getElementById('fUtmCampaign').value,
                    u: document.getElementById('fUParam').value,
                  };
                  return JSON.stringify({
                    ok: actual.source === 'browser-use' && actual.medium === 'qa' && actual.campaign === 'founding-monitor' && actual.u === 'bu-e2e',
                    actual
                  });
                }""",
            ),
        )

        await save_screenshot(page, output_dir / f"{mode}-desktop.png")

        hero_input = await first(page, "#heroUrl")
        await hero_input.fill("https://www.Example.com/products/?ref=qa")
        await (await first(page, "#heroUrlBtn")).click()
        await asyncio.sleep(0.8)
        await report.run(
            "hero_url_moves_to_form_and_normalizes_domain",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const actual = {
                    formUrl: document.getElementById('fUrl').value,
                    domain: document.getElementById('fDomain').value,
                    active: document.activeElement?.id || ''
                  };
                  return JSON.stringify({
                    ok: actual.formUrl === 'https://www.Example.com/products/?ref=qa' && actual.domain === 'example.com' && actual.active === 'fCompany',
                    actual
                  });
                }""",
            ),
        )

        await report.run(
            "calendar_is_not_visible_before_submit",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const section = document.getElementById('lpComplete');
                  const link = section.querySelector('a[href*="calendar.app.google"]');
                  const hidden = getComputedStyle(section).display === 'none';
                  return JSON.stringify({ok: hidden && !!link, hidden, href: link?.href || ''});
                }""",
            ),
        )

        await clear_form(page)
        await (await first(page, "#submitBtn")).click()
        await asyncio.sleep(0.3)
        await report.run(
            "empty_form_is_blocked_with_required_errors",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const errorCount = document.querySelectorAll('.lp-field.has-error').length;
                  const completeVisible = getComputedStyle(document.getElementById('lpComplete')).display !== 'none';
                  return JSON.stringify({ok: errorCount >= 5 && !completeVisible, errorCount, completeVisible});
                }""",
            ),
        )

        await report.run(
            "faq_opens_by_click",
            lambda: _click_first_faq(page),
        )

        await report.run(
            "faq_structured_data_is_valid_jsonld",
            lambda: _evaluate_condition(
                page,
                """() => {
                  try {
                    const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')].map((n) => JSON.parse(n.textContent));
                    const faq = nodes.find((n) => n['@type'] === 'FAQPage');
                    return JSON.stringify({ok: !!faq && Array.isArray(faq.mainEntity) && faq.mainEntity.length >= 3, faqCount: faq?.mainEntity?.length || 0});
                  } catch (error) {
                    return JSON.stringify({ok: false, error: String(error)});
                  }
                }""",
            ),
        )

        await report.run(
            "forbidden_free_and_zero_price_copy_are_absent",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const text = document.body.innerText;
                  const found = ['無料', '¥0', '￥0'].filter((term) => text.includes(term));
                  return JSON.stringify({ok: found.length === 0, found});
                }""",
            ),
        )

        await report.run(
            "images_are_loaded",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const broken = [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src);
                  return JSON.stringify({ok: broken.length === 0, imageCount: document.images.length, broken});
                }""",
            ),
        )

        await report.run(
            "controls_have_accessible_names",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const controls = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea, button')]
                    .filter((el) => !el.closest('[aria-hidden="true"]'));
                  const unnamed = controls.filter((el) => {
                    const label = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
                    return !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || label || el.textContent.trim());
                  }).map((el) => `${el.tagName.toLowerCase()}#${el.id}`);
                  return JSON.stringify({ok: unnamed.length === 0, controlCount: controls.length, unnamed});
                }""",
            ),
        )

        await report.run(
            "form_is_keyboard_navigable",
            lambda: _keyboard_navigation(page),
        )

        await report.run(
            "desktop_has_no_horizontal_overflow",
            lambda: _evaluate_condition(
                page,
                """() => JSON.stringify({
                  ok: document.documentElement.scrollWidth <= window.innerWidth + 1,
                  scrollWidth: document.documentElement.scrollWidth,
                  innerWidth: window.innerWidth
                })""",
            ),
        )

        await report.run(
            "same_origin_links_do_not_return_404",
            lambda: _evaluate_condition(
                page,
                """async () => {
                  const urls = [...new Set([...document.querySelectorAll('a[href]')]
                    .map((a) => new URL(a.href, location.href))
                    .filter((url) => url.origin === location.origin && !url.hash)
                    .map((url) => url.href))];
                  const results = [];
                  for (const url of urls) {
                    try {
                      const response = await fetch(url, {method: 'GET', redirect: 'follow'});
                      results.push({url, status: response.status});
                    } catch (error) {
                      results.push({url, status: 0, error: String(error)});
                    }
                  }
                  const failed = results.filter((item) => item.status === 404 || item.status === 0);
                  return JSON.stringify({ok: failed.length === 0, checked: results.length, failed});
                }""",
            ),
        )

        await page.set_viewport_size(390, 844)
        await page.reload()
        await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
        await asyncio.sleep(0.8)
        await save_screenshot(page, output_dir / f"{mode}-mobile.png")

        await report.run(
            "mobile_fixed_cta_is_visible",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const cta = document.getElementById('mobileCta');
                  const style = getComputedStyle(cta);
                  const rect = cta.getBoundingClientRect();
                  return JSON.stringify({
                    ok: style.display !== 'none' && style.position === 'fixed' && Math.abs(rect.bottom - window.innerHeight) <= 2,
                    display: style.display, position: style.position, rectBottom: rect.bottom, innerHeight: window.innerHeight
                  });
                }""",
            ),
        )

        await report.run(
            "mobile_has_no_horizontal_overflow",
            lambda: _evaluate_condition(
                page,
                """() => JSON.stringify({
                  ok: document.documentElement.scrollWidth <= window.innerWidth + 1,
                  scrollWidth: document.documentElement.scrollWidth,
                  innerWidth: window.innerWidth
                })""",
            ),
        )

        await evaluate(page, "() => document.getElementById('lp-form-section').scrollIntoView()")
        await asyncio.sleep(0.8)
        await report.run(
            "mobile_cta_hides_while_form_is_visible",
            lambda: _evaluate_condition(
                page,
                """() => {
                  const cta = document.getElementById('mobileCta');
                  return JSON.stringify({ok: cta.style.transform === 'translateY(100%)', transform: cta.style.transform});
                }""",
            ),
        )

        if mode == "local":
            await page.set_viewport_size(1440, 1100)
            await page.reload()
            await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
            await asyncio.sleep(0.6)
            await clear_form(page)

            await fill_required_form(page, "httpx://example.com")
            await (await first(page, "#submitBtn")).click()
            await asyncio.sleep(1.1)
            invalid_blocked = await evaluate(
                page,
                """() => getComputedStyle(document.getElementById('lpComplete')).display === 'none'""",
            )
            report.add_result(
                "non_http_scheme_is_rejected",
                bool(invalid_blocked),
                "`httpx://example.com` must not pass URL validation",
            )

            await page.reload()
            await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
            await asyncio.sleep(0.6)
            await clear_form(page)
            await evaluate(
                page,
                """() => {
                  window.__browserUseNetworkCalls = [];
                  const originalFetch = window.fetch;
                  window.fetch = function(...args) {
                    window.__browserUseNetworkCalls.push({type: 'fetch', url: String(args[0])});
                    return originalFetch.apply(this, args);
                  };
                  const originalOpen = XMLHttpRequest.prototype.open;
                  const originalSend = XMLHttpRequest.prototype.send;
                  XMLHttpRequest.prototype.open = function(method, url) {
                    this.__browserUseRequest = {method, url: String(url)};
                    return originalOpen.apply(this, arguments);
                  };
                  XMLHttpRequest.prototype.send = function() {
                    window.__browserUseNetworkCalls.push({type: 'xhr', ...(this.__browserUseRequest || {})});
                    return originalSend.apply(this, arguments);
                  };
                  const originalBeacon = navigator.sendBeacon?.bind(navigator);
                  if (originalBeacon) {
                    navigator.sendBeacon = function(url, data) {
                      window.__browserUseNetworkCalls.push({type: 'beacon', url: String(url)});
                      return originalBeacon(url, data);
                    };
                  }
                }""",
            )
            await fill_required_form(page, "https://www.Example.com/path/to/page")
            submit_button = await first(page, "#submitBtn")
            await submit_button.click()
            await evaluate(
                page,
                """() => document.getElementById('lpForm').dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}))""",
            )
            await asyncio.sleep(0.1)
            await report.run(
                "submit_button_is_disabled_during_submission",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const button = document.getElementById('submitBtn');
                      return JSON.stringify({ok: button.disabled && button.textContent.includes('送信中'), disabled: button.disabled, text: button.textContent});
                    }""",
                ),
            )
            await wait_for(
                page,
                "() => getComputedStyle(document.getElementById('lpComplete')).display !== 'none'",
                timeout=5,
            )
            await save_screenshot(page, output_dir / "local-completion.png")

            await report.run(
                "successful_submit_shows_calendar_completion",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const complete = document.getElementById('lpComplete');
                      const formSection = document.getElementById('lpForm').closest('.lp-sec');
                      const link = complete.querySelector('a[href*="calendar.app.google"]');
                      return JSON.stringify({
                        ok: getComputedStyle(complete).display !== 'none' && formSection.style.display === 'none' && !!link,
                        completionDisplay: getComputedStyle(complete).display,
                        formDisplay: formSection.style.display,
                        calendarHref: link?.href || ''
                      });
                    }""",
                ),
            )

            await report.run(
                "domain_inquiry_type_and_tracking_are_saved",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const rows = JSON.parse(localStorage.getItem('lp_submissions') || '[]');
                      const latest = rows.at(-1) || {};
                      return JSON.stringify({
                        ok: rows.length === 1 && latest.domain === 'example.com' && latest.inquiry_type === '代理店' && latest.utm_source === 'browser-use' && latest.u === 'bu-e2e',
                        count: rows.length,
                        latest: {domain: latest.domain, inquiry_type: latest.inquiry_type, utm_source: latest.utm_source, u: latest.u}
                      });
                    }""",
                ),
            )

            await report.run(
                "double_submission_is_blocked",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const rows = JSON.parse(localStorage.getItem('lp_submissions') || '[]');
                      return JSON.stringify({ok: rows.length === 1, submissionCount: rows.length});
                    }""",
                ),
            )

            await report.run(
                "submission_reaches_a_server_endpoint",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const calls = window.__browserUseNetworkCalls || [];
                      return JSON.stringify({ok: calls.length > 0, calls});
                    }""",
                ),
            )

            pii_in_storage = await evaluate(
                page,
                """() => {
                  const raw = localStorage.getItem('lp_submissions') || '';
                  return raw.includes('qa-browser-use@example.invalid') || raw.includes('自動テスト');
                }""",
            )
            report.add_result(
                "personally_identifying_form_data_is_not_persisted_in_local_storage",
                not bool(pii_in_storage),
                "Current implementation stores name and email in localStorage" if pii_in_storage else "No PII found in localStorage",
                severity="warning",
            )

            await page.reload()
            await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
            await asyncio.sleep(0.5)
            await clear_form(page)
            await fill_required_form(page, "https://example.com")
            await (await first(page, "#fax_number")).fill("bot-value")
            await (await first(page, "#submitBtn")).click()
            await asyncio.sleep(1.1)
            await report.run(
                "honeypot_blocks_bot_submission",
                lambda: _evaluate_condition(
                    page,
                    """() => {
                      const completeVisible = getComputedStyle(document.getElementById('lpComplete')).display !== 'none';
                      const count = JSON.parse(localStorage.getItem('lp_submissions') || '[]').length;
                      return JSON.stringify({ok: !completeVisible && count === 0, completeVisible, submissionCount: count});
                    }""",
                ),
            )

            await page.reload()
            await wait_for(page, "() => document.readyState === 'complete'", timeout=20)
            await asyncio.sleep(0.5)
            hero_empty = await first(page, "#heroUrl")
            await hero_empty.fill("")
            before_y = await evaluate(page, "() => window.scrollY")
            await (await first(page, "#heroUrlBtn")).click()
            await asyncio.sleep(0.8)
            after_y = await evaluate(page, "() => window.scrollY")
            report.add_result(
                "hero_cta_requires_url_before_progressing",
                bool(after_y == before_y),
                f"scrollY before={before_y}, after={after_y}; button currently progresses even when URL is empty",
                severity="warning",
            )

    except Exception as exc:  # noqa: BLE001
        report.add_result(
            "suite_execution",
            False,
            f"{type(exc).__name__}: {exc}\n{traceback.format_exc(limit=8)}",
        )
    finally:
        if browser is not None:
            try:
                await browser.stop()
            except Exception as exc:  # noqa: BLE001
                report.notes.append(f"Browser cleanup warning: {exc}")

    report.write(output_dir)
    return report


async def _bool_detail(value: bool, details: str) -> tuple[bool, str]:
    return value, details


async def _evaluate_condition(page: Any, expression: str) -> tuple[bool, str]:
    result = await evaluate(page, expression)
    if isinstance(result, dict):
        return bool(result.get("ok")), json.dumps(result, ensure_ascii=False)
    return bool(result), repr(result)


async def _click_first_faq(page: Any) -> tuple[bool, str]:
    details = await page.get_elements_by_css_selector(".lp-faq details")
    if not details:
        return False, "No FAQ details found"
    summaries = await page.get_elements_by_css_selector(".lp-faq summary")
    if not summaries:
        return False, "No FAQ summary found"
    await summaries[0].click()
    await asyncio.sleep(0.2)
    result = await evaluate(
        page,
        "() => JSON.stringify({ok: document.querySelector('.lp-faq details').open, open: document.querySelector('.lp-faq details').open})",
    )
    return bool(result.get("ok")), json.dumps(result, ensure_ascii=False)


async def _keyboard_navigation(page: Any) -> tuple[bool, str]:
    target = await first(page, "#fUrl")
    await target.focus()
    await page.press("Tab")
    active = await evaluate(page, "() => document.activeElement?.id || ''")
    return active == "fCompany", f"activeElement after Tab={active!r}"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("local", "production"), required=True)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--chrome-path", default=os.environ.get("CHROME_PATH"))
    return parser.parse_args()


async def main() -> int:
    args = parse_args()
    report = await run_suite(args.mode, args.base_url, args.output_dir, args.chrome_path)
    print(
        json.dumps(
            {
                "mode": report.mode,
                "passed": sum(c.status == "pass" for c in report.checks),
                "failed": len(report.failures),
                "warnings": len(report.warnings),
            },
            ensure_ascii=False,
        )
    )
    return 1 if report.failures else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
