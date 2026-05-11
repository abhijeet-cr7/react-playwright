# Vite + React + TypeScript Todo App with Auth and Playwright

A demo Todo List app built with Vite, React, and TypeScript.
It includes a simple local authentication flow and Playwright end-to-end tests.

## Features

- Login screen with deterministic demo credentials (`demo` / `password123`)
- Auth state persistence using `localStorage`
- Protected Todo route (`/todos`) for authenticated users only
- Add, toggle, and delete todos
- Logout that redirects back to login
- Stable `data-testid` selectors for E2E reliability

## Local setup

```bash
npm install
```

## Run app locally

```bash
npm run dev
```

Open http://localhost:5173.

## Build and lint

```bash
npm run lint
npm run build
```

## Run Playwright tests

First-time setup (if needed):

```bash
npx playwright install --with-deps chromium
```

Run tests:

```bash
npm run test:e2e
```

Optional headed mode:

```bash
npm run test:e2e:headed
```

## Playwright vs Cypress (fair comparison)

Both are strong E2E tools. Cypress provides an excellent developer experience and time-travel debugging, while Playwright is often stronger for cross-browser and CI-heavy workflows.

| Area | Playwright | Cypress |
| --- | --- | --- |
| Browser coverage | Chromium, Firefox, WebKit in one framework | Primarily Chromium-family + Firefox support; WebKit support is not as first-class |
| Multi-tab / multi-context | Native support for multiple pages/contexts | Historically more constrained for multi-tab scenarios |
| Auto-waiting model | Strong built-in auto-waiting and resilient locators | Also has smart waiting; different command queue model |
| Architecture | Runs out-of-process with modern parallel workers | In-browser runner with command chaining model |
| CI scalability | Strong parallelization/sharding patterns and stable headless runs | Good CI support, but large suites can require more tuning |
| Network + tracing | Rich tracing, video/screenshot, HAR-like debugging options | Great interactive debugging and network stubbing in runner |

### Why Playwright is a better fit for this demo

For this repository, Playwright is a practical choice because:

1. **Cross-browser confidence** can be expanded easily beyond Chromium.
2. **Deterministic CI execution** is straightforward with built-in retries/workers.
3. **Reliable auto-waiting + locators** make auth/todo flows stable.
4. **Trace artifacts** are useful for debugging flaky E2E behavior.

This is not a claim that Cypress is weak—Cypress remains excellent, especially for teams prioritizing an in-browser interactive runner. For this project’s CI-oriented demo and extensibility goals, Playwright provides the better fit.
