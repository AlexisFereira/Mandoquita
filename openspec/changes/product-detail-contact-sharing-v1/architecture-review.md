# Product Detail Contact and Sharing V1 — Architecture Review

Status: Approved

Owner: Project Architect

Date: 2026-07-13

## Canonical URL Boundary

- Deployment owns a server-side public-site-origin configuration. Production
  requires an absolute HTTPS origin with no credentials, query, fragment or
  non-root path. HTTP is allowed only for explicit local test/development hosts.
- Construct canonical Product URL with the platform URL parser from the governed
  origin and `/products/{canonical slug}`. Do not concatenate untrusted raw URL
  strings.
- Do not derive canonical origin from arbitrary `Host`, forwarded-host, referrer,
  browser location or incoming alias. Existing slug resolution/redirect occurs
  before Product Detail props and external payloads are built.
- Use the same absolute URL for canonical metadata, `og:url`, WhatsApp context,
  Web Share and copy/manual fallback.
- Missing/invalid production origin fails closed for Contact/Share payloads and
  must be caught by Deployment validation; it never creates a guessed URL.

## WhatsApp Configuration and Safety

- Deployment provides the same Business-approved international WhatsApp number
  used by Homepage through server runtime configuration.
- Normalize a configured number to digits only after validating one international
  number (8–15 digits). Reject extensions, multiple recipients, URL fragments,
  arbitrary hosts or prebuilt query strings.
- Build the destination only as `https://wa.me/{digits}?text={encoded message}`
  using a URL/search-parameter API. Product name is normalized as public text and
  cannot alter host, path or parameters.
- Compute the per-Product contact URL on the server and expose only the resulting
  safe public URL needed by the page. Never expose unrelated environment values.
- Missing/invalid configuration returns no contact URL; Frontend omits the action.
- External activation uses a new browsing context with `noopener`, `noreferrer`
  and no-referrer behavior. No return callback or delivery-success claim exists.

## Share and Clipboard Capability Boundary

- Pass canonical URL and approved public Product name as page data; no new API or
  server mutation is required.
- On explicit visitor activation, capability-detect Web Share. Submit exactly the
  approved title, text and URL.
- Treat `AbortError`/visitor cancellation as neutral. Other native failures move
  to copy/manual-link recovery without automatic retry.
- Clipboard write occurs only after explicit visitor activation in a secure
  context. Copy only canonical URL. If unavailable/denied, expose the same URL as
  an ordinary selectable/navigable link with polite failure status.
- Do not load a sharing SDK, enumerate installed applications, append tracking or
  record contact/share behavior.

## Gallery Boundary

- Continue using the existing Product Detail projection with ordered Images,
  Primary flag, stable Image ID, alternative text and Variant `imageId`.
- No schema, upload endpoint, media query or duplicated client gallery store is
  authorized. PDS-011 verifies compatibility; PDS-012 consumes the projection.

## CSP, Referrer and Privacy

- This change requires no relaxation of script, connect, image, frame or form CSP
  directives and adds no third-party script/frame.
- Permit only code-constructed navigation to the exact HTTPS `wa.me` origin;
  external pages receive no opener and no referrer.
- Web Share/Clipboard run under existing self-origin security policy and user
  activation. If a Permissions Policy governs Clipboard, limit it to self.
- Never add session identifiers, current referrer, visitor data, selected Variant,
  price/currency, SKU, Admin fields or analytics parameters to external content.
- Logs may record safe configuration-validation failures, never the complete
  generated message, recipient query, Clipboard content or visitor action.

## Rendering and Failure

- Product SSR remains independent from third-party availability. No request to
  WhatsApp or sharing service occurs during render.
- Missing canonical/contact configuration degrades only external actions;
  gallery, Product identity and offer content remain intact.
- Product alias redirect precedes rendering. Retired/unpublished Product outcomes
  remain governed by the released public Product contract.
- Frontend reports only local copy/failure status. It never claims external
  delivery, receipt or response.

## Rollback

- Contact and Share UI can be removed while retaining canonical metadata and the
  released gallery. No database rollback is required.
- Runtime configuration can disable WhatsApp by omission without creating a
  fallback recipient.
- Because no persistence/domain mutation is added, rollback restores the prior
  Product Detail component and props without data conversion.

## Review Outcome

PDS-005 is approved. UX, Design System, Backend and Frontend can proceed without
an unresolved URL, configuration, external-navigation, CSP or privacy decision.
