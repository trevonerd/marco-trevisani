---
name: Marco Trevisani
description: Personal one-page brand site for a lead frontend engineer with a creative lab signal.
colors:
  alien-bg: "oklch(15% 0.024 209)"
  alien-bg-soft: "oklch(23.5% 0.06 248)"
  alien-text: "oklch(98% 0.006 220)"
  alien-muted: "oklch(80% 0.04 230)"
  alien-accent: "oklch(78.4% 0.133 221)"
  alien-accent-strong: "oklch(61% 0.168 250)"
  alien-hot: "oklch(66% 0.245 336)"
  alien-cyan: "oklch(92% 0.045 216)"
  pressed-ink: "oklch(15% 0.024 209)"
  selection-ink: "oklch(15% 0.024 209)"
typography:
  display:
    fontFamily: "Audiowide, DIN Alternate, DIN Condensed, SF Compact, ui-sans-serif, system-ui, sans-serif"
    fontSize: "6.25rem desktop, 5.35rem tablet, 3.18rem mobile, 2.62rem compact"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0"
  headline:
    fontFamily: "Saira, Aptos, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.78rem desktop, 1.45rem tablet, 1.28rem mobile"
    fontWeight: 760
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Saira, Aptos, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.18rem desktop, 1.08rem tablet, 1.04rem mobile"
    fontWeight: 430
    lineHeight: 1.68
    letterSpacing: "0"
  label:
    fontFamily: "Saira, Aptos, Segoe UI, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
rounded:
  md: "8px"
  pill: "999px"
spacing:
  space-2xs: "0.25rem"
  space-xs: "0.5rem"
  space-sm: "clamp(0.75rem, 1.1vw, 1rem)"
  space-md: "clamp(1rem, 1.6vw, 1.5rem)"
  space-lg: "clamp(1.5rem, 2.6vw, 2.5rem)"
  space-xl: "clamp(2rem, 4vw, 3.75rem)"
  chip-y: "0.45rem"
  chip-x: "0.68rem"
  button-y: "0.72rem"
  button-x: "1rem"
  page-y: "clamp(1rem, 2.5vh, 1.75rem)"
  page-x: "clamp(1rem, 3vw, 1.5rem)"
  hero-gap-min: "2rem"
  hero-gap-max: "5.5rem"
  hero-column-gap: "clamp(2rem, 5vw, 5.5rem)"
  surface-padding-min: "1.1rem"
  surface-padding-max: "1.5rem"
  signal-width: "min(100%, 860px)"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.alien-hot}, {colors.alien-accent} 58%, {colors.alien-cyan})"
    textColor: "{colors.pressed-ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.button-y} {spacing.button-x}"
    height: "2.9rem"
  button-ghost:
    backgroundColor: "color-mix(in oklch, {colors.alien-text} 5%, transparent)"
    textColor: "{colors.alien-text}"
    rounded: "{rounded.md}"
    padding: "{spacing.button-y} {spacing.button-x}"
    height: "2.9rem"
  badge:
    backgroundColor: "color-mix(in oklch, {colors.alien-accent} 8%, transparent)"
    textColor: "{colors.alien-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "{spacing.chip-y} {spacing.chip-x}"
  surface:
    backgroundColor: "{colors.alien-bg-soft}"
    textColor: "{colors.alien-text}"
    rounded: "{rounded.md}"
  social-link:
    backgroundColor: "color-mix(in oklch, {colors.alien-text} 5%, transparent)"
    textColor: "{colors.alien-text}"
    rounded: "{rounded.md}"
    width: "2.75rem"
    height: "2.75rem"
---

# Design System: Marco Trevisani

## 1. Overview

**Creative North Star: "The Electric Workbench"**

This system should feel like a polished personal lab where serious frontend craft is surrounded by signal, music, and motion. The page is a brand surface, not an app shell: the name, portrait, professional claim, and Trevisoft path must read instantly, while the animated details make the visit stick.

The atmosphere is dark because the scene is closer to an after-hours creative workstation than a daylight corporate profile. The palette now comes from the DJ Trevo logo: deep starfield ink, nebula blue, electric cyan, ice-white highlight, and live logo magenta. The improvement is specificity, not reinvention.

**Key Characteristics:**

- Personal first: name, role, portrait, and links are the product.
- Technical but lively: interactions should demonstrate frontend taste.
- Compact by design: one page, quick scan, no bloated resume maze.
- Lab energy: Trevisoft, audio, and social links support the lead-engineer story.

## 2. Colors

The palette is a controlled synthwave system sampled from the DJ Trevo logo, then corrected for legibility. Deep starfield ink grounds the page, nebula blue gives the surface depth, cyan carries technical clarity, ice-white restores contrast, and live logo magenta carries personality and audio energy.

### Primary

- **Electric Cyan** (`alien-accent`): The main blue accent, including the `Trevisani` wordmark, primary action energy, focus color, link emphasis, hover confirmation, and atmospheric star signal.
- **Ice Highlight** (`alien-cyan`): Bright logo-face highlight, star cores, reflective type echo, and sharp focus moments. Use it as a glint or mix-in, not as the main identity color.
- **Live Logo Magenta** (`alien-hot`): Personality, hero-name force, active audio states, and charged shadows. It stays vivid and synthwave, but should be used with intent rather than sprayed across every surface.

### Secondary

- **Enamel Blue** (`alien-accent-strong`): Secondary depth color from the logo shadows. Use it inside atmospheric washes and dimensional states, not as a new CTA color.
### Neutral

- **Deep Starfield Ink** (`alien-bg`): Main page background, viewport chrome, and atmospheric depth.
- **Nebula Surface** (`alien-bg-soft`): Surface fill for portrait panels, signal blocks, and dark UI controls.
- **Near-White Text** (`alien-text`): Primary text on dark surfaces. It should read white, with only a slight cool tint.
- **Muted Blue Text** (`alien-muted`): Secondary copy, badges, and supporting metadata. Keep it lighter than the old cyan wash so hierarchy remains visible.
- **Pressed Ink** (`pressed-ink`): Text on saturated action fills.

### Named Rules

**The Signal Budget Rule.** Cyan can carry atmosphere and interaction. Raspberry must point at identity, audio, active states, or primary action. Decorative glow without information is prohibited.

**The No Generic Neon Rule.** Do not add purple-blue gradients by category reflex. Every saturated moment must be traceable to Marco, DJ Trevo, Trevisoft, audio, social presence, or product craft.

## 3. Typography

**Display Font:** Audiowide with DIN and compact system fallbacks.
**Body Font:** Saira with Aptos, Segoe UI, and system fallbacks.
**Label/Mono Font:** Saira, no separate monospace role currently exists.

**Character:** The display voice is arcade-synthetic and unmistakably personal. The body voice is squared, technical, and clean enough for product credibility without falling back to default startup UI typography.

### Hierarchy

- **Display** (400, `6.25rem` desktop, 0.9): Hero name only, with breakpoint-specific sizes to preserve the surname on narrow screens.
- **Headline** (760, `1.78rem`, 1.3): Short professional promise under the name.
- **Title** (700 to 760, `1rem` to `1.38rem`, 1.3): Component labels, role lines, and signal block statements.
- **Body** (430, `1.18rem`, 1.68): Summary copy and supporting explanations. Keep long prose under 65 characters per line.
- **Label** (650 to 700, `0.78rem` to `0.93rem`, 0 letter spacing): Badges, eyebrows, CTA text, and compact metadata.

### Named Rules

**The One Display Voice Rule.** Audiowide belongs to the hero identity. Do not spread it across routine UI labels or body copy.

**The Working Sans Rule.** Saira carries all readable text. It should feel like a technical workshop label, not a default SaaS paragraph.

**The Natural Case Rule.** Eyebrows and signal labels keep their written case. Do not force long technical labels into all caps.

## 4. Layout Rhythm

The layout is a strict electric workbench, not a centered stack. Marco's identity copy owns the left rail, the portrait acts as the right-side counterweight, and the Trevisoft signal docks lower right on desktop so it reads as a connected lab module rather than a footer strip.

### Structure

- **Hero Grid:** Two-column composition with a wider identity column and a compact portrait column. The column gap should breathe with the viewport using `clamp(2rem, 5vw, 5.5rem)`.
- **Content Flow:** The name, promise, summary, badges, actions, and metadata use tighter spacing inside related groups and larger jumps between groups.
- **Highlight Chips:** Keep the chip cluster intentionally balanced. A `600px` max width creates a stronger 3+2 rhythm on desktop instead of one orphaned final badge.
- **Signal Dock:** On desktop, the signal panel should max at `860px` and align to the right. On narrow screens, it returns to full width below the portrait.
- **Mobile Display Fit:** The hero name must remain large, but the surname cannot clip at narrow widths. Prefer reducing the mobile display clamp before allowing horizontal overflow.

### Named Rules

**The Docked Signal Rule.** Trevisoft is secondary but memorable. It should peek into the first viewport as a deliberate lower-right signal, not sprawl across the full page like a footer.

## 5. Elevation

Depth is hybrid: tonal layering establishes the structure, then glow and shadow respond to state. The default surface shadow is broad and ambient (`0 24px 80px oklch(7% 0.018 218 / 46%)`), while hover states add restrained cyan, enamel blue, and plasma magenta light instead of heavy card stacking.

### Shadow Vocabulary

- **Ambient Stage** (`0 24px 80px oklch(7% 0.018 218 / 46%)`): Main surface depth for portrait and signal panels.
- **Portrait Glow** (`0 18px 70px oklch(78.4% 0.133 221 / 16%), 0 0 42px oklch(66% 0.245 336 / 12%)`): Hover state for the portrait panel.
- **Audio Beacon** (`0 0 26px oklch(66% 0.245 336 / 24%), 0 0 42px oklch(78.4% 0.133 221 / 14%)`): Playing audio control state.

### Named Rules

**The Glow Means State Rule.** Glows should communicate hover, focus, active audio, or a timed signal. Static glow everywhere makes the page feel cheaper.

**The Wordmark Surge Rule.** The hero name should sit still most of the time. A rare signal surge can build and release over a few seconds, but continuous shimmer, drifting, or random glitch effects make the identity feel amateur.

## 6. Components

### Buttons

- **Shape:** Compact rounded rectangle (8px radius), never pill-shaped for primary actions.
- **Primary:** Magenta-to-cyan saturated fill with dark pressed-ink text, strong weight, and minimum height of 2.9rem.
- **Hover / Focus:** Hover lifts by 2px. Focus uses a thick cyan ring with visible offset.
- **Ghost:** Translucent white fill, thin alien-line border, and white text. Use for secondary exits such as LinkedIn or Visit Lab.

### Chips

- **Style:** Rounded pill tags with translucent white fill, thin line, muted lavender text, and compact padding.
- **State:** Informational only. Do not make them look clickable unless they actually filter or navigate.

### Cards / Containers

- **Corner Style:** 8px radius, matching the button system.
- **Background:** Nebula surface over deep starfield ink, often with low-alpha cyan, enamel blue, and rare magenta atmospheric layers.
- **Shadow Strategy:** Ambient Stage at rest, additive glow on meaningful state.
- **Border:** One-pixel soft line from primary text mixed to 14 percent opacity.
- **Internal Padding:** Responsive surface padding between 1.1rem and 1.5rem.

### Inputs / Fields

No conventional form inputs exist in the current site. Future fields should inherit the ghost-button surface language: violet or translucent fill, 8px radius, clear cyan focus ring, and explicit error states rather than hidden color-only cues.

### Navigation

Navigation is expressed as social icon links and two primary routes, Trevisoft and LinkedIn. Icons sit in equal 2.75rem square controls with accessible labels, visible hover, and title text. Do not add a full nav bar unless the site grows beyond a one-page identity surface.

### Signature Component

The portrait stage is the signature component. It combines the cartoon portrait, role label, tilt interaction, audio control, and social graph into one identity object. Preserve its sense of dimensional play, but respect reduced-motion preferences and small-screen framing.

The Trevisoft signal is the secondary signature component. On desktop it should feel docked to the portrait side of the workbench; on mobile it should become a full-width continuation below the identity stack.

## 7. Do's and Don'ts

### Do:

- **Do** keep the first viewport centered on Marco's name, role, portrait, and primary next steps.
- **Do** let motion demonstrate craft: pointer tilt, scanning lines, audio state, and subtle particles are valid when they preserve legibility.
- **Do** keep focus states thick, visible, and cyan-forward.
- **Do** use the current 8px radius for buttons, surfaces, and icon controls unless a component is explicitly a chip or circular control.
- **Do** connect Trevisoft to the lead-engineer story rather than treating it as an unrelated promotion.
- **Do** preserve the asymmetric desktop rhythm: identity left, portrait right, Trevisoft signal docked lower right.

### Don't:

- **Don't** drift into a generic corporate portfolio.
- **Don't** use the bland SaaS hero-metric template.
- **Don't** imitate an overproduced neon or crypto aesthetic.
- **Don't** make the page a static resume page that hides the human signal.
- **Don't** add dense navigation or content that makes visitors hunt for the primary contact path.
- **Don't** use side-stripe borders, decorative glassmorphism, or gradient-clipped text in UI work.
