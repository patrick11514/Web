## 🧠 Svelte 5 + TailwindCSS 4: Copilot Coding Guide

Use the following patterns to ensure consistency across components. These examples define the **expected structure**, especially for `$props()`, `twMerge`, runes, and children rendering.

---

### 🟣 Runes Instead of Legacy Syntax

Always use Svelte 5 runes:

```ts
// ✅ Access props
const { label }: InputProps = $props();

// ✅ Local state
const count = $state(0);

// ✅ Reactivity
$effect(() => {
  console.log(count);
});

// ✅ Derived value
const doubled = $derived(() => count * 2);

// ✅ Bindable value
const { value = $bindable('') }: { value: string } = $props();
```

Avoid legacy syntax:

```ts
// ❌ Don't use export let
export let label: string;

// ❌ Don't use $:
$: something = ...
```

---

### 🔡 Prop Typing and Usage

Always define a named prop type. Avoid inline types inside `$props()`:

```ts
type ButtonProps = {
  label: string;
  onClick?: () => void;
};

const { label, onClick }: ButtonProps = $props();
```

---

### 🧩 Extending HTML Elements

When wrapping native elements like `<input>`, use `SvelteHTMLElements`:

```ts
import type { SvelteHTMLElements } from 'svelte/elements';

type InputProps = {
  label: string;
} & SvelteHTMLElements['input'];

const { label, class: cls = '', ...props }: InputProps = $props();
```

Don’t re-declare built-in HTML attributes (like `value`, `name`, or `children`). They're already included.

```ts
// ❌ Don't do this:
type Bad = {
  value?: string;
  name?: string;
} & SvelteHTMLElements['input'];
```

---

### 🔄 Bindable Props

For bindable values (e.g. `bind:value`), use `$bindable()`:

```ts
const { value = $bindable('') }: { value: string } = $props();
```

Or when combining with other props:

```ts
const { value = $bindable(''), class: cls = '', ...props }: InputProps = $props();
```

---

### 🧱 Tailwind Class Merging

Use `twMerge` to merge Tailwind classes:

```ts
import { twMerge } from "tailwind-merge";

const { class: cls = "" } = $props();

<input class={twMerge("px-3 py-2 border rounded", cls)} />
```

Avoid manual concatenation:

```ts
// ❌ Don't do this:
class={"base " + cls}
```

---

### 🧒 Children Rendering and Snippets

Use `@render` for rendering children:

```svelte
{@render children?.()}
```

Children are either passed inline:

```svelte
<Select>
  <option value="a">A</option>
  <option value="b">B</option>
</Select>
```

Or wrapped in a named snippet:

```svelte
<Select>
  {#snippet children()}
    <option value="a">A</option>
    <option value="b">B</option>
  {/snippet}
</Select>
```

Never use unnamed snippet blocks:

```svelte
// ❌ Invalid
{#snippet}
  <option>A</option>
{/snippet}
```

Do not declare `children?: Snippet` if it is already part of the extended HTML element type.

---

### ✅ Summary Cheat Sheet

- Always use `$props()`, `$bindable()`, `$state()`, `$effect()`, `$derived()`
- Avoid `export let`, `$:`, and `<slot>`
- Type props with `ComponentNameProps`
- Extend HTML props with `SvelteHTMLElements['tag']`
- Don’t re-declare built-in HTML attributes like `value`, `name`, or `children`
- Use `twMerge()` for class merging
- Render children using `@render children?.()`
- Never generate `{#snippet}` without a name

---

# Project Architecture

## Overview

This project is a web application built using **SvelteKit** (Svelte 5) with the **Node.js adapter**. It uses **MySQL** as the database, managed by **Kysely** query builder. The frontend is styled with **TailwindCSS 4**.

## Tech Stack

### Core Framework

- **SvelteKit**: Full-stack framework using File-System Based Routing.
- **Svelte 5**: Utilizing Runes system (`$state`, `$props`, `$derived`, `$effect`) for reactivity.
- **Vite**: Build tool for fast HMR and bundling.
- **TypeScript**: Strictly typed development.

### Database & Backend

- **MySQL**: Relational database (driver: `mysql2`).
- **Kysely**: Type-safe SQL query builder.
- **Kysely Codegen**: Generates TypeScript interfaces from the live database schema (DB First approach).
- **Core Library**: `@patrick115/sveltekitapi` (Custom wrapper for type-safe API, Router, and Procedure handling).
- **Auth**: `jsonwebtoken` (JWT) for session management & `bcrypt` for password hasing.
- **Zod**: Schema validation for API inputs and environment variables.

### Styling & UI

- **TailwindCSS 4**: Utility-first CSS framework.
- **Bootstrap Icons**: Iconography.
- **SweetAlert2**: Modal popups and alerts.
- **Chart.js**: Data visualization.

### Utilities

- **Marked**: Markdown parsing for rendering articles.
- **Sharp**: High-performance image processing (resizing, format conversion).
- **Dotenv**: Environment variable management.

## Project Structure

### `/src`

The source code and logic of the application.

- **`lib/`**: Shared library code, accesible via import alias `$lib/` or `$/`.

  - **`server/`**: **Server-side only** code. Can strictly be imported in `+page.server.ts`, `+server.ts`, etc.
    - `api.ts`: Helper to create type-safe API definitions.
    - `context.ts`: Defines the request context (authentication state, database connection, etc.).
    - `cookies/`: Helper class `JWTCookies` for managing secure HTTP-only cookies.
    - `routes.ts`: Main API router definition/aggregate.
    - `server.ts`: Initializes the `APIServer` instance with the router and context.
    - `variables.ts`: **Source of Truth** for server configuration. Initializes:
      - `conn`: The Kysely MySQL connection instance.
      - `jwt`: JWT configuration.
      - Loads environment variables (`$env/static/private`).
  - **`components/`**: Reusable Svelte UI components.
  - **`lang/`**: Internationalization (i18n) logic.
    - `index.ts`: Exports available languages and helper functions for translation resolution alongside `getPath` for localized routing.
    - `state.svelte.ts`: **Global Client State**. Uses Svelte 5 runes (`$state`) to manage:
      - `lang`: Current language dictionary.
      - `selectedLang`: Current language key (e.g., 'en', 'cs').
      - `userState`: Logged-in user information.
  - **`types/`**: Application-wide TypeScript definitions.
    - `database.ts`: **Autogenerated** Kysely database types. Reflects the actual DB schema handles by `pnpm genDatabaseSchema`.
    - `schemes.ts`: Zod schemas for validation.

- **`routes/`**: File-system based routing.
  - **`[[lang=lang]]/`**: Main application routes wrapped in an optional language parameter.
    - Allows routes like `/about` (default lang) and `/cs/about` (explicit lang).
    - Contains sub-routes: `admin/`, `gallery/`, `about/`, `contact/`.
  - **`api/[...data]/`**: Catch-all API endpoint.
    - Takes all requests starting with `/api/`.
    - Delegates processing to `Server.handler` defined in `src/lib/server/server.ts`.
    - This creates a centralized entry point for the type-safe API.
  - **`image/[name]/`**: Image serving endpoint.
    - Likely processes/serves images dynamically (e.g., resizing or retrieving from storage).

### `/migrations`

Contains database migration files written in TypeScript.

- Using a custom migration runner (`script/runMigration.ts`).
- Migrations are timestamped (e.g., `20250504223140_logging.ts`).
- Tracks history to ensure the database schema is consistent across environments.

### `/script`

Utility scripts for maintenance.

- `createMigration.sh`: Helper to scaffold a new migration file.
- `runMigration.ts`: The runner script for executing migrations (up/down).

### `/uploads`

Storage directory for user-uploaded content (images, scripts, etc.), often excluded from version control.

## Implementation Details

### State Management (Client)

State is managed globally via `src/lib/state.svelte.ts`. It exports a reactive `state` object created with `$state()` rune. Components can import getters/setters to react to changes in:

- Language (`lang`)
- User Authentication (`userState`)

### API Architecture

The project uses a TRPC-like pattern via `@patrick115/sveltekitapi`:

1.  **Context**: Created in `context.ts`, checking headers/cookies for JWT to determine `logged` status.
2.  **Procedures**: Defined in `api.ts`.
    - `procedure`: Public endpoint.
    - `loggedProcedure`: Protected endpoint (throws 401 if not logged in).
3.  **Router**: Multiple procedures are bundled into a router (`routes.ts`).
4.  **Handling**: `src/routes/api/[...data]/+server.ts` maps HTTP methods (GET, POST, etc.) to the `Server.handler`.

### Internationalization (i18n)

- **URL Strategy**: Uses the `[[lang=lang]]` param matcher.
- **Dictionary**: Loaded from `src/lib/lang/`.
- **Resolution**: `resolveTranslation` function recursively looks up keys in the language object.

## Useful Commands

These commands are defined in `package.json` for development and maintenance.

### Development

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the application for production.
- `pnpm preview`: Preview the production build locally.
- `pnpm check`: Run Svelte-check (TypeScript validation).
- `pnpm lint`: Run ESLint and Prettier checks.
- `pnpm format`: Automatically format code with Prettier.

### Database

- `pnpm genDatabaseSchema`: Introspect the database and regenerate TypeScript definitions in `src/types/database.ts`. **Run this after applying migrations.**
- `pnpm migration:create`: Create a new empty migration file in `migrations/` (prompts for name).
- `pnpm migrate:up`: Apply pending migrations.
- `pnpm migrate:down`: Revert the last batch of migrations.
- `pnpm migrate`: Run migrations (alias for checking status/running).

### Deployment

- `pnpm start`: Start the built Node.js server (requires `pnpm build` first).
