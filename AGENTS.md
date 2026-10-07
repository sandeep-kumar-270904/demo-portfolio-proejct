- Keep homepage section choreography in the shared reveal observer so asynchronously loaded CMS sections enter consistently without duplicated per-section observers.
- Keep project-card/detail transitions in a shared Framer Motion layout group around route presence so the canonical project URL remains navigable and direct links still render independently.
- Activate the decorative cursor only after a real fine-pointer movement and mounted cursor elements so native pointer access remains available whenever motion is unavailable.
- Keep live visitor presence in one shared channel per browser tab so route-transition overlap cannot double-subscribe or fragment the displayed count.

- Gate public route mounting behind the completion-driven intro; advance each phrase only after reveal, hold, and fade finish so page animations never race the intro.
- Use Lenis as the only animated scroll engine, with native touch, nested scrolling, and live reduced-motion fallback to avoid competing scroll easing.
