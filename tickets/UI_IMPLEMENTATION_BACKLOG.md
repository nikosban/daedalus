# UI implementation backlog

This backlog turns the UI Design Coach audit into small, sequential implementation tickets. Complete and verify one ticket before starting the next.

## Working rules

- The references in `docs/skills/references/` define the acceptance criteria.
- Preserve the public content and established visual direction unless a ticket explicitly changes them.
- Keep foundations centralized in tokens and shared components.
- Run `npm run verify` and `git diff --check` for every ticket.
- Update the private content and implementation documents when a ticket changes production behavior.

## Status

| ID | Ticket | Status | Depends on |
| --- | --- | --- | --- |
| UI-001 | Remove obsolete demo code | Complete | — |
| UI-002 | Consolidate foundation tokens | Complete | UI-001 |
| UI-003 | Normalize production typography | Complete | UI-002 |
| UI-004 | Harden color and icon accessibility | Complete | UI-002 |
| UI-005 | Refine layout and responsive behavior | Complete | UI-002, UI-003 |
| UI-006 | Rebuild accordion motion architecture | Complete | UI-002, UI-005 |
| UI-007 | Complete accessibility and resilience verification | Complete | UI-003–UI-006 |

---

## UI-001 — Remove obsolete demo code

### Objective

Remove CSS and navigation selectors for deleted Past Work demo implementations so the stylesheet describes only components that currently exist.

### Scope

- Delete stable-panel, overlay, fixed-height, master/detail, dialog, and simple-flow demo CSS.
- Delete responsive rules for those demos.
- Delete playground `:target` selectors for removed sections.
- Do not change current production or playground visuals.

### Acceptance criteria

- No deleted demo selector remains in `src/`.
- Homepage and playground still build.
- Existing tests pass.
- Generated CSS size decreases.

### Completion evidence

- Completed: 2026-06-21
- Stale selector scan: no matches.
- Generated CSS: 39,267 bytes → 29,239 bytes.
- Generated CSS, gzip: 6,836 bytes → 5,579 bytes.
- `npm run verify`: passed with 11/11 tests.
- `git diff --check`: passed.

---

## UI-002 — Consolidate foundation tokens

### Objective

Create one coherent foundation layer for semantic color, typography, spacing, radius, elevation, z-index, and motion.

### Scope

- Separate raw values from semantic color roles.
- Remove unused legacy typography and accordion-motion tokens.
- Add unitless line-height roles.
- Add ordered radius, elevation, and stacking scales.
- Tokenize repeated structural spacing values while retaining documented optical exceptions.
- Update playground foundation tables.

### Acceptance criteria

- Production component CSS references semantic roles.
- No unused foundation token remains.
- Dark mode resolves through the same semantic role layer.
- Playground documents the implemented tokens.

### Completion evidence

- Completed: 2026-06-21
- Raw neutral values now feed semantic color roles.
- Typography leading values are unitless.
- Radius, elevation, stacking, and motion use ordered role-based scales.
- Legacy type-step, appearance-color, and component-shadow references were removed from active CSS.
- Token audit: zero unused tokens and zero undefined global tokens.
- Playground foundation tables document the implemented roles.
- `npm run verify`: passed with 12/12 tests.
- `git diff --check`: passed.

---

## UI-003 — Normalize production typography

### Objective

Apply the compact typography system consistently and verify realistic wrapping.

### Scope

- Remove production dependencies on the legacy type scale.
- Use unitless line-height roles.
- Reassess negative tracking on running text.
- Normalize tooltips, controls, metadata, and playground chrome.
- Test single-line and wrapped states at narrow widths and enlarged text.

### Acceptance criteria

- Every production text style maps to a semantic role.
- Body copy remains readable without forced tracking.
- Long company names, roles, project titles, and status text wrap safely.
- No horizontal overflow at supported widths.

### Completion evidence

- Completed: 2026-06-21
- Display and title roles retain corrective tracking; label, copy, and metadata roles use natural tracking.
- Headings use balanced wrapping while prose and long row content use resilient natural wrapping.
- Narrow accordion rows remove the decorative leader and wrap within the available width without horizontal scrolling.
- Playground typography tables and private homepage specifications document the implemented behavior.
- Added regression coverage for typography tracking and narrow-width wrapping.
- `npm run verify`: passed with 13/13 tests and zero Astro diagnostics.
- `git diff --check`: passed.

---

## UI-004 — Harden color and icon accessibility

### Objective

Make color and icon behavior resilient across themes and accessibility modes.

### Scope

- Replace component color literals with semantic roles.
- Verify light and dark contrast with current tooling.
- Add forced-colors support.
- Make system icons inherit contextual color.
- Review whether each playground navigation icon improves recognition.

### Acceptance criteria

- Essential text and controls meet the project contrast standard.
- Meaning is never communicated by color alone.
- Icon-only controls retain accessible names.
- Icons remain visible in forced-colors mode.

### Completion evidence

- Completed: 2026-06-21
- Lucide and official brand SVGs inherit `currentColor`; interactive parents retain accessible names and SVGs remain hidden from assistive technology.
- Playground navigation icons remain paired with visible labels and use distinct metaphors for each destination; none carries meaning alone.
- Theme-preview literals moved behind documented token roles.
- Added increased-contrast overrides for secondary text, icons, borders, and decoration.
- Added forced-colors handling for patterns, surfaces, borders, focus rings, selected states, tooltips, icons, and the accordion leader.
- Automated contrast results:
  - Light primary text: 17.49:1; secondary text: 8.52:1; icons: 4.76:1.
  - Dark primary text: 15.50:1; secondary text: 8.82:1; icons: 6.71:1.
- Added regression coverage for contrast, semantic color usage, inherited icon color, and accessibility-mode CSS.
- `npm run verify`: passed with 14/14 tests and zero Astro diagnostics.
- `git diff --check`: passed.
- Live browser visual inspection was deferred because the in-app automation connection was unavailable; no alternate browser path was used.

---

## UI-005 — Refine layout and responsive behavior

### Objective

Make spacing, radius, and responsive behavior follow structural context rather than incidental viewport assumptions.

### Scope

- Classify one-off spacing as structural or optical.
- Move structural values to the spacing scale.
- Derive nested radii from container role and padding.
- Test homepage and playground at intermediate widths and 200% zoom.
- Introduce container queries where a component must adapt to local width.

### Acceptance criteria

- Structural spacing traces to tokens.
- Nested shapes have coherent radius relationships.
- Components remain usable in narrower containers.
- Navigation remains quieter than primary content.

### Implementation evidence

- Implemented: 2026-06-21
- Identity, Past Work, and Selected Work now adapt through named inline-size containers rather than viewport-only component rules.
- At `30–32rem` local widths, identity and project headings stack, the accordion leader is removed, and row content continues to wrap without horizontal scrolling.
- Viewport media queries are limited to page-level framing, footer layout, and playground navigation.
- Added semantic compact-control, minimum-interaction-target, and tooltip-width roles.
- Playground foundations document structural layout roles and component-container behavior.
- Production CSS retains all three container queries after optimization.
- Added regression coverage for layout tokens, local container adaptation, and removal of superseded literals.
- `npm run verify`: passed with 15/15 tests and zero Astro diagnostics.
- `git diff --check`: passed.
- Visual review approved by the user while the live homepage was open in the in-app browser.

---

## UI-006 — Rebuild accordion motion architecture

### Objective

Preserve the selected morph direction while making the interaction efficient, interruptible, and comfortable.

### Scope

- Centralize production motion settings.
- Reduce simultaneous visual signals.
- Avoid transforming text directly.
- Minimize layout-triggering animation.
- Support interruption and reversal from the current state.
- Replace reduced-motion instant changes with a quiet transition.
- Re-evaluate production duration for interaction frequency.

### Acceptance criteria

- Repeated rapid toggles do not snap or finish unexpectedly.
- Reduced-motion mode still communicates state.
- Motion connects header and content without decorative excess.
- No end-of-animation geometry pop occurs.

### Implementation evidence

- Implemented: 2026-06-21
- Replaced native-details height measurement with accessible button triggers and labelled content regions.
- Preserved exclusive-open behavior and added trigger toggle, outside-click dismissal, and Escape dismissal.
- Replaced JavaScript height animation with interruptible CSS grid interpolation and opacity.
- Rapid input now redirects the current CSS transition rather than forcing an animation to finish or restarting from a measured endpoint.
- Production timing is `320ms` open / `220ms` close, reflecting the interaction's frequent use.
- Removed alternate motion-lab paths, panel translation, text scaling, blur, clipping, and icon overshoot.
- Reduced motion changes structure immediately while retaining a quiet `120ms` opacity transition.
- Removed the unused inset-radius token that had only supported the deleted motion controls.
- Updated private specifications and playground documentation.
- Added regression coverage for ARIA structure, exclusive behavior hooks, dismiss interactions, interruptible CSS motion, and absence of measured-height animation.
- `npm run verify`: passed with 15/15 tests and zero Astro diagnostics.
- `git diff --check`: passed.
- Visual review approved by the user while the live homepage was open in the in-app browser.

---

## UI-007 — Accessibility and resilience verification

### Objective

Run a final system audit after implementation tickets are complete.

### Scope

- Keyboard and focus-order audit.
- Accessibility-tree audit.
- Light, dark, forced-colors, increased-contrast, and reduced-motion checks.
- 200% zoom and enlarged text.
- Narrow viewport and narrow container tests.
- Build, tests, and dead-code scan.

### Acceptance criteria

- No critical accessibility issue remains.
- Every supported mode preserves hierarchy and operability.
- Verification commands pass without warnings.

### Completion evidence

- Completed: 2026-06-21
- Public and playground pages each generate one `h1`, no skipped heading levels, no duplicate IDs, and no unresolved ARIA references.
- Shared production components accept contextual heading levels so nested playground examples preserve a coherent document outline.
- Icon-only contact controls retain accessible names; duplicate visual tooltip text is hidden from assistive technology.
- Accordion triggers use native buttons with `aria-expanded`, `aria-controls`, labelled regions, inert collapsed content, Escape dismissal, and exclusive-open behavior.
- Viewport metadata preserves browser zoom; no positive tabindex or suppressed focus outline is present.
- Light, dark, increased-contrast, forced-colors, and reduced-motion behavior is covered by semantic tokens, mode-specific CSS, and regression tests.
- Container queries cover narrow component contexts and enlarged effective viewport conditions.
- Foundation audit: 108 defined tokens, zero unused tokens, and zero undefined references.
- Dead-code scan: no stale component references, debug statements, experimental motion paths, or measured-height animation code.
- Generated production CSS: 31,225 bytes; 5,857 bytes gzip.
- `npm run verify`: passed with 16/16 tests and zero Astro diagnostics.
- `git diff --check`: passed.
- The in-app automation connection was unavailable during this audit. Standard rendered behavior was reviewed by the user in the live browser; accessibility-mode resilience was verified through generated markup, CSS mode rules, and automated regression checks.
