---
name: Cafetería
description: Landing de una cafetería porteña de especialidad — negro mate, un rojo, tipografía de cartel.
colors:
  ink: "#f5f2ee"
  ink-soft: "#a8a29b"
  ink-faint: "#6b6660"
  void: "#0b0b0c"
  surface: "#131316"
  surface-2: "#1b1b1f"
  hairline: "#26262b"
  accent: "#cc2a26"
  accent-soft: "#ff5b52"
  accent-deep: "#99201d"
  espresso: "#1d1209"
  tueste: "#8c4b21"
  crema: "#c8813c"
typography:
  display:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.01em"
  hero-display:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(3.6rem, 17vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Outfit Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Outfit Variable, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  card: "20px"
  pill: "9999px"
spacing:
  section-y: "7rem"
  section-y-lg: "9rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-2}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-active:
    backgroundColor: "{colors.surface-2}"
---

# Design System: Cafetería

## Overview

**Creative North Star: "The After-Dark Roastery"**

A specialty-coffee counter at closing time: matte black room, one neon-red
sign doing all the talking, and a warm halogen halo around the espresso
machine where the real color lives. Everything else in the room stays out of
that light — text is porcelain and ash, surfaces are graphite, and the only
saturated color left is the sign itself.

The page is built to be mistaken for a real business's site, so the aesthetic
philosophy is confidence over decoration: one dominant accent used sparingly,
a cartel-style display face for anything that needs to shout, warm unretouched
photography for anything that needs to prove the coffee is real, and a grain
overlay that reads as light through steam rather than as a filter. Nothing
about the system announces "template" — every rule below exists because a
specific measured problem (a contrast ratio, a line-height collision, a
sticky-scroll edge case) forced it, not because it looked nice in isolation.

Confirmed rejection: no inverted/light sections anywhere in the scroll. The
black is total; a white section would break the room.

**Key Characteristics:**
- Matte black stage, single red sign, warm photography as the only other color
- Cartel/menu-board display type (Anton) against a quiet grotesque body face
- Flat by default — depth comes from tonal layering and hairlines, not shadows
- Two shapes only: pill for anything you can press, 20px card radius for
  anything you look at
- Porteño specificity in every string of copy, never generic café language

## Colors

Restrained on purpose: one accent, used at roughly the same rarity as a neon
sign in a dark room — everywhere it appears, it means "act here."

### Primary
- **Sign Red** (`#cc2a26`, `--color-accent`): the fill of every primary
  button. White text on it measures 4.8:1 (AA). Never used as a large
  background over photography — it collapses under any dimming overlay.
- **Neon Red** (`#ff5b52`, `--color-accent-soft`): the accent's job wherever
  it sits directly on black or over a photo — small text, icons, prices. 6.2:1
  on void, and the one variant proven to survive a darkening veil over a
  photo (measured 3.87:1 against the espresso image's veil vs. the base
  accent's 2.21:1 in the same spot).
- **Char Red** (`#99201d`, `--color-accent-deep`): hover/pressed state for
  filled buttons only. Never a resting color.

### Neutral
- **Warm Porcelain** (`#f5f2ee`, `--color-ink`): headlines and primary text.
- **Ash Taupe** (`#a8a29b`, `--color-ink-soft`): secondary text — captions,
  supporting copy, testimonial bylines. Measured the dimmest gray that still
  clears AA at small body sizes (7.79:1 on void, 6.79:1 on the raised
  surface).
- **Spent Grounds** (`#6b6660`, `--color-ink-faint`): borders, inactive
  icons, decorative type only. Falls short of AA for text (3.46:1 on void,
  3.02:1 on the raised surface) — **The Faint-Is-Not-Text Rule.** Anything
  carrying information belongs in Ash Taupe, never Spent Grounds.
- **Roastery Black** (`#0b0b0c`, `--color-void`): the page floor.
- **Concrete Counter** (`#131316`, `--color-surface`): the first raised
  plane — cards, media frames, the map.
- **Raised Counter** (`#1b1b1f`, `--color-surface-2`): the second raised
  plane — hover states, the active/selected card, the scrolled nav.
- **Steam Line** (`#26262b`, `--color-hairline`): every border in the system.
  Depth is layered void → concrete → raised, edged with steam lines, never
  drawn with a shadow.

### Hero-only accents (do not use in UI)
- **Espresso Shell** (`#1d1209`), **Roast Amber** (`#8c4b21`), **Crema Gold**
  (`#c8813c`): pulled from the hero cup photo, and confined to the hero's
  background shader and the halo glow behind the cup. **The Hero-Only Rule.**
  No control, no body text, no border ever uses these three. They used to
  bleed into the hero background by inheritance from an earlier shader and
  diluted the sign red's meaning everywhere; keeping them hero-only is what
  makes the sign red mean something again.

### Named Rules
**The One Sign Rule.** Sign Red is the only saturated color the interface
ever puts a decision behind — a button, a selected state, a headline's
punchline. If a second saturated hue starts carrying UI meaning, it competes
with the sign and both lose.

## Typography

**Display Font:** Anton (with Arial Narrow, sans-serif fallback)
**Body Font:** Outfit Variable (with system-ui fallback)

**Character:** A menu-board shout paired with a quiet, humanist grotesque —
the same split as a chalkboard special next to a printed price list. Anton
never runs longer than a few words; Outfit carries every sentence.

### Hierarchy
- **Hero display** (400, `clamp(3.6rem, 17vw, 8rem)`, line-height 0.96): the
  headline's second line only — the punchline, always in Sign Red, always
  more than double the size of the line above it.
- **Display** (400, `clamp(2.4rem, 6vw, 4.6rem)`, line-height 0.96): every
  section's `<h2>`, uppercase, tracked tight (-0.01em).
- **Title** (400, `text-xl`–`text-2xl`, line-height 0.95, uppercase): card
  and product headings (menu items, testimonial names, locale names).
- **Body** (400, `text-sm`, line-height 1.6): supporting copy, capped near
  34–42ch measured line length.
- **Label** (600, `text-xs`–`text-[13px]`, letter-spacing 0.08–0.16em,
  uppercase): nav links, bylines, eyebrow text, the pill button label.

### Named Rules
**The Two-Tempo Headline Rule.** Any headline that pairs a setup line with a
punchline sets the punchline at more than double the setup's size, in Sign
Red. A headline that doesn't earn a punchline stays one tempo, one size.

**The 0.96 Rule.** Anton's cap-height overshoots a 0.9 line-box by roughly
0.07em, enough to clip an accented capital into the line above on any
multi-line display headline. 0.96 line-height is the measured floor that
keeps every wrapped display heading legible as one block.

## Layout

Container: `max-w-[1400px]`, `px-5` mobile / `px-10` desktop. Sections run
generous vertical rhythm — `py-28` mobile, `lg:py-36` desktop — separated by
a single hairline top border rather than alternating background color.
Density is airy by default; the one deliberately dense passage is the menu
scroll-stack, which trades vertical rhythm for a pinned horizontal recorrido.
Grids collapse to single-column stacks below `lg` (1024px); the map/locale
layout additionally reflows from a fixed sidebar to a `position: sticky`
header because the sticky behavior needs a shared scroll container with the
list beneath it, not a grid cell of its own.

## Elevation & Depth

Flat by default. Depth is conveyed by tonal layering — void → concrete
counter → raised counter — always edged with a steam-line hairline, never by
a drop shadow. **The Flat-By-Default Rule.** A card sitting at rest never
casts a shadow; the eye reads depth from which of the three tones it sits on.

### Shadow Vocabulary
- **Sheet elevation** (`box-shadow: 0 32px 80px -24px rgba(0,0,0,0.9)`): the
  one deliberate exception, reserved for the demo-explainer sheet (HojaDemo)
  because that surface must read as physically above the page, not just a
  different tone of it.
- **Photo drop** (`drop-shadow(0 54px 70px rgba(0,0,0,0.7))`): the hero cup
  only, to separate the cutout from the shader behind it.

## Shapes

Two shapes, no exceptions. **The Two-Shape Rule.**
- **Pill (`rounded-full`)**: everything interactive — buttons, chips, the
  menu-progress rail, icon-only controls.
- **Card radius (20px, `--radius-card`)**: everything you look at rather than
  press — photo frames, cards, the map, modal sheets.

Nothing in the system uses a third radius. A grain-noise overlay (SVG
turbulence, 5% opacity, fixed) sits above the whole page as the one recurring
texture; photography gets a light `contrast(1.06) saturate(1.02)
brightness(0.94)` treatment instead of desaturation, so food keeps its color.

## Components

### Buttons
- **Shape:** pill (`rounded-full`), always. Labels stay on one line
  (`whitespace-nowrap`) so no CTA wraps.
- **Primary:** Sign Red fill, white text, hover → Char Red. `px-7 py-3.5
  text-sm` at default size; a `sm` size (`px-5 py-2.5 text-[13px]`) exists
  specifically for the 68px nav bar, sized in the component rather than
  overridden by an outside className.
- **Ghost:** hairline border, `bg-void/40` with backdrop blur, hover →
  border lightens to Ash Taupe and fill shifts to Raised Counter.
- **Press feedback:** `active:translate-y-px` on every variant — a 1px sink,
  not a scale change.

### Cards / Containers
- **Corner style:** 20px card radius, always.
- **Background:** Concrete Counter at rest; Raised Counter when
  selected/active, paired with a Sign Red border swap (`border-hairline` →
  `border-accent`) to mark the active state redundantly by both tone and
  border color.
- **Shadow strategy:** none — see Elevation.
- **Border:** hairline at rest on every card.

### Navigation
Fixed header, transparent with a transparent border until scrolled or the
mobile menu opens, then `bg-void/90` with a heavy backdrop blur and a
hairline bottom border. Desktop links are label-weight uppercase text that
brightens from Ash Taupe to Warm Porcelain on hover; the single persistent
action (Reservar) is the only pill button in the bar. Mobile collapses to a
full-bleed panel sharing the header's opaque background, so the header reads
as one continuous surface rather than a bar with a panel hanging off it.

### Demo Sheet (signature component)
The one component that breaks the flat-by-default rule and the one place
copy steps outside the cafetería's voice to speak as the page's actual
author. Bottom sheet on mobile, centered modal on desktop; Concrete Counter
background, card radius, sheet-elevation shadow, `bg-void/85` backdrop blur
behind it. Traps focus and returns it to the trigger on close — it exists to
convert a dead-end tap into the page's real contact moment, so it earns the
one interruption the rest of the system avoids.

## Do's and Don'ts

### Do:
- **Do** keep Sign Red to the same rarity as a real neon sign — buttons, one
  headline punchline per section, selected states. **The One Sign Rule.**
- **Do** use Neon Red (`accent-soft`) instead of the base accent for any red
  text or icon sitting on a photo or on black; it's the variant proven to
  hold contrast under a darkening veil.
- **Do** build depth with the void → concrete → raised tonal stack and a
  hairline border, not a shadow.
- **Do** keep every headline in Anton, uppercase, at 0.96 line-height on
  anything that wraps to more than one line.
- **Do** write copy with named streets and concrete porteño detail; it's the
  difference between this and a generic café template.

### Don't:
- **Don't** let Espresso Shell / Roast Amber / Crema Gold leave the hero
  shader and halo. They're photo-derived atmosphere, not UI color.
- **Don't** put informational text in Spent Grounds (`ink-faint`) — it
  measures below AA for text; use Ash Taupe.
- **Don't** invert a section to a light background. The black is total.
- **Don't** give a resting card a shadow, or give the demo sheet a hairline
  border treatment strong enough to make it read as flat with the page — it
  needs to read as physically above it.
- **Don't** introduce a third corner radius. Interactive is pill, content is
  20px, nothing else.
