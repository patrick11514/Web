<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  type H2Props = SvelteHTMLElements['h2'];

  const { children, class: cls = '', ...props }: H2Props = $props();
</script>

<h2
  class={twMerge('font-poppins text-2xl font-medium lg:text-3xl', clsx(cls))}
  {...props}
>
  {@render children?.()}
</h2>
