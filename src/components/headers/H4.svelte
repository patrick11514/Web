<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  const { children, class: cls = '', ...props }: SvelteHTMLElements['h3'] = $props();
</script>

<h4 class={twMerge('font-poppins text-lg font-medium lg:text-xl', clsx(cls))} {...props}>
  {@render children?.()}
</h4>
