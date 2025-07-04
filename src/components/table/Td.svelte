<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  const { children, class: cls = '', ...props }: SvelteHTMLElements['td'] = $props();
</script>

<td class={twMerge('p-2', clsx(cls))} {...props}>
  {@render children?.()}
</td>
