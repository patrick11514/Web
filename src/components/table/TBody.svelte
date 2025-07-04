<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  const { children, class: cls = '', ...props }: SvelteHTMLElements['tbody'] = $props();
</script>

<tbody class={twMerge('[&_tr:last-child]:border-b-0', clsx(cls))} {...props}>
  {@render children?.()}
</tbody>
