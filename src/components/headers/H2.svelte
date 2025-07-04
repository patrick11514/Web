<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  const { children, class: cls = '', ...props }: SvelteHTMLElements['h2'] = $props();
</script>

<h2 class={twMerge('font-poppins text-2xl font-medium lg:text-3xl', clsx(cls))} {...props}>
  {@render children?.()}
</h2>
