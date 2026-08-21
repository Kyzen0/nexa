---
name: ui-design
description: Design system guidelines, UI rules, component standards, and aesthetic direction for Nexa (Linear/Vercel/Stripe-inspired enterprise SaaS).
---

# Nexa UI & UX Design System Skill

This skill defines the visual language, design tokens, interaction patterns, and component development standards for **Nexa**.

---

## 1. Visual Direction & Aesthetic Philosophy

Nexa is built as an **enterprise-grade, high-density, minimal SaaS**. The visual tone takes direct inspiration from world-class modern developer tools and financial platforms:

* **Linear:** Snappy keyboard workflows, high visual density, crisp borders, dark surface depth.
* **Vercel:** Monochromatic precision, high-contrast typography, minimalist borders, refined monochrome badges.
* **Stripe:** Exceptional form design, subtle micro-interactions, clean tabular data presentations, polished feedback states.

### Core Visual Rules
* **Restrained Color Palette:** 90% of surfaces and text rely on neutral slates/zincs/grays with precise contrast ratios. Accent colors (e.g., brand indigo, emerald for success, rose for destructive, amber for warning) are used strictly for status indicators, active states, and high-priority actions.
* **Refined Surfaces:** Prefer subtle 1px border dividers (`border-border` / `border-neutral-200 dark:border-neutral-800`) over heavy shadows or colored backdrops.
* **Typography:** Crisp sans-serif fonts with defined tracking, tight headings (`tracking-tight`), and tabular numbers (`tabular-nums` / `font-mono`) for metrics, timestamps, and financial numbers.
* **Zero AI Cliché:** Absolutely no rainbow mesh gradients, neon drop shadows, glowing hero text clips, or unnecessary 3D spheres.

---

## 2. Design Tokens & Styling (Tailwind CSS v4 & shadcn Nova Preset)

### Surface & Border Hierarchy
* **Backgrounds:**
  * Background Root: `bg-background` (Light: `#ffffff` / Dark: `#09090b` or `#0a0a0a`)
  * Surface Muted / Sidebar / Card: `bg-card` or `bg-muted/50`
  * Sub-surface / Hover: `hover:bg-accent hover:text-accent-foreground`
* **Borders:**
  * Standard divider: `border-border` (`border-neutral-200 dark:border-neutral-800`)
  * Focus ring: `focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none`
* **Border Radii:**
  * Standard elements (inputs, buttons, badges): `rounded-md` or `rounded-lg` (consistent across all elements)
  * Modals / Cards: `rounded-xl`
  * Badges / Avatars: `rounded-full`

### Elevation
* Use subtle shadows: `shadow-xs`, `shadow-sm`, or `shadow-md` for floating dropdowns and dialogs.
* Avoid large, blurry colored shadows (`shadow-indigo-500/50`).

---

## 3. Component Architecture & Standards

### 1. Reusable Primitive Components
* Build upon **Base UI** and **shadcn/ui (Nova preset)**.
* Keep component interfaces declarative, composable, and typed with TypeScript interfaces.
* Support polymorphic or compound component patterns where appropriate (e.g., `Dialog`, `DialogTrigger`, `DialogContent`).

### 2. State Completeness Checklist
Every UI component or view that handles data or async operations must implement all 4 states:
1. **Loading State:**
   * Use skeleton components (`Skeleton`) with matched dimensions and pulse animations.
   * Avoid full-page spinners when localized skeletons can maintain layout stability.
2. **Empty State:**
   * Clean Lucide icon inside a soft muted circle container.
   * Clear title and short description (max 2 lines).
   * Primary actionable button (e.g., "Create your first project").
3. **Error State:**
   * Clear, concise error messaging explaining the failure.
   * Retry button or recovery trigger.
   * Inline alert banners for non-blocking errors; modal/card states for fatal errors.
4. **Success & Feedback State:**
   * Inline feedback (e.g., toast notifications, checkmark animations) without modal disruptions.

---

## 4. Animations & Micro-Interactions (`motion`)

* **Duration:** Fast and responsive (120ms to 250ms max).
* **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out) or Spring physics with moderate stiffness and low bounce (`stiffness: 400, damping: 30`).
* **Hover & Active Feedback:**
  * Buttons and list items should have instantaneous hover transitions (`transition-colors duration-150`).
  * Active click downscale: `active:scale-[0.98]`.
* **Transitions:**
  * Dialogs and popovers: scale `0.95 -> 1` and opacity `0 -> 1`.
  * Accordions and collapsibles: height animate with opacity fade.
  * No gratuitous continuous rotations or looping bouncy elements.

---

## 5. Data Visualization (Recharts)

* **Theme Harmony:** Recharts colors must read CSS variables or match design tokens (e.g., `hsl(var(--primary))`, `hsl(var(--muted-foreground))`).
* **Grid Lines:** Subtle dotted or dashed lines (`stroke="currentColor"` with `opacity={0.1}`).
* **Tooltips:** Custom glass/card tooltip matching the Nexa design tokens (`rounded-lg border bg-popover/90 backdrop-blur-sm p-2 shadow-md text-xs`).
* **Axis Styling:** Small text size (`11px` or `12px`), muted colors, no heavy axis borders.

---

## 6. Accessibility (a11y) & Keyboard Navigation

* **Keyboard Focus:** Every interactive control must have visible, high-contrast `:focus-visible` ring indicators.
* **Screen Reader Support:**
  * Icon-only buttons must have `aria-label` or `<span className="sr-only">`.
  * Dialogs, menus, and dropdowns must manage focus traps and restore focus on close.
* **Semantic Structure:** Single `<h1>` per view, semantic `<nav>`, `<main>`, `<aside>`, `<section>`, and `<header>` wrappers.
