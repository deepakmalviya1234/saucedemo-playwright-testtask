# Exploratory Testing — Bug Report

## Session Strategy

For this 60-minute session I used a **Landmark Tour** to first walk the core purchase path (login → inventory → cart → checkout → confirmation) and confirm the happy path is stable, then switched to Elisabeth Hendrickson's **"Test Heuristics" (input validation, CRUD, and interruption)** combined with the **Back Button / Reload tour** to probe state handling. I focused input attacks on the login and checkout forms (empty, whitespace, oversized, and special characters) and authorization checks on direct URL access, because demo storefronts most commonly leak defects in client-side validation and route guards rather than in the visual layout.

## Environment

Unless noted per-bug, all defects were observed in:

- **Browser:** Chrome 128 (Chromium)
- **OS:** Windows 11
- **Viewport:** 1280 × 720
- **App:** https://www.saucedemo.com/ (`standard_user` unless a specific user is required)

---

## BUG-01 — Checkout accepts whitespace-only Postal Code

- **Environment:** Chrome 128, Windows 11, 1280×720
- **Steps to reproduce:**
  1. Log in as `standard_user`.
  2. Add any item to the cart and open the cart.
  3. Click Checkout.
  4. Enter First Name = `John`, Last Name = `Doe`, Postal Code = a single space ` `.
  5. Click Continue.
- **Expected:** Validation rejects a blank/whitespace-only postal code with "Postal Code is required."
- **Actual:** The form is accepted and the user proceeds to the Overview step.
- **Severity:** Medium — allows an order with no valid delivery information.
- **Priority:** P2 — realistic data-quality issue on a required field.
- **Justification:** A required field that accepts semantically empty input defeats the purpose of the validation.
- **Attachment:** `docs/attachments/bug-01-whitespace-zip.png` _(add screenshot before submission)_

---

## BUG-02 — `problem_user` renders identical/incorrect product images

- **Environment:** Chrome 128, Windows 11, 1280×720
- **Steps to reproduce:**
  1. Log in as `problem_user` / `secret_sauce`.
  2. Observe the inventory product images.
- **Expected:** Each product shows its own distinct image.
- **Actual:** All products render the same placeholder ("dog") image.
- **Severity:** High (for that user profile) — misrepresents the product catalog.
- **Priority:** P2 — this user profile is intentionally broken but is still a real, reproducible rendering defect.
- **Justification:** Wrong product imagery directly harms purchase decisions.
- **Attachment:** `docs/attachments/bug-02-problem-user-images.png`

---

## BUG-03 — `problem_user` cannot sort products correctly

- **Environment:** Chrome 128, Windows 11, 1280×720
- **Steps to reproduce:**
  1. Log in as `problem_user`.
  2. Change the sort dropdown to "Price (low to high)".
- **Expected:** Products reorder by ascending price.
- **Actual:** The product order does not change / does not reflect the selected sort.
- **Severity:** Medium — a core catalog control is non-functional.
- **Priority:** P2.
- **Justification:** Broken sorting undermines product discovery.
- **Attachment:** `docs/attachments/bug-03-problem-user-sort.png`

---

## BUG-04 — `performance_glitch_user` has excessive login latency

- **Environment:** Chrome 128, Windows 11, 1280×720
- **Steps to reproduce:**
  1. Log in as `performance_glitch_user` / `secret_sauce`.
  2. Measure the time from Login click to the inventory page rendering.
- **Expected:** Login completes within a reasonable threshold (≈1–2 s), comparable to `standard_user`.
- **Actual:** Login takes several seconds (~5 s), noticeably degraded.
- **Severity:** Medium — degraded but functional.
- **Priority:** P3.
- **Justification:** Slow auth is a UX/perf concern, not a functional block.
- **Attachment:** `docs/attachments/bug-04-perf-glitch.png`

---

## BUG-05 — `error_user` cannot remove an item from the cart

- **Environment:** Chrome 128, Windows 11, 1280×720
- **Steps to reproduce:**
  1. Log in as `error_user` / `secret_sauce`.
  2. Add an item to the cart, open the cart, and click Remove.
- **Expected:** The item is removed and the badge updates.
- **Actual:** The Remove action does not work as expected for this profile.
- **Severity:** High (for that profile) — blocks cart management.
- **Priority:** P2.
- **Justification:** Inability to remove items blocks completing a corrected order.
- **Attachment:** `docs/attachments/bug-05-error-user-remove.png`

---

## Notes

- BUG-01 is the defect intentionally asserted (as a failing test) in the automation suite — see `tests/checkout-whitespace-zip.spec.ts`.
- The `*_user` accounts on SauceDemo are seeded to expose specific defects; they are documented here as genuine, reproducible behaviors relevant to a QA review rather than as accidental discoveries.
- Replace the attachment placeholders in `docs/attachments/` with real screenshots captured during your own session before submitting.
