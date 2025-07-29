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
