# Website release QA checklist

## Content and disclosure

- [ ] current legal name, address and representative match approved facts
- [ ] HackⅡ and Adctor stages are distinct
- [ ] no stale or public price appears in HTML, JSON-LD or machine-readable files
- [ ] no customer, investor, private partner, cash, cap-table or patent detail appears
- [ ] no unsupported superlative or outcome guarantee appears
- [ ] every external non-trivial claim has a primary source and date

## Technical

- [ ] content guard passes
- [ ] Jekyll build passes without new warning
- [ ] YAML and JSON parse
- [ ] internal links and assets resolve
- [ ] canonical and robots are correct
- [ ] sitemap includes intended pages only
- [ ] structured data matches visible content
- [ ] generated `llms.txt` matches current public pages

## Browser and accessibility

- [ ] desktop and mobile header/navigation work
- [ ] no horizontal scroll, clipping or layout shift
- [ ] keyboard focus is visible
- [ ] forms have labels, consent and error states
- [ ] CTA destinations and analytics events work
- [ ] no uncaught console error or failed critical request
- [ ] reduced-motion preference is respected

## Pull request evidence

- [ ] changed route list
- [ ] screenshots
- [ ] test/build output
- [ ] source and approval notes
- [ ] rollout/rollback steps
- [ ] remaining manual approvals
