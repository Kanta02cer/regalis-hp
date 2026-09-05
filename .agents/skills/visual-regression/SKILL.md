---
name: visual-regression
description: Use after modifying layouts, CSS, navigation, home, HackⅡ, insights, company, contact, or responsive components. Runs browser-based desktop/mobile checks, captures screenshots, and blocks release on visual or console regressions.
---

# Visual regression workflow

1. Build and serve the Jekyll site locally.
2. Test at 1440x900, 1024x768, 390x844, and 360x800.
3. Cover `/`, `/trillionbank/business/hack2/`, `/trillionbank/insights/`, `/trillionbank/company/`, `/trillionbank/contact/`, and one article.
4. Check header/menu, keyboard focus, CTA destinations, forms, images, text wrapping, overflow, layout shift, reduced motion, and footer.
5. Record console errors, failed requests, and accessibility-critical issues.
6. Compare screenshots with the current main branch when available.
7. Do not approve release with clipped text, horizontal scroll, hidden CTA, broken mobile navigation, duplicate IDs, or uncaught JavaScript errors.
