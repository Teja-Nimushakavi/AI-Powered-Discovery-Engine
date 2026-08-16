---
name: Lumina Discovery Engine
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e3bdc0'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#ab888b'
  outline-variant: '#5b4042'
  surface-tint: '#ffb2ba'
  primary: '#ffb2ba'
  on-primary: '#670021'
  primary-container: '#ff4f74'
  on-primary-container: '#5a001c'
  inverse-primary: '#bd0043'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2ba'
  on-primary-fixed: '#400011'
  on-primary-fixed-variant: '#910031'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  emerald-accent: '#10b981'
  gold-accent: '#fbbf24'
  blue-accent: '#60a5fa'
  glass-bg: rgba(30, 41, 59, 0.7)
typography:
  display-metric:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  container-max: 1440px
---

## Brand & Style
The brand personality is authoritative, analytical, and futuristic—designed specifically for internal strategic product management. It evokes a sense of "AI-driven precision" through a sophisticated blend of **Glassmorphism** and **Corporate Modern** aesthetics. 

The UI uses deep space-blue foundations paired with vibrant neon accents to highlight key insights. The emotional response is one of clarity amidst complexity, providing users with a high-fidelity "command center" feel. Visual depth is achieved through translucent layers, subtle blurs, and soft glows rather than traditional heavy shadows.

## Colors
The palette is rooted in a deep "Midnight Navy" dark mode. 
- **Primary (#ff3f6c):** A vibrant magenta-pink used for high-priority actions, branding elements, and critical friction indicators.
- **Accents:** A triad of semantic colors—**Emerald** (Success/Wishlist), **Gold** (Opportunities/Warnings), and **Blue** (Data/Conversations)—are used to categorize insights.
- **Glass Surfaces:** Utilizes a semi-transparent `rgba(30, 41, 59, 0.7)` with backdrop filtering to maintain legibility over complex backgrounds.
- **Contrast:** High-contrast text (`#dae2fd`) ensures readability against the dark surfaces, while muted variants (`#e3bdc0`) are reserved for metadata and labels.

## Typography
The system uses a dual-font strategy. **Outfit** is the display face, chosen for its geometric clarity and modern tech feel, making it ideal for metrics and section headers. **Inter** is the functional workhorse, used for all body copy, data descriptions, and UI labels to ensure maximum legibility at small scales.

For mobile, `display-metric` should scale down to 36px, and `headline-lg` should shift to a `headline-lg-mobile` size of 24px to maintain hierarchy without overwhelming the viewport.

## Layout & Spacing
The system follows a **Fixed Grid** philosophy within a `1440px` max-width container, centering itself on desktop screens to maintain focus. 

- **Grid:** A standard 12-column logic is implied for content, with a consistent `20px` gutter.
- **Hierarchy:** Executive summaries and metric banners span the full container width to establish the "big picture." Detailed insights are organized into a two-column layout (approx. 1/3 to 2/3 ratio) to balance high-level navigation (Priority Matrix) with granular data (Opportunity Cards).
- **Responsive Behavior:** On tablet, columns stack vertically. On mobile, horizontal padding reduces from `32px` to `16px`.

## Elevation & Depth
Depth is created through "Luminous Layering" rather than traditional shadows:
- **Level 1 (Base):** A fixed linear gradient background (`#0f172a` to `#020617`).
- **Level 2 (Panels):** Translucent `glass-panel` containers with a `12px` backdrop blur and a thin `1px` border (`#334155`).
- **Level 3 (Interactive):** Hover states utilize `surface-container-high` backgrounds and subtle primary-tinted glows (`glow-primary`).
- **Indicators:** Critical data points use "glow" effects (e.g., `box-shadow: 0 0 20px rgba(255, 63, 108, 0.15)`) to pull the eye toward significant insights.

## Shapes
The shape language is modern and approachable with a significant "Rounded" preference.
- **Containers:** Main panels and cards use a `0.75rem` (12px) radius.
- **Buttons & Chips:** Primary interactive elements and status badges use "Full" rounding (Pill-shaped) to distinguish them from structural containers.
- **Icons:** Enclosed in `8px` or `rounded-lg` containers to create a consistent "App Icon" visual style.

## Components
- **Buttons:** Use pill-shapes. The "Auto-Generate" button is the primary action, featuring a subtle border and shadow. Secondary buttons use ghost styling with `on-surface-variant` text.
- **Metric Cards:** Large display numbers in `Outfit` bold. Features a colored blur effect in the top-right corner and a decorative SVG sparkline at the bottom for visual interest.
- **Opportunity Cards:** Large containers with a 2px left-accent border colored by priority tier (Primary, Gold, or Blue). Internal content is divided into a 3-column grid for "Surface Observation," "Underlying Barrier," and "Unmet Need."
- **Badges/Chips:** Used for versioning ("AI Discovery Agent v1.0") and priority tiers. They feature low-opacity background tints and high-contrast uppercase labels.
- **Priority Matrix:** A specialized interactive component using absolute positioning on a grid. Nodes should be size-coded based on impact and color-coded by category.