# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

This surface has two audiences, and the outer one is the real one.

**Primary (real): small-business owners in Buenos Aires evaluating who to hire.**
They arrive by opening a link sent to them directly — no portfolio index around
it, no case-study framing, no prior context. They are not developers and will
not read the source. They judge by proxy: "if my shop looked like this, would I
be happy?" The cafetería subject is deliberate — it is close enough to their own
business that the demo reads as a preview of their site rather than an abstract
exercise.

**Depicted (in-fiction): a Buenos Aires coffee drinker choosing where to go.**
The page addresses this person throughout. They are not a real audience, but the
page must stay convincingly in-character for them, because that legibility is
exactly what persuades the primary audience. A demo that visibly behaves like a
demo proves nothing.

## Product Purpose

A portfolio piece in the shape of a working landing page for a specialty coffee
shop. It exists to win freelance work: the visitor should finish the scroll
believing the builder can make their business look like this, and should be able
to act on that belief.

Success is contact — the visitor reaching out. Not time on page, not scroll
depth.

## Positioning

What a neighboring coffee-shop demo could not truthfully copy:

- **Three motion systems with separate, documented jobs and no collisions.**
  Lenis owns page scroll; GSAP/ScrollTrigger owns pin, scrub, and entry
  timelines; Motion owns viewport entries, the mobile menu, and the Carta
  category-tab transitions. GSAP and Motion never share a component. Lenis and
  ScrollTrigger are bridged in `src/lib/useSmoothScroll.js` so pinned sections
  stay in phase with smoothed scroll. (A fourth system — a Three.js/R3F hero
  shader, `src/components/Crema.jsx`/`FondoCrema.jsx` — was built and then
  shelved; see Known asset debt. It is not part of the shipped page and
  should not be described to a prospect as running.)
- **Fallbacks that are functional rather than cosmetic.** Under
  `prefers-reduced-motion: reduce`, Lenis does not mount, no ScrollTrigger runs,
  the scroll-stack stops stacking, and the map jumps instead of flying.
- **Porteño specificity instead of stock-café generics.** Named streets, real
  neighborhoods, Argentine register, details with texture ("entran perros",
  "enchufes en todas las mesas").
- **A README that documents rationale and admits debt.** Measured contrast
  ratios, the reason a token was chosen over its neighbor, and an open list of
  what is still wrong with the assets.

## Operating Context

- Delivered as a **standalone URL**, sent directly to a prospect. Nothing wraps
  it and nothing explains it. It must work cold, on first load, with no framing.
- Scroll is the entire interaction. There is no account, no signup, no
  authenticated state, and no second page.
- The visitor may well open it on a phone, in a WhatsApp in-app browser, on a
  mid-range Android.
- Language is Spanish (es-AR). The document is `lang="es-AR"`.

## Capabilities and Constraints

- **Sections, in order:** Hero, Marquee, Origen (Nosotros), Carta, Ritual,
  Locales, Voces, Cierre. Single page. Carta (`CartaCompleta.jsx`) is the
  full eighteen-item menu, grouped into four categories with price and
  description per item, filterable by tab.
- **No backend.** The footer notification form simulates its call in
  `Cierre.jsx`; the real POST would go there.
- **No API keys or tokens anywhere.** The map uses CARTO dark tiles over
  OpenStreetMap data. Attribution for both is mandatory and must stay in the map
  control.
- **Locales are a single source of truth.** `src/lib/locales.js` feeds the list,
  the pins, the Google Maps link, and the footer address line.
- **Leaflet is lazy-loaded** (~156 kB, well below the fold).
- **The hero is a static photo panel**, not a shader: `Hero.jsx` renders
  `MEDIA.hero` full-bleed with GSAP scroll parallax on `.hero-media`. It does
  not mount `Crema`/`FondoCrema` — see Known asset debt.
- **Contact path — resolved via HojaDemo.** Every CTA that would otherwise
  dead-end (Reservar, the social icons) opens `HojaDemo`, which names the real
  author and offers a real WhatsApp/mail contact, both sourced from
  `src/lib/autor.js`. This was an open decision; it now ships.
- **Open decision — the name.** "Cafetería" is a placeholder, not a brand.

## Brand Commitments

**Binding.**

- **es-AR voice and porteño specificity.** Spanish, Argentine register, grounded
  in Palermo and Recoleta. Named streets and concrete, human details. Do not
  neutralize this into international Spanish or generic café copy.
- **The motion architecture as documented above.** The separation of concerns
  between Lenis, GSAP, and Motion is the thing being demonstrated. Work that
  blurs those boundaries damages the point of the piece.

**Incumbent but not declared binding** — currently true, revisable in a future
design pass rather than protected:

- The dark theme lock (black page, one red accent in three weights, no inverted
  sections), described in `src/index.css` as a brand decision.
- Reduced-motion parity across every effect.

## Evidence on Hand

**Real:** the photography in `src/media/`, mapped through `src/lib/media.js`;
the hero photo at `public/hero-cafe.jpg`; the coordinates in
`src/lib/locales.js`; the README's own documentation.

**Fictional — must not be presented as fact or expanded into new claims:**
prices, hours, addresses, and all testimonials in Voces. There is no real
cafetería behind this, no real customers, no press, no case study, and no
metrics. Do not invent client names, review counts, awards, or traffic numbers.

**Known asset debt** (from the README, unresolved):

- `public/hero-cafe.jpg` (the LCP element) is a duplicate of
  `filtrado_v60.jpg`, reused because it's the only photo on hand with the
  hero's warm, hand-pouring mood — but it means the same image appears twice
  on the page (hero and the Carta grid, as `menu.v60`). Wants a dedicated
  horizontal shot.
- `int_horizontal.jpg` is 735×490 and runs full-bleed; it wants ~2400 px.
- The scroll-stack photos are vertical and crop hard at full-bleed width; any
  replacement must keep its subject centered.
- **Fourteen photos in `CartaCompleta.jsx` (the menu section) are
  hotlinked from `images.unsplash.com` rather than bundled through
  `src/lib/media.js`'s normal Vite pipeline.** The dev environment that added
  them had no outbound network access from its shell, so there was no way to
  download and commit them as local files — see `src/lib/media.js` and the
  README's Fotos section. They work, but depend on an external host, carry no
  long cache, and weren't verified image-by-image against the product they
  label (chosen from Unsplash's own alt text). Resolved as part of this
  debt: the old `espresso_doble.jpg`, which carried a visible
  `www.CBstore.eu` watermark and showed milk being poured rather than an
  espresso, was replaced by one of these hotlinks.
- **The hero shader (`src/components/Crema.jsx`/`FondoCrema.jsx`) is built but
  unwired.** It was pulled from `Hero.jsx` in a refactor and nothing currently
  imports either file; the Hero-Only accent colors it introduced (Espresso
  Shell, Roast Amber, Crema Gold, in `DESIGN.md`) are consequently dormant.
  Kept in the repo as a shelved option, not a bug — but it must not be
  described in Positioning as something the shipped page runs.

## Product Principles

1. **Stay in character.** The page persuades by being a convincing cafetería
   landing, not by announcing itself as a demo. Anything that reveals the
   scaffolding weakens the proof.
2. **The prospect is not a developer.** Technique earns its place by being felt,
   not by being legible as technique. Nothing should require explanation to land.
3. **Ambition is the point, and so is the fallback.** This piece exists to show
   range, so effects should be genuinely ambitious — and each one owes a real
   degraded path, because a broken effect on a prospect's phone costs the job
   outright.
4. **Concrete beats generic.** Named streets, specific hours, particular
   details. The specificity is what separates this from a template, and it is
   what the prospect is actually buying.
5. **Say what is fake.** Fictional content stays labeled as fictional in the
   repo, and known debt stays written down rather than quietly shipped.

## Accessibility & Inclusion

**No formal standard is set.** Recorded as undecided rather than assumed.

The current implementation already carries measured AA contrast ratios (the
hero's red headline is documented at 3.65:1 desktop / 3.40:1 mobile against the
shader's brightest point, above the AA floor for large text) and reduced-motion
fallbacks throughout. Treat these as the existing baseline: do not regress them
silently, but AA is not a gate on new work until the user says it is.
