<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nexa — Project & Agent Guidelines

## 1. Project Overview
Nexa is a **premium, minimal, enterprise-style SaaS platform**. It delivers high-density, performant, and polished workflows inspired by best-in-class product design (Linear, Vercel, Stripe).

## 2. Core Technology Stack
* **Framework:** Next.js (App Router, Server & Client Components)
* **Language:** TypeScript (Strict mode)
* **Styling:** Tailwind CSS v4
* **UI Components:** shadcn/ui (Nova preset) & Base UI primitives
* **Icons:** Lucide React (`lucide-react`)
* **Charts & Analytics:** Recharts
* **Animations:** Motion (`motion`)

> **Dependency Rule:** Prefer the existing stack. Do not introduce new libraries, packages, or utilities unless there is an explicit requirement and justification.

---

## 3. Design Principles & Aesthetics
* **Aesthetic Benchmark:** Linear, Vercel, and Stripe.
* **Palette & Contrast:** Restrained, intentional monochromatic neutrals with crisp border contrast and subtle accent highlights. Flawless native light and dark modes.
* **Typography:** Clean, legible hierarchy with high typographic discipline, proper tabular figures for numerical data, and balanced optical weights.
* **Layout & Spacing:** Strict 4px/8px spacing rhythm, compact data density suitable for enterprise tools, structured borders, and subtle elevation over heavy shadows.
* **Micro-interactions:** Snappy, physics-based micro-animations (150ms–250ms duration) using Motion for layout transitions, modals, tooltips, and state updates.

### 🚫 Strictly Forbidden:
* **No generic AI tropes:** Do not use rainbow gradients, neon mesh glows, overused glassmorphism with blur overload, floating multi-colored spheres, or oversized hero text with rainbow gradient clips.
* **No decorative noise:** Avoid random accent colors, non-standard border radiuses, and gratuitous looping animations that distract from user tasks.

---

## 4. Engineering & UX Standards
1. **Component Reusability:** Build clean, atomic, composable components under `src/components/`.
2. **State Completeness:** Every view, widget, and data-driven component must explicitly handle:
   * **Loading State:** Refined skeleton placeholders (no jarring shifts).
   * **Empty State:** Helpful, structured guidance with clear calls-to-action.
   * **Error State:** Actionable error messages with recovery options.
   * **Success / Interactive State:** Immediate visual feedback.
3. **Accessibility (a11y):** Full keyboard navigability, semantic HTML elements, ARIA labels for icon-only buttons, proper focus visible rings, and contrast compliance.
4. **Responsiveness:** Desktop-first density with mobile and tablet responsive adaptations across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
5. **Code Cleanliness:** Strict TypeScript types, no `any`, modular code organization, and minimal client-side bundle overhead.
