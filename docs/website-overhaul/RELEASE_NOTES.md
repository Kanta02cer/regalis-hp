# Release notes - website authority overhaul

Date: 2026-09-05
Branch: `feature/website-authority-overhaul-20260905`
Status: release candidate / manual approval pending

## Included

- `_data/public_facts.yml` as the approved public-fact source;
- publication policy, content guardrails and automated public-content validation;
- exact legal-name and public-contact normalization;
- rewritten home, business overview, company, HackⅡ, Adctor, Insights and policy pages;
- HackⅡ positioned as limited commercial validation and managed decision support;
- Adctor positioned separately as research and limited PoC;
- source-backed AI-search articles with author, reviewer, update date, visible FAQ and references;
- common Organization, Person, WebSite, WebPage, Service, Article and Breadcrumb structured data;
- public-safe robots, sitemap, knowledge, site-structure and llms files;
- responsive Playwright validation across 12 routes and four viewports;
- build and screenshot artifacts attached to the pull-request workflow;
- Formrun and booking destination reachability checks;
- legacy business pages converted to `noindex, follow` move notices;
- post-deployment IndexNow submission limited to changed, indexable production URLs.

## Removed or disabled

- automatic article generation and automatic content rewriting;
- old AICS/Regalis report, scoring, patch and case-study commands;
- local OAuth/service-account setup scripts that encouraged credentials in the public repository;
- stale image-generation presets and duplicate IndexNow scripts;
- npm commands that referenced files already removed from the branch;
- Google sitemap ping calls and claims that Google accepts IndexNow submissions.

## Automated validation completed

- public-content governance: passed;
- YAML and JSON validation: passed;
- Jekyll production build: passed;
- required route generation: passed;
- canonical, robots and JSON-LD browser checks: passed;
- internal image requests: passed;
- desktop, tablet and mobile horizontal-overflow checks: passed;
- mobile navigation smoke test: passed;
- Formrun and Google Calendar public destinations: reachable;
- 48 route/viewport browser checks: passed with no blocking findings.

## Manual approvals still required before production merge

1. Representative or delegated owner confirms the public company facts and HackⅡ/Adctor status wording.
2. The owner of the Formrun form submits one test inquiry and verifies receipt, notification and privacy handling.
3. The owner of the booking calendar creates and cancels one test booking and verifies timezone and notifications.
4. Legal reviews the privacy policy, terms and security wording as publication drafts.
5. A repository owner reviews the large deletion set and confirms that required internal material exists in an approved private location.
6. Repository history is reviewed separately for previously committed credentials, contracts, customer data and patent material; current-tree deletion is not history erasure.
7. Only approved logos, screenshots, portraits and third-party media assets are published.

## Production rollout

1. Complete and record the manual approvals above.
2. Mark PR #7 ready for review and obtain final approval.
3. Merge to `main`; the GitHub Pages workflow performs the production build and deployment.
4. Confirm the Pages deployment succeeded before treating the site as released.
5. Validate the production home, HackⅡ, Adctor, company, Insights, contact and meeting routes.
6. Verify canonical, robots, sitemap, JSON-LD, Formrun, booking and GA4 on the live domain.
7. The IndexNow workflow runs only after a successful production Pages deployment.

## Rollback

Revert the merge commit on `main` and allow the Pages workflow to redeploy the previous revision. Existing canonical routes for HackⅡ and Adctor are preserved, so DNS changes are not required. Do not restore confidential material to the public repository during rollback.
