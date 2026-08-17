# Design System: Cafetería — Hero Exploration

> Scoped brief for Google Stitch. This covers the full brand system so generated
> screens stay coherent, but the generation target is the **Hero section only**
> — the first viewport of a specialty-coffee landing page in Buenos Aires. The
> cup photo is not a fixed requirement here: explore freely for the strongest
> composition, as long as it stays inside this palette, type system, and the
> anti-pattern list below.

## 1. Visual Theme & Atmosphere

**Creative North Star: "The After-Dark Roastery."** A specialty-coffee counter
at closing time — matte black room, one neon-red sign doing all the talking,
warmth held in reserve for wherever the real coffee/product imagery lives.
Confidence over decoration: one dominant accent used sparingly, a cartel-style
display face for anything that needs to shout, and total black — no inverted
or light section anywhere.

- **Density:** 3 — Art Gallery Airy. The hero is one idea, not a feature dump.
- **Variance:** 8 — Offset Asymmetric. Centered hero layouts are banned here.
- **Motion:** 6 — Fluid, physical, restrained. One perpetual micro-loop max;
  no cinematic choreography, no scroll-jacking.

The page must read as a real Buenos Aires business's site, not a template or a
demo. Every rule below exists because it solves a specific problem (contrast,
legibility, a specific porteño detail) — not because it looked nice alone.

**Open for exploration:** the hero does NOT have to center on a cup photo.
Good alternative directions to try: a texture/steam/grain-driven composition
with typography as the hero object; a tight crop of roasted beans or a pour
shot used as a background field rather than a cutout; an entirely
typographic hero where the "Two-Tempo Headline" carries the whole frame and
photography is deferred to the next section. Judge candidates by: does it
still feel like a real closing-time roastery, and does Sign Red still read as
the one thing in the room that moves.

## 2. Color Palette & Roles

- **Roastery Black** (`#0b0b0c`) — page floor, the dominant surface. Not pure
  black — carries a hair of warmth.
- **Concrete Counter** (`#131316`) — first raised plane (cards, media frames).
- **Raised Counter** (`#1b1b1f`) — second raised plane (hover, active states).
- **Steam Line** (`#26262b`) — hairline borders only, never a fill.
- **Warm Porcelain** (`#f5f2ee`) — primary text, headline default color.
- **Ash Taupe** (`#a8a29b`) — secondary text, captions, supporting copy.
- **Spent Grounds** (`#6b6660`) — decorative type / inactive icons only.
  Never body text — it fails contrast at small sizes.
- **Sign Red** (`#cc2a26`) — the single accent. Primary CTA fill, the
  headline's punchline, selected states. Nothing else in the interface earns
  a saturated color.
- **Neon Red** (`#ff5b52`) — the accent's job whenever it sits directly on a
  photo or on black outside a button (small text, icons, a price) — measured
  to hold contrast under a darkening veil where the base Sign Red collapses.
- **Char Red** (`#99201d`) — hover/pressed state for filled buttons only.

Hero-only, photo-derived atmosphere (do not use as UI color anywhere else):
**Espresso Shell** (`#1d1209`), **Roast Amber** (`#8c4b21`), **Crema Gold**
(`#c8813c`) — reserved for background shader tones, halos, or gradients
behind hero imagery. If the explored hero has no photography, these three can
still appear as an ambient shader/gradient field, but never as text or
control color.

**The One Sign Rule:** Sign Red is the only saturated color the hero puts a
decision behind. If a second saturated hue starts carrying meaning, both lose.

## 3. Typography Rules

- **Display:** Anton (fallback: Arial Narrow, sans-serif) — condensed cartel/
  menu-board shout. Uppercase. Track-tight (-0.01em). Line-height 0.96 on any
  wrapped headline (Anton's cap-height overshoots a 0.9 line-box).
- **Body:** Outfit Variable (fallback: system-ui, sans-serif) — quiet humanist
  grotesque, relaxed leading (1.6), max ~40ch measured line length.
- **Hierarchy inside the hero headline — "Two-Tempo Rule":** a short setup
  line in Warm Porcelain, then a punchline line at more than double the
  setup's size, always in Sign Red. Two tempos, not two equal lines.
- **Banned:** Inter. Generic serifs (Times New Roman, Georgia, Garamond).
  Fake round stats, generic placeholder copy ("Lorem", "Acme Coffee").

## 4. The Hero, Specifically

- **No filler UI text.** No "Scroll to explore," no bouncing chevron, no
  scroll-cue icon. The headline and single CTA are the entire pull.
- **One CTA only.** "Reservar" (or equivalent booking/contact action) as a
  solid Sign Red pill. No competing secondary link fighting it for weight —
  a ghost-style secondary link ("Ver la carta") may sit beside it but must
  read as visually subordinate (outline/ghost, not a second solid fill).
- **Asymmetric structure required** — split-screen, left-aligned, or
  offset-weighted composition. A dead-centered hero is banned at this
  variance level.
- **If photography/imagery is used:** treat it as a single confident object
  (a cutout, a tight crop, a texture field) — not a stock photo grid. Warm,
  unretouched, real-feeling. Never a generic "AI-glossy" coffee photo.
- **Inline-image typography is worth testing:** small round-cropped photo
  fragments (a bean, a steam wisp, a crema swirl) sitting inline at
  type-height between words of the setup line, never overlapping the
  punchline. This project already has "loose coffee-bean cutouts" planned as
  an asset — a legitimate direction to explore, not a requirement.
- **No overlap, anywhere.** Headline, CTA, and any imagery each keep a clean
  spatial zone. No text laid over a cup/plate/hand where legibility depends
  on a lucky contrast spot.
- **Grain, not gradient-slop.** A very low-opacity noise/grain layer over the
  black is welcome (reads as steam/light, not a filter). Large saturated
  gradient text on the headline is not — color comes from the Two-Tempo Rule,
  not a gradient fill.

## 5. Component Stylings

- **Buttons:** pill shape (`rounded-full`), no exceptions. Primary = Sign Red
  fill / white text, hover → Char Red. Ghost = hairline border, `black/40`
  translucent fill with blur, hover → border lightens, fill shifts to Raised
  Counter. Press feedback is a 1px sink (`translateY(1px)`), never a scale
  pop, never an outer glow.
- **Cards (if any appear near the hero, e.g. a stat/trust strip):** 20px
  corner radius, Concrete Counter background, hairline border, no drop
  shadow — depth comes from the black → concrete → raised tonal stack only.

## 6. Layout Principles

- Container capped around `1400px`, generous side padding (`~40px` desktop,
  `~20px` mobile).
- Full-height hero uses dynamic viewport height (`100dvh` equivalent) — never
  a fixed `100vh` unit, to avoid the iOS Safari toolbar jump.
- CSS Grid for the split, not flex percentage math.
- No 3-column equal layouts anywhere near the hero.

## 7. Motion & Interaction

- Spring/eased entrance, not linear. One perpetual micro-loop maximum in the
  hero (a slow float or a slow ambient shader drift) — anything more competes
  with the headline for attention.
- Staggered reveal for headline lines is expected; avoid mounting the whole
  hero as one flat fade.
- Animate `transform`/`opacity` only.

## 8. Anti-Patterns (Banned)

No emojis. No Inter. No generic serif fonts. No pure `#000000`. No neon outer
glows or oversaturated accent halos. No large gradient-fill headline text. No
custom cursors. No overlapping text/image. No centered hero layout. No 3-
column equal card rows. No stock "Acme"/"Lorem" placeholder content — use
real porteño specificity (barrio names, concrete details) if any copy is
generated. No fake round stats ("99.99% satisfaction"). No AI copywriting
clichés ("Elevate", "Seamless", "Unleash", "Next-Gen"). No "Scroll to
explore" or bouncing chevrons. No broken image links — use `picsum.photos`
placeholders if real photography isn't supplied.
