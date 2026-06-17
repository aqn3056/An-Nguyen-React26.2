# Aurora Tasks

A glassmorphic to-do application built with React. Aurora Tasks lets you create, edit, complete, filter, and delete tasks across **All**, **Active**, and **Completed** views, wrapped in a polished "liquid glass" interface with full keyboard accessibility and client-side input validation and sanitization.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3068B7?logo=zod&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e)

> Built as the final project for a React course, focused on professional styling, accessibility, and client-side security best practices.

---

## Live Demo

**Live URL:** _add your deployment link here_ (for example a Netlify or Vercel URL)

> **Note on the demo backend:** This app talks to a Code The Dream learning API through a development proxy. That backend only accepts requests from `http://localhost:3001`, so logging in works when you run the project locally (see [Getting Started](#getting-started)). To run a fully interactive public demo, point `VITE_TARGET` at a backend that allows your deployment's origin and cookie settings.

---

## Screenshots

### Tasks view (desktop)

![Aurora Tasks desktop view](docs/screenshots/todos-desktop.png)

### Sign in (desktop) and tasks view (mobile)

| Sign in | Mobile |
| --- | --- |
| ![Login screen](docs/screenshots/login-desktop.png) | ![Mobile tasks view](docs/screenshots/todos-mobile.png) |

---

## Features

- **Create tasks** with an accessible, validated add-task form.
- **Complete and un-complete tasks** with custom-styled checkboxes (toggles both ways).
- **Edit tasks** inline, with `Enter` to save and `Escape` to cancel.
- **Delete tasks** with an optimistic update and automatic rollback on failure.
- **Filter by status** across All / Active / Completed views, each with its own URL route and live count badges.
- **Server-side search** by title with a debounced input to limit requests.
- **Server-side sorting** by creation date or title, ascending or descending.
- **Loading, empty, and error states** designed for every view.
- **Session handling** that signs you out cleanly if your session expires.
- **Responsive layout** that adapts from mobile to desktop.
- **Liquid glass UI** with an animated aurora backdrop, frosted surfaces, and refractive buttons.

---

## Technologies Used

| Area | Tools |
| --- | --- |
| Framework | [React 19](https://react.dev/) |
| Build tooling | [Vite 8](https://vite.dev/) |
| Routing | [React Router 7](https://reactrouter.com/) |
| Validation | [Zod 4](https://zod.dev/) |
| Sanitization | [DOMPurify 3](https://github.com/cure53/DOMPurify) |
| Styling | Hand-authored CSS with custom properties (no UI framework) |
| Quality | [ESLint 9](https://eslint.org/) and [Prettier 3](https://prettier.io/) |

---

## Project Structure

The codebase follows a feature-oriented, scalable structure:

```
src/
├── App.jsx              # Auth gate + route definitions
├── main.jsx             # Entry point: Router + ErrorBoundary
├── index.css            # Design tokens, glass system, base + a11y styles
├── App.css              # Layout and component styles
├── assets/              # Static assets
├── features/            # Components grouped by feature
│   ├── auth/
│   │   └── LogonForm.jsx
│   └── todos/
│       ├── TodoForm.jsx
│       ├── TodoList.jsx
│       ├── TodoListItem.jsx
│       ├── SearchField.jsx
│       └── SortControls.jsx
├── layout/              # Structural UI (header, footer, nav, glass filter)
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── TodoNav.jsx
│   └── GlassDefs.jsx
├── pages/               # Route-level views
│   ├── TodosPage.jsx    # Data owner: fetch + CRUD, provides Outlet context
│   ├── TodosView.jsx    # All / Active / Completed view
│   └── NotFoundPage.jsx
├── shared/              # Reusable UI used across features
│   ├── Button.jsx
│   ├── TextInputWithLabel.jsx
│   ├── Alert.jsx
│   ├── Spinner.jsx
│   ├── EmptyState.jsx
│   ├── ErrorBoundary.jsx
│   └── icons.jsx
├── services/            # Non-React API integration
│   ├── todosService.js
│   └── authService.js
└── utils/               # Helpers
    ├── todoSchemas.js   # Zod validation schemas
    ├── sanitize.js      # DOMPurify wrapper
    └── useDebounce.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm 9 or newer (ships with Node)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aqn3056/An-Nguyen-React26.2.git
   cd An-Nguyen-React26.2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file from the example and set the API target:
   ```bash
   cp .env.example .env
   ```
   `.env`:
   ```
   VITE_TARGET=https://ctd-learns-node-l42tx.ondigitalocean.app
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3001](http://localhost:3001) and sign in with your course-provided credentials.

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3001 with API proxy. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for a final check. |
| `npm run lint` | Run ESLint across the project. |
| `npm run format` | Format the codebase with Prettier. |
| `npm run format:check` | Verify formatting without writing changes. |

---

## Security

Client-side security measures applied in this project:

- **Input validation before sanitization.** Form input is validated with Zod schemas, then sanitized with DOMPurify (all HTML tags and attributes stripped) before it is sent or stored.
- **Maximum length limits** on every text input (task title, email, password) to guard against oversized payloads.
- **Generic error messages.** Network and authentication failures show friendly, non-technical messages and never expose server details, stack traces, or whether an account exists.
- **An Error Boundary** catches render-time errors, shows a safe fallback, and only logs details in development.
- **No secrets in the client.** Only the public `VITE_*` proxy target is read from the environment; `.env` is git-ignored.
- **No source maps in production** (`build.sourcemap: false`) so original source is not shipped.
- **Debug logging is development-only**, guarded by `import.meta.env.DEV` so it is removed from production bundles.
- **Deployment security headers** are provided in `public/_headers` (Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS) for platforms such as Netlify.

> React escapes embedded values by default, and this project never uses `dangerouslySetInnerHTML`. Client-side validation is a UX and defense-in-depth layer; production systems must still validate and sanitize on the server.

---

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`, `footer`) and a **skip-to-content** link.
- Visible **focus indicators** on every interactive element.
- **Keyboard support** throughout: edit on `Enter`, cancel on `Escape`, fully tabbable controls.
- **Screen-reader labels** via `aria-label`, `aria-invalid`, `aria-describedby`, and live regions (`role="alert"`, `role="status"`).
- **Touch targets** of at least 44x44 px.
- Color contrast tuned to meet WCAG AA, and a `prefers-reduced-motion` media query that disables animations.

---

## Design Decisions

- **Liquid glass over an aurora gradient.** An animated, self-contained CSS gradient provides a colorful backdrop that the frosted surfaces refract. Buttons layer an inset highlight rim with an SVG `feDisplacementMap` filter to create the macOS-style "liquid glass" effect, which gracefully degrades to a frosted look where displacement filters are unsupported.
- **Design tokens.** Color, spacing, typography, radius, and motion are defined as CSS custom properties in `index.css` for a single source of truth and easy theming.
- **Readability first.** Surface opacity and text colors were tuned so content stays legible over the translucent glass while preserving the effect.
- **Routing for views.** All / Active / Completed are real routes. A layout route owns the task data and shares it with each view through React Router's `Outlet` context, keeping data fetching in one place.
- **Separation of concerns.** API calls live in `services/`, validation and sanitization in `utils/`, and presentational pieces in `shared/`, `features/`, and `layout/`.

---

## Future Improvements

- Persist the session so a page refresh keeps you signed in.
- Add unit and end-to-end tests (Vitest and Playwright).
- Support drag-and-drop reordering of tasks.
- Add due dates, priorities, and tags.
- Provide a light/dark theme toggle built on the existing tokens.
- Add optimistic-update toasts and an undo action for deletes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**An Nguyen**

- GitHub: [@aqn3056](https://github.com/aqn3056)
- Email: anqnguyen3@gmail.com
- Portfolio: _add your portfolio link here_
