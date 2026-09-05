# Website QA checklist

## Content and governance
- [ ] company facts match `_data/public_facts.yml`
- [ ] HackⅡ and Adctor stages are distinct
- [ ] no customer, investor, financing, cap-table, cash, patent or private partner information
- [ ] no old price or unsupported superlative
- [ ] facts, interpretation, estimate and roadmap are separated
- [ ] external claims use current primary sources and dates

## Technical
- [ ] content guard passes
- [ ] YAML/JSON parse
- [ ] Jekyll build passes
- [ ] internal links and assets resolve
- [ ] canonical, robots and sitemap agree
- [ ] JSON-LD matches visible copy and parses
- [ ] one H1 and logical heading order

## Browser and accessibility
- [ ] 1440x900, 1024x768, 390x844, 360x800 reviewed
- [ ] no horizontal scrolling or clipped text
- [ ] menu and CTAs work by keyboard
- [ ] visible focus and adequate contrast
- [ ] form labels/errors work and PII is not sent to analytics
- [ ] no console error or failed critical request
- [ ] reduced-motion preference respected

## Release evidence
- [ ] before/after screenshots
- [ ] changed routes and redirects
- [ ] source/approval matrix
- [ ] test output
- [ ] manual approvals and known limitations
- [ ] rollout and rollback instructions
