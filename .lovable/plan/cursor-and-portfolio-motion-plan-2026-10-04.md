# Cursor and portfolio motion plan

## Outcome
- Keep a clearly visible pointer throughout the portfolio, not only over project cards.
- Give About, Skills, Certificates, Experience, Testimonials, GitHub, and Contact a coordinated entrance rhythm that complements the existing hero without changing their content or layout.
- Make a project card visually expand into its existing dedicated detail page. Direct project links, refresh, Back, and reduced-motion behavior will continue to work.
- Animate the existing Experience timeline and its internal scroll-progress line without making the page longer.

## Implementation
1. **Cursor:** Stop hiding the browser pointer until the custom cursor has actually initialized; restore the native pointer whenever custom motion is unavailable. Keep the high-contrast dot visible above all page layers, update its position immediately on entry/movement, and avoid card hover effects masking it.
2. **Section choreography:** Reuse the existing Framer Motion easing and timing budget for section headings, text, grids, and key media. Stagger child elements briefly as each section comes into view, synchronize graph/bar/card reveals, and avoid conflicting reveal systems or long waits. Preserve the existing preloader and homepage hero.
3. **Project expansion:** Connect project-card media/title to matching detail-page hero elements with shared-layout animation, while retaining `/projects/:slug` as the canonical page. Coordinate route presence, scroll reset, and stacking so the old card visually becomes the new page rather than showing a normal page swap; use a simple crossfade for direct links and reduced motion.
4. **Timeline:** Animate milestone entry in order within the existing scrollable Experience block; drive its vertical progress line smoothly from that block's scroll position. Keep filters, internal scrolling, mobile alignment, and the current section height intact.
5. **Validation:** Check desktop and mobile pointer fallback, section reveals, project open/back/deep-link behavior, Experience filtering and scrolling, reduced motion, preview errors, and relevant tests.

## Technical notes
- Use existing React, Framer Motion, React Router, and CSS tokens; no new animation dependency or data change.
- Route transitions must briefly coexist for shared elements; scope that behavior to project navigation and prevent layout jumps or hidden content.
