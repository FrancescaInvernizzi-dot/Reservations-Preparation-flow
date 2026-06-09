# Mews Design System (MDS)

**Mews is the operating system for hospitality.** A cloud-native platform unifying PMS (property management), POS (point of sale), payments, housekeeping, revenue management, and guest journey into a single connected system. In Feb 2026 Mews unveiled an evolved brand identity reflecting its positioning as hospitality's OS.

The design system is called **MDS (Mews Design System)** — an inner-sourced community platform that powers all Mews surfaces. It consists of working code, design tools and resources, human interface guidelines, and a contributor community.

The system has three component scopes:
- **Core** — shared across all surfaces (buttons, inputs, cards, tags, etc.)
- **B2B** — web back-office (DataGrid, SidePanel, FloatingPanel, SmartTip, etc.)
- **GX (Guest Experience)** — guest-facing surfaces (booking engine, kiosk, check-in)

## Audience

MDS is a **dense, pragmatic B2B system** at its core. Primary user: front-desk agent, housekeeper, revenue manager — someone living inside the tool all day needing information density, fast scanning, and low-friction data entry. Secondary: guest-facing (booking engine, online check-in) where warmth and clarity take priority.

B2B-specific choices:
- **14px base font size** (not 16px). Scale ratio: Major Second (1.125).
- **8px base grid** for spacing, sizing, and radii.
- Workhorse pair: **Title Small-strong (14/150%/600)** and **Body Medium (14/150%/400)**.
- Data density over whitespace. Tables, timelines, panels, drawers.

## Products

| Product | What it does |
|---|---|
| **PMS** (Operations) | Reservations calendar, timeline, front desk, housekeeping, billing. |
| **POS** | Mobile-first point of sale for F&B. Integrated with PMS profiles and payments. |
| **Payments** | Embedded card, tokenization, unified invoices across PMS + POS. |
| **RMS** (Revenue) | Dynamic pricing and AI-driven rate strategy. |
| **Guest Journey** | Booking Engine, online check-in/out, upsell, kiosk, guest messaging. |

Plus the **Marketplace** — 1,000+ integrations — and **open APIs**.

## Design principles

1. **Indigo is the signal, not the background.** Primary `#3B37F2` is reserved for actions, focus, and primary brand moments. Canvas is white and near-white. Don't flood UI with indigo.
2. **Night over pure black.** Text uses `night` scale — `#21212E` primary, `#52526D` secondary, `#8D8DAC` tertiary. `#000` only for the logo.
3. **Semantic colors are unambiguous.** Red = danger, Green = success, Orange = warning, Blue = info. Use `text.alert.*`, `bg.alert.*`, `border.alert.*` tokens — never raw palette.
4. **Two-layer elevation.** Flat on sunken page (`#F3F3F3`); raised cards are white. Heavy shadows for modals/popovers only.
5. **Border-radius 8px is the anchor.** `100`=8px, `150`=12px, `200`=16px. Checkboxes 2px; tooltips 4px; avatars round.
6. **Inter everywhere.** One family, four weights (300/400/500/600). Never 700.
7. **Categorical color families** — denim, lime, mustard, lavender, ruby, tangerine — for Tags (channels, room types, segments). Not semantic, not decorative.

## Component taxonomy (MDS-aligned)

**Core components** (complete list as of Apr 2026):
Accordion · Alert (Toast) · App Bar · Avatar · Badge · Banner · Breadcrumbs · Button · Card · Chat · Checkbox · Chip · Chip Input · Data Grid · Date Picker · Data Visualization · Dialog · Divider · Drawer · Dropdown Button · Dropzone · Empty State · Expandable Content · Flag · Fields (Form Field) · Icon · Icon Button · Icon List · Image · Link · Mews Logo · Month Picker · Number Input · Password Input · Pictogram · Progress Indicator · Radio Button · Range Date Picker · Search Input · Segmented Control · Select · Selection Card Group · Side Menu · Side Panel · Signature Input · Simple List · Skeleton · Skip Link · Spinner · Split Button · Status Indicator · Stepper · Table · Tabs · Tag · Text Area · Text Input · Time Picker · Toggle · Tooltip

**B2B-specific** (in `@mews/b2b-ui`):
DataGrid · SidePanel · FloatingPanel · SmartTip · ActivityLog · CalendarGrid · ChipInput · FilterSidebar · Matrix · Timeline · ToggleButton · Tree · AppSwitcher

## Key component rules (aligned to MDS 2.0)

### Button
- Variants: **primary** (filled indigo) · **secondary** (outlined indigo border + indigo text) · **tertiary** (neutral fill) · **ghost** (transparent) · **danger** (destructive)
- No success/green button. Secondary uses indigo border + indigo text — NOT night/grey.
- Sizes: sm (32px) · md (40px, default) · lg (48px)

### Tag
- Categorical only (room type, channel, segment). Rectangle, 4px radius.
- NOT semantic. NOT removable. Removable behaviour → Chip.
- Two variants: **filled** (default, tinted background) and **outlined** (transparent + coloured border).
- Text weight is **default (400)** — never bold.
- Colors: neutral, indigo, denim, lime, mustard, lavender, ruby, tangerine, basicBold.

### Status Indicator
- Dot + label. Semantic state only: neutral · info · success · warning · danger.
- NOT a tag. Use for reservation state, payment state, task status.

### Badge
- Two variants only: **primary** (indigo) and **subtle** (neutral grey).
- Anchored to icons or avatars. Count or dot only.

### Chip
- Interactive filter/selection. 24px height pill. Used in filter bars + multi-select fields.
- Removable behaviour (close ×) lives here, NOT on Tag.

### Banner
- Inline page-level message. No left-border accent. No icon container. Plain semantic icon at 24px.
- Variants: info · success · warning · danger.

### Alert / Toast
- Floating overlay notification with shadow. Left tinted color strip containing the 24px icon.
- Close button (cross_close_24). Separate component from Banner.
- Danger uses `problematic_24` icon, not error_circle.

### Avatar
- Three sub-types: initials · image · icon (fallback)
- Sizes: sm (24px) · md (32px, default) · lg (40px) · xl (64px)

## What's in this folder

| File | Purpose |
|---|---|
| `index.html` | Overview — front door, links to all surfaces. |
| `assets/tokens.css` | All design tokens as CSS custom properties. Source of truth. |
| `assets/optimus.css` | Component styles built on tokens (buttons, inputs, cards, tags, badges, chips, banner, toast, avatar, table). |
| `assets/foundations.html` | Colors, type scale, spacing, radii, shadows, opacity. |
| `assets/iconography.html` | Icons (16/24px), logo wordmark + logomark, size variants. |
| `assets/components.html` | All core MDS components aligned to B2B Storybook. |
| `assets/patterns.html` | Higher-order compositions. |
| `assets/optimus-icons.json` | Icon name → codepoint map. Names without `_24` = 16px; with `_24` = 24px. |
| `assets/mews_logo.svg` | Wordmark SVG. |
| `assets/mews_icon.png` | Icon/logomark PNG (the real Mews soundwave mark). |
| `fonts/OptimusIcons.ttf` | Icon font. |
| `SKILL.md` | How to design in this system. |

## Authoritative sources

| Source | URL |
|---|---|
| MDS Documentation | https://www.mews.design/latest/welcome-eumfLxWD |
| Core Storybook | https://storybook.mews.design/ |
| B2B UI Storybook | https://storybook.mews.design/mews-b2b-ui-storybook-latest/ |
| Foundations | https://www.mews.design/latest/foundations/overview-vCS5oLTb |
| Components | https://www.mews.design/latest/components/overview/core-fNaQCNpC |
| B2B Components | https://www.mews.design/latest/components/overview/b2-b-r2AKi521-r2AKi521 |
