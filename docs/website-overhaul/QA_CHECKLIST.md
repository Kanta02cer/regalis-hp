# Website QA checklist

## Automated checks completed

- [x] public facts are read from `_data/public_facts.yml`
- [x] HackⅡ and Adctor stages are distinct
- [x] content guard passes
- [x] YAML and JSON parse
- [x] Jekyll production build passes
- [x] required public routes are generated
- [x] canonical, robots and JSON-LD browser checks pass
- [x] same-origin images used by tested pages resolve
- [x] 1440x900, 1024x768, 390x844 and 360x800 smoke checks pass
- [x] no horizontal scrolling on the 12 tested routes
- [x] mobile navigation opens and closes
- [x] no blocking page or console errors on tested routes
- [x] Formrun and booking destinations are publicly reachable
- [x] screenshots and a machine-readable report are attached to CI artifacts
- [x] static client-side admin pages and embedded credential material are absent
- [x] forbidden admin/config paths are enforced by CI

## Manual content and governance approval

- [ ] representative or delegated owner confirms legal company facts
- [ ] HackⅡ current scope and status wording are approved
- [ ] Adctor research/PoC wording is approved
- [ ] large deletion set is reviewed and internal copies are confirmed
- [ ] customer, investor, financing, cap-table, cash, patent and private-partner information remains excluded
- [ ] approved logos, screenshots, portraits and third-party media rights are confirmed
- [ ] external claims and dates receive final editorial review

## Manual form, accessibility and production checks

- [ ] submit one Formrun test and verify receipt, notification and privacy handling
- [ ] create and cancel one calendar test booking; verify JST and notifications
- [ ] verify keyboard-only navigation and visible focus on production
- [ ] perform manual contrast and screen-reader spot checks
- [ ] confirm that form personal data is not sent to GA4
- [ ] validate GA4 events in DebugView or production realtime
- [ ] validate Search Console ownership and sitemap submission
- [ ] validate live redirects and legacy `noindex, follow` pages

## Security and history checks

- [x] current-tree static admin interface removed
- [x] current-tree client-side credential configuration removed
- [x] committed local Bundler config removed
- [ ] rotate any credential that was ever reused from the removed admin configuration
- [ ] review Git history for credentials, contracts, customer data and patent material
- [ ] approve and execute a separate history rewrite when required

## Release evidence

- [x] changed routes and staged legacy pages documented
- [x] automated test output available
- [x] rollout and rollback instructions documented
- [ ] manual approvals recorded in the PR
- [ ] production deployment result recorded in the PR
- [ ] post-release live validation recorded in the PR
