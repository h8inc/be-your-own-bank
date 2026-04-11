# Sovereign Stack

A high-conviction fintech theme for self-custodial Bitcoin products. Built for the user who trusts math over institutions — someone who holds their own keys but still expects the UX polish of Revolut, Cleo, or Monzo. The visual language communicates: this is serious infrastructure that happens to feel effortless.

## Design Philosophy

The tension this theme resolves: Bitcoin culture leans cypherpunk and raw (terminal green, monospace everything, matte black). Mainstream fintech leans friendly and bright (soft gradients, rounded shapes, playful illustrations). Sovereign Stack sits precisely at the intersection — it borrows the **information density and precision** of Bitcoin culture with the **spatial confidence and typographic clarity** of best-in-class fintech. It never talks down to the user, but it never makes them work to parse a number.

Key principles:
- **Dark but warm.** Not the cold blue-black of generic dark modes. The background has a faint warm undertone — closer to obsidian than to navy.
- **Single accent, used with restraint.** The amber-orange is BTC's colour, but it's used only for interactive elements and key data points. Never as a background. Never as decoration.
- **Numbers are sacred.** Every monetary value, every percentage, every BTC amount is set in a monospace typeface at a size that commands attention. The user's wealth is the hero of every screen.
- **Flat surfaces, sharp edges.** No drop shadows. No gradients on cards. Borders are 1px and structural, not decorative. Rounded corners are tight (4-6px) — utility, not friendliness.
- **Left-aligned, top-down hierarchy.** No centered hero blocks. Information flows like a financial statement: label on the left, value on the right, top to bottom. Dense but breathable.

## Color Palette

- **Obsidian**: `#0C0C0E` — Primary background. Near-black with warm undertone.
- **Graphite**: `#141416` — Card/surface background. Just enough lift to separate from bg.
- **Ash**: `#1C1C1F` — Raised surfaces, hover states, active selections.
- **Wire**: `#2A2A2D` — Primary borders. Structural, not decorative.
- **Wire Subtle**: `#1E1E21` — Row dividers, secondary borders.
- **Amber**: `#E8890C` — Primary accent. Warm BTC orange, slightly desaturated from pure #F7931A to avoid looking like a crypto exchange ad. Used for: CTAs, active tab indicators, key values, interactive elements.
- **Amber Muted**: `#E8890C18` — Accent backgrounds (10% opacity). Selected states, badges.
- **Signal Green**: `#4ADE80` — Positive states: confirmed, secure, profit, active.
- **Signal Green Muted**: `#4ADE8012` — Positive backgrounds.
- **Signal Red**: `#F87171` — Negative states: warnings, deadlines, losses.
- **Signal Red Muted**: `#F8717112` — Negative backgrounds.
- **Signal Blue**: `#60A5FA` — Informational: network status, neutral badges, links.
- **Signal Blue Muted**: `#60A5FA12` — Informational backgrounds.
- **Bone**: `#E8E6E1` — Primary text. Warm off-white. Never pure #FFFFFF.
- **Stone**: `#9B9A95` — Secondary text. Labels, descriptions, timestamps.
- **Slate**: `#6B6A66` — Tertiary text. Micro-labels, disabled states, hints.

## Typography

- **Display / Headlines**: SF Pro Display (fallback: -apple-system, BlinkMacSystemFont, system-ui). Weight 300-500. Used for screen titles, section names, marketing-adjacent copy on onboarding screens.
- **UI / Labels**: Inter or system sans-serif. Weight 500-600. ALL CAPS at 9-10px with 0.06-0.1em letter-spacing for micro-labels. Sentence case at 12-13px for body text and descriptions.
- **Numbers / Data**: JetBrains Mono or SF Mono (fallback: Fira Code, Consolas). Weight 500-600. Used for ALL monetary values, percentages, BTC amounts, dates, addresses. This is non-negotiable — numbers in a sans-serif font look amateur in fintech.
- **Size scale**: 9px (micro-labels) → 10px (badges/tertiary) → 11px (descriptions) → 12px (body/rows) → 13-14px (secondary values) → 18px (card values) → 32px (hero numbers).

## Component Language

- **Cards**: Flat `#141416` background. 1px `#2A2A2D` border. 6-8px border-radius. No shadows. No gradients. 16px internal padding.
- **Buttons (primary)**: Solid amber fill, dark text, 6px radius, 600 weight. No border.
- **Buttons (secondary)**: Transparent, 1px border, amber or stone text. No fill.
- **Buttons (danger)**: Transparent, faint red border + red muted bg, red text.
- **Rows**: Label left (stone), value right (bone or accent, mono). Separated by 1px wire-subtle border-bottom. 6px vertical padding.
- **Badges**: 9px uppercase, 600 weight, colour + 18% opacity background. 3px radius. Compact (2px 7px padding).
- **Sliders**: Native range input, accent-color set to contextual colour. Height: 2px track.
- **Navigation**: Bottom tab bar. Icons are geometric unicode glyphs (◇ ⬡ ▭ ⋯), not emoji. Active = amber, inactive = slate at 60% opacity.

## Spacing

- Screen padding: 24px horizontal.
- Between cards: 12px.
- Between sections: 16-20px.
- Label to content: 6-8px.
- Row vertical padding: 6px.

## Best Used For

Self-custodial Bitcoin products, Liquid/Lightning fintech apps, DeFi interfaces for bitcoiners, hardware wallet companion apps, BTC-backed lending platforms, sovereign wealth tools. Any product that needs to signal: "built by people who understand Bitcoin, designed by people who understand UX."
