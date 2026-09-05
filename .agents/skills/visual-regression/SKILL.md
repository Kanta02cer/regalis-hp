---
name: visual-regression
description: Use after modifying Trillion Bank layouts, CSS, navigation, home, HackⅡ, Adctor, insights, company, contact, or responsive components. Runs browser-based desktop and mobile checks, captures screenshots, checks console and network errors, and blocks release on visual, interaction, accessibility, or responsive regressions.
---

# Visual regression workflow

1. Build and serve the Jekyll site locally.
2. Test at 1440x900, 1024x768, 390x844, and 360x800.
3. Cover `/`, HackⅡ, Adctor, insights, company, contact, and at least one article.
4. Check header/menu, keyboard focus, CTA destinations, forms, images, text wrapping, overflow, layout shift, reduced motion, and footer.
5. Record console errors, failed requests, and accessibility-critical issues.
6. Compare screenshots with the current `main` branch when available.
7. Do not approve release with clipped text, horizontal scroll, hidden CTA, broken mobile navigation, duplicate IDs, uncaught JavaScript errors, or inaccessible controls.
