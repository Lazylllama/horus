---
name: Horus Dashboard
description: A flat, sharp-cornered instrument panel for reading Hack Club's support surface at a glance.
colors:
  primary: "oklch(0.596 0.145 163.225)"
  primary-foreground: "oklch(0.979 0.021 166.113)"
  waiting: "oklch(0.577 0.245 27.325)"
  caution: "oklch(0.75 0.183 55.934)"
  restricted: "oklch(0.6 0.14 56.78)"
  restricted-foreground: "oklch(0.979 0.021 56.78)"
  paper: "oklch(0.995 0.006 165)"
  surface: "oklch(1 0 0)"
  surface-selected: "oklch(0.72 0.14 165 / 0.16)"
  ink: "oklch(0.148 0.004 228.8)"
  ink-muted: "oklch(0.56 0.021 213.5)"
  hairline: "oklch(0.925 0.005 214.3)"
  ring: "oklch(0.723 0.014 214.4)"
  chart-1: "oklch(0.855 0.138 181.071)"
  chart-2: "oklch(0.704 0.14 182.503)"
  chart-3: "oklch(0.6 0.118 184.704)"
  chart-4: "oklch(0.511 0.096 186.391)"
  chart-5: "oklch(0.437 0.078 188.216)"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "2.5rem"
    letterSpacing: "normal"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1.625"
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.1em"
  numeral:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.75rem"
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "normal"
rounded:
  none: "0"
  full: "9999px"
spacing:
  card: "1rem"
  card-sm: "0.75rem"
  grid-gap: "1rem"
  page-x: "2.5rem"
  page-top: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.none}"
    padding: "0 0.625rem"
    height: "2rem"
  button-primary-hover:
    backgroundColor: "oklch(0.596 0.145 163.225 / 0.8)"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 0.625rem"
    height: "2rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem"
  badge-waiting:
    backgroundColor: "oklch(0.577 0.245 27.325 / 0.1)"
    textColor: "{colors.waiting}"
    rounded: "{rounded.none}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  badge-progress:
    backgroundColor: "oklch(0.75 0.183 55.934 / 0.1)"
    textColor: "{colors.caution}"
    rounded: "{rounded.none}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  badge-resolved:
    backgroundColor: "oklch(0.596 0.145 163.225 / 0.1)"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.625rem"
    height: "2rem"
  avatar:
    rounded: "{rounded.full}"
    size: "2rem"
---

# Design System: Horus Dashboard

## Overview

**Creative North Star: "The Observatory"**

Horus is an instrument, not an application. Its job is to let one watcher take in a whole sky at once and know immediately where to point. The interface is accordingly built out of flat, sharp-cornered panels separated by hairlines — readouts on a bench, not cards floating in space. Nothing lifts, nothing glows, nothing rounds itself off to seem friendlier. Density is a feature: the default component text size is 12px and the default control height is 32px, because a helper mid-shift is scanning, not reading.

The one romantic gesture is the type. Page titles and panel titles are set in Lora, a serif — an unusual choice for an operations tool, and the thing that keeps this system from reading as a terminal emulator. That tension is the whole personality: a scholar's hand labelling precise instruments. The serif appears only as a label on a panel; the moment you are inside the panel, everything is Space Grotesk and the numbers take over.

Color is almost entirely spoken for. Emerald, orange and red are not a palette here, they are a vocabulary for ticket state, used identically in a badge, a bar chart, a relative timestamp and a count on the directory. Because those three carry meaning everywhere, the surface underneath them stays quiet — and even the quiet is tinted, every neutral in both themes carrying a faint green hue shift so that white is never quite white and black is never quite black.

**Key Characteristics:**
- Zero corner radius on every surface; circular avatars are the only curve in the system
- No box-shadows anywhere — depth is a hairline ring plus a tonal step
- Dense by default: 12px component text, 32px control height, 16px panel padding
- Serif (Lora) for titles only; sans (Space Grotesk) for everything else
- Semantic color triad — emerald / orange / red — reserved for ticket state
- Neutrals are hue-shifted toward green (hue 165) in both light and dark
- Semantic color arrives as a 10% tinted wash behind its own hue as text, not as a solid fill

## Colors

A near-monochrome green-tinted ground, held down hard so that a three-color state vocabulary can carry all the meaning.

### Primary
- **Signal Emerald** (`oklch(0.596 0.145 163.225)` light / `oklch(0.696 0.17 162.48)` dark): The brand color and the "resolved / healthy / good" end of the state vocabulary. Fills primary buttons solid, tints resolved badges, colors the leaderboard bars, marks the active nav tab, and colors recent timestamps. `--accent` is defined as an identical value — this system has one accent, deliberately.

### Secondary
- **Waiting Red** (`oklch(0.577 0.245 27.325)` light / `oklch(0.704 0.191 22.216)` dark): Not a generic error color. It means a ticket is waiting or overdue — an unanswered queue item, a timestamp older than a week, a queue past 50 items, the `OPEN` slice of the status chart. It also carries the beta banner. Genuine destructive actions borrow it, but its primary job here is temporal pressure.
- **Caution Orange** (`oklch(0.75 0.183 55.934)`, Tailwind `orange-400`): The middle state — in progress, claimed but unresolved, aging but not yet critical. The only significant color in the system that is not a project token; it is referenced directly as `orange-400`.

### Tertiary
- **Restricted Amber** (`oklch(0.6 0.14 56.78)`, identical in both themes): A dedicated token for privilege, not state. It marks super-admin-only territory and active impersonation, and it always arrives as a **dashed** border rather than a fill. Nothing else in the system uses dashed borders, which is what makes it read instantly.

### Neutral
- **Paper** (`oklch(0.995 0.006 165)` light / `oklch(0.155 0.014 165)` dark): The page ground. Note the hue: even at 99.5% lightness it carries green.
- **Surface** (`oklch(1 0 0)` light / `oklch(0.2 0.016 165)` dark): Panel and card fill. In light mode it is pure white against tinted paper — the tonal step *is* the elevation. In dark mode it steps up from the ground instead.
- **Ink** (`oklch(0.148 0.004 228.8)` light / `oklch(0.97 0.006 165)` dark): Body text. The light-mode value shifts cool-blue rather than green — the one place the green tint is not carried.
- **Ink Muted** (`oklch(0.56 0.021 213.5)` light / `oklch(0.723 0.014 214.4)` dark): Secondary text, labels, inactive nav, axis ticks. Carries the majority of the interface's words.
- **Hairline** (`oklch(0.925 0.005 214.3)` light / `oklch(1 0 0 / 10%)` dark): Every border and divider. In dark mode it becomes a translucent white rather than a solid value, so it reads consistently over any surface beneath it.
- **Selected Wash** (`oklch(0.72 0.14 165 / 0.16)`, identical in both themes): Translucent emerald for selected rows and cards.

### Chart Ramp
- **Teal Ladder** (`oklch(0.855 0.138 181.071)` → `oklch(0.437 0.078 188.216)`, five steps, identical in both themes): A cool teal ramp for multi-series data, deliberately adjacent to but distinct from Signal Emerald so that decorative series never get mistaken for state.

### Named Rules

**The Three-State Rule.** Emerald means resolved, orange means in progress, red means waiting or overdue. These three are spoken for across every surface — badge, chart, count, timestamp, bar. Never use any of them decoratively, and never encode a fourth state in a fourth hue without adding it to this vocabulary first.

**The Tinted-Fill Rule.** Semantic color arrives as a 10% wash of itself behind text of the same hue (`background: oklch(... / 0.1); color: oklch(...)`), never as a saturated block. The primary button is the single exception that fills solid — which is precisely what makes it read as the one real action on a screen.

**The Green Ground Rule.** Every neutral in this system carries hue 165. Never introduce a pure-gray or blue-gray neutral; it will read as a foreign element against a surface that is quietly green everywhere else.

## Typography

**Display Font:** Lora (with Georgia, serif)
**Body Font:** Space Grotesk (with ui-sans-serif, system-ui, sans-serif)
**Mono Font:** Geist Mono (with ui-monospace, monospace)

**Character:** A serif that behaves like handwriting on a label, paired with a geometric sans that behaves like a readout. Lora supplies warmth exactly twice per screen — the page title and each panel title — and Space Grotesk does all the actual work at small sizes, where its open apertures and slightly technical geometry hold up under density.

### Hierarchy
- **Display** (Lora, 700, 2.25rem/2.5rem): Page titles only. The greeting on the dashboard, the instance name, "404 🥀". One per page.
- **Title** (Lora, 500, 0.875rem/1.25rem): Panel and dialog titles, set on a bottom-ruled card header. Small, but the serif marks it as a heading without needing size.
- **Body** (Space Grotesk, 400, 0.75rem, line-height 1.625): The system default inside every component. Descriptive prose sits one step up at 0.875rem with `max-width: 36rem`.
- **Label** (Space Grotesk, 500, 0.75rem, letter-spacing 0.1em, uppercase): The breadcrumb eyebrow and small-caps metadata.
- **Numeral** (Space Grotesk, 700, 1.25rem–2.25rem): Standalone figures — queue counts, ticket age in days, the total in the donut chart's center. Always paired with a 0.75rem muted caption beneath.
- **Mono** (Geist Mono, 500, 0.75rem, tabular-nums): Currently used in exactly one place — chart tooltip values. It is a loaded, available, and almost entirely unclaimed voice.

### Named Rules

**The Serif Label Rule.** Lora appears only where something is being *named*: page titles and panel titles. It never appears in body copy, never in data, never in a button, never in a table cell.

**The Eyebrow Rule.** Every page opens with `HORUS · [SECTION]` in uppercase emerald at 0.75rem with 0.1em tracking, directly above the display title. It appears exactly once per page and is the system's most recognizable typographic signature.

## Layout

Every page is the same shape: a `max-width: 72rem` column, centered, with `2.5rem` horizontal padding and `2rem` of top padding. Nothing in this system goes full-bleed, and the page ground is visible on both sides at every width above the container. Two full-width horizontal bands break that column — the top navigation bar and the tab strip beneath it — but their contents are constrained to the same 72rem measure, so the alignment holds unbroken from banner to footer.

Content is organized as a widget grid: three columns at `lg`, two at `md`, one below, with a uniform `1rem` gap and `0.5rem` of vertical breathing between grid bands. Panels stretch to fill their track; tall panels state an explicit floor (`min-height: 18rem` for summary widgets, `31.25rem` for queue tables) so a loading skeleton occupies exactly the space its content will.

Inside a panel, spacing is driven by a single custom property, `--card-spacing`, set to `1rem` by default and `0.75rem` in compact mode. Header padding, content padding and the gap between sections all derive from it, so a panel's internal rhythm changes from one declaration.

Below 720px the system does not merely reflow — it *drops columns*. The queue table removes its ID and Status columns entirely at that width rather than compressing them, and the navbar's user identity block collapses to an avatar alone. `scrollbar-gutter: stable` is set globally so no layout shifts when a scrollbar appears.

### Named Rules

**The 72rem Rule.** Every page is a centered 72rem column with 2.5rem gutters. Full-bleed content does not exist in this system; a band that spans the viewport still aligns its contents to the column.

**The Drop-Don't-Squeeze Rule.** At narrow widths, remove columns rather than shrinking them. A table with four legible columns beats a table with six illegible ones.

## Elevation & Depth

**This system has no shadows.** Not a subtle one, not a large one — there is no `box-shadow` in the design language at all. Depth is produced by exactly two devices: a hairline `ring-1` at 10% foreground opacity drawn around every panel, and a tonal step between the page ground and the panel fill. In light mode that step is tinted paper against pure white; in dark mode it inverts to a lifted surface against a near-black ground. Because the ring is drawn in *foreground* color at low alpha rather than a fixed border color, it adapts automatically across both themes without a second definition.

The result is a system that reads as etched rather than stacked — panels sit *in* the page rather than *above* it. The only genuine z-axis event is a modal, and even there the elevation is carried by a 10% black backdrop with a `4px` backdrop blur, not by a shadow on the dialog itself.

### Depth Vocabulary
- **Panel ring** (`box-shadow: 0 0 0 1px oklch(from var(--foreground) l c h / 0.1)` via `ring-1 ring-foreground/10`): Every card, panel and dialog. The universal container edge.
- **Divider** (`border-bottom: 1px solid var(--border)`): Separates a panel header from its content, and rows within a table. Structural, never decorative.
- **Modal scrim** (`background: rgb(0 0 0 / 0.1)` + `backdrop-filter: blur(4px)`): The one moment of true layering.

### Named Rules

**The No-Shadow Rule.** Never add a `box-shadow` to this system. If an element needs to separate from its surroundings, it gets a hairline ring or a tonal step. A shadow anywhere would be the loudest thing on the screen.

## Shapes

The corner radius of this system is zero. Buttons, cards, badges, inputs, dialogs, skeletons, table containers and popovers are all explicitly `rounded-none`. A `--radius: 0.625rem` token and a full `--radius-sm` through `--radius-4xl` scale are defined in the theme and computed from it, but the component layer overrides every one of them — the scale is inherited configuration, not the system's form language.

The single deliberate curve is the avatar, which is fully circular. Because it is the only radius in the entire interface, it does real work: a round shape in this system means *a person*. Avatars appear in the navbar, in leaderboard rows, in the assignee filter and in table cells, and in every case the circle is what separates a human from a datum.

Borders are uniformly one pixel and uniformly hairline-colored. The one exception is the restricted marker — a **dashed** border in Restricted Amber, at 3px on the admin nav tab and the impersonation banner. Dashed edges occur nowhere else, which is why they read as "you are somewhere unusual" without a word of explanation.

### Named Rules

**The Sharp Corner Rule.** Everything is `rounded-none`. The radius tokens in the theme are inherited scaffolding and are not to be used. The avatar's circle is the only curve, and it means a person.

**The Dashed Border Rule.** A dashed edge means restricted or elevated privilege, always in Restricted Amber, and never anything else.

## Components

### Buttons
- **Shape:** Square (0 radius), 1px transparent border reserved so that focus and variant borders don't shift layout.
- **Sizing:** Dense and stepped — `xs` 24px, `sm` 28px, default 32px, `lg` 36px, `xl` 44px, with matching square icon-only variants. Body text at 0.75rem, medium weight, `white-space: nowrap`.
- **Primary:** Solid Signal Emerald with light foreground; hover drops to 80% opacity. The only solid-filled semantic surface in the system.
- **Outline:** Hairline border on page ground; hover fills muted. In dark mode it shifts to a translucent input fill (`--input` at 30%) rather than the ground color.
- **Ghost / Link / Secondary:** No border at rest; ghost fills muted on hover, link is emerald with an underline on hover only.
- **Destructive:** Follows the tinted-fill pattern — 10% red wash with red text, deepening to 20% on hover. It never fills solid, even for destructive actions.
- **Press:** `active:translate-y-px` — a real 1px downward nudge, suppressed on menu triggers so popovers don't jump.
- **Focus:** `border-color: var(--ring)` plus a 1px ring at 50% opacity. Never a thick glow.
- **Icons:** 16px at default size, auto-scaling to 12px at `xs`/`sm`, pointer-events disabled.

### Cards / Panels
- **Corner:** Square. **Border:** none — a `ring-1` at 10% foreground instead.
- **Background:** Surface. **Overflow:** hidden, so a first-child image bleeds edge to edge with the panel's own corners.
- **Header:** Bottom-ruled, set in Lora at 0.875rem/500, padded by `--card-spacing`. A `CardAction` slot right-aligns into the header grid automatically.
- **Padding:** `--card-spacing` (1rem default, 0.75rem compact) governs vertical gap, header padding and content padding together.
- **Footer:** Top-ruled and flush to the panel's bottom edge — the card removes its own bottom padding when a footer is present.

### Badges
- **Shape:** Square, 20px tall, 0.75rem medium text, 8px horizontal padding, 12px icons.
- **State variants:** `default` (emerald wash), `orange` (caution wash), `destructive` (waiting wash) — each a 10% tint of its hue with matching text, stepping to 20% in dark mode. These three carry ticket status everywhere.
- **Structural variants:** `outline` (hairline border, plain text) and `secondary` for non-semantic counts.

### Inputs
- **Style:** Transparent fill, hairline border, square, 32px tall, 0.75rem text. Dark mode gives it a 30% translucent input fill so it separates from the panel.
- **Focus:** Border shifts to ring color plus a 1px 50%-opacity ring — the same treatment as buttons, so focus reads identically across control types.
- **Invalid:** Destructive border with a 20% destructive ring. **Disabled:** Filled at 50%, 50% opacity, pointer events off.

### Navigation
- **Structure:** Two stacked full-width bands over the beta banner. The upper band carries the wordmark and the account cluster; the lower is a tab strip.
- **Tabs:** 0.75rem muted text, 12px padding, with a 3px transparent bottom border held in reserve. The active tab turns its border solid emerald and its text to full foreground — the border is always present, only its color changes, so nothing shifts on selection.
- **Restricted tab:** Permanently marked with a 3px dashed Restricted Amber bottom border.
- **Mobile:** The identity block hides below `md`, leaving the avatar alone.

### Data Grid (signature)
The queue tables are LyteNyte grids wrapped in a panel, styled to disappear into the system: alternating row backgrounds are explicitly disabled (`--ln-bg-row-alternate: transparent`), so the grid reads as continuous ruled rows rather than a striped spreadsheet. Cells render live components rather than text — avatars for people, tinted badges for status, and relative timestamps that recolor themselves by age (emerald under 2 days, caution under a week, waiting beyond, with a warning glyph appearing at the threshold).

### Stat Triad (signature)
The directory card's footer: three stacked figure-and-caption pairs in a row — count at 1.25rem/700 in its state color, caption at 0.75rem uppercase muted beneath. Open in Waiting Red, In Progress in Caution Orange, Resolved in Signal Emerald, always in that order. This is the Three-State Rule at its most literal, and it is the densest expression of the product's whole premise.

### Animated Icons (signature)
Three icons — sun, moon, cog — are Motion-driven components that animate on interaction rather than static glyphs. This is the entire motion vocabulary of the system, alongside CSS transitions on color and a 300ms chevron nudge on card hover. There is no page-transition choreography, and no entrance animation on content.

## Do's and Don'ts

### Do:
- **Do** wrap every container in `ring-1 ring-foreground/10` rather than a border. It adapts across themes from one declaration.
- **Do** reserve emerald, orange and red for ticket state, in that meaning, on every surface.
- **Do** deliver semantic color as a 10% tint with matching text (`bg-destructive/10 text-destructive`). Only the primary button fills solid.
- **Do** open every page with the `HORUS · [SECTION]` eyebrow above a Lora display title.
- **Do** drive panel spacing from `--card-spacing` instead of hardcoding padding.
- **Do** give loading skeletons the exact dimensions of the content they replace — the existing `min-h-72` and `h-125` floors exist for this reason.
- **Do** pair every standalone numeral with a 0.75rem uppercase muted caption.
- **Do** mark privileged surfaces with a dashed Restricted Amber border, never with a fill or a color swap.

### Don't:
- **Don't** add a `box-shadow`. This system has none, and one would dominate everything around it.
- **Don't** add corner radius. Everything is `rounded-none`; the `--radius` scale in the theme is inherited scaffolding, not permission. Two existing strays — the instance-card skeleton's `rounded-md` and the deprecated badge's `rounded-bl-md` — are drift, not precedent.
- **Don't** use gradients, glassmorphism, blurred floating orbs, or oversized soft corners. *(Confirmed anti-reference: the generic AI-era SaaS look.)*
- **Don't** introduce a pure-gray neutral. Every neutral here carries hue 165.
- **Don't** set Lora on anything that isn't a page title or a panel title.
- **Don't** use the class `text-md`. It is undefined in both Tailwind and this project's theme, so it silently does nothing — yet it appears 13 times across the app. Use `text-sm` or `text-base` and correct the strays when you touch them.
- **Don't** use a dashed border for anything other than restricted privilege.
- **Don't** compress table columns below 720px — remove them, as the queue table already does.
- **Don't** treat the teal chart ramp as an accent. It exists so decorative series can never be confused with the state triad.
