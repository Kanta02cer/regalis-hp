# Structured-data map

Structured data describes visible content; it does not create eligibility or authority by itself.

| Page type | Schema | Conditions |
|---|---|---|
| All public pages | Organization, WebSite, WebPage | company facts come from `_data/public_facts.yml`; no unsupported SearchAction |
| Service page | Service, BreadcrumbList | service status, scope and limitations must be visible |
| Article | Article or TechArticle, BreadcrumbList | author, dates, publisher and references visible |
| Author profile | ProfilePage, Person | biography and sameAs links must be approved and visible |
| Visible FAQ | FAQPage | exact questions and answers must appear on page; do not generate fake FAQs |
| Contact | ContactPage | do not expose personal contact data in schema |

## Explicit exclusions

- no AggregateOffer or price schema while public pricing is disabled;
- no Product ratings or reviews without real eligible evidence;
- no LocalBusiness unless the page is genuinely for a customer-facing local business;
- no SearchAction without a working internal search endpoint;
- no hidden claims in JSON-LD;
- no `knowsAbout` list used as keyword stuffing.
