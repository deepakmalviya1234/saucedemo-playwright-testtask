# SauceDemo — Playwright + TypeScript E2E Suite

End-to-end UI automation for the [SauceDemo](https://www.saucedemo.com/) demo
storefront, covering the login → cart → checkout → order-confirmation flow.
Built from scratch with Playwright and TypeScript (`strict: true`).

This repository also contains the manual QA deliverables:

- `docs/test-cases.md` — the test case suite (22 cases).
- `BUGS.md` — exploratory session summary and defect log.

## Prerequisites (fresh machine)

- Node.js 18+ (developed on Node 22).
- npm (ships with Node).

## Install and run

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browser (Chromium)
npx playwright install chromium

# 3. Run the whole suite (headless)
npm test
```

### npm scripts

| Script                | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm test`            | Runs all tests headless.                                  |
| `npm run test:headed` | Runs tests in a headed browser.                           |
| `npm run test:ui`     | Opens the Playwright UI mode (interactive runner).        |
| `npm run test:report` | Opens the last generated HTML report.                     |
| `npm run lint`        | Runs ESLint and Prettier check; must pass with no errors. |
| `npm run lint:fix`    | Auto-fixes lint and formatting issues.                    |

> The suite includes **one intentionally failing test**
> (`tests/checkout-whitespace-zip.spec.ts`) that asserts the correct behavior
> for BUG-01. It is expected to fail against the current (buggy) app.

## Project structure

`playwright.config.ts` defines two projects: a `setup` project that logs in
once and saves an authenticated `storageState`, and a `chromium` project that
depends on it and reuses that session so no test performs a repeated UI login.
`src/pages` holds the Page Objects (Login, Inventory, Cart, Checkout),
`src/fixtures` exposes those Page Objects to tests via custom fixtures,
`src/data` holds shared credentials and the parameterized login data set, and
`tests` contains the specs plus `auth.setup.ts`. Manual artifacts live in
`docs/` and `BUGS.md`, and CI lives in `.github/workflows`.

## Design decisions and trade-offs

I chose the **Page Object Model** to keep locators and page behavior in one
place, so specs read as business flows and a UI change touches a single file.
Authentication uses a **shared `storageState`** generated once by a `setup`
project, trading a small amount of config complexity for much faster, more
stable tests that skip repeated UI logins. Locators prefer **role/placeholder/
text** hooks; where the app exposes no accessible label (the login and checkout
inputs have none) I fall back to the stable `data-test` attributes SauceDemo
ships for automation, which are documented inline and are more durable than CSS
class selectors. Assertions are **web-first only** (auto-retrying `expect`),
with no `waitForTimeout` or `waitForSelector`, and this is enforced by ESLint.

## Known limitations

- Runs against Chromium only; cross-browser projects (Firefox/WebKit) are not
  configured to keep the run fast, but can be added in `playwright.config.ts`.
- Targets the public SauceDemo app, whose seeded `*_user` accounts intentionally
  expose defects; the suite focuses on `standard_user` for the core flow.
- No visual-regression or accessibility auditing is included.
- The `checkout-whitespace-zip` test fails on purpose (documents BUG-01); it is
  not a suite regression.
- Screenshot attachments referenced in `BUGS.md` are stored under
  `docs/attachments/`.
