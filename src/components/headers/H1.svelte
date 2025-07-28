<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  type H1Props = SvelteHTMLElements['h1'];

  const { children, class: cls = '', ...props }: H1Props = $props();
</script>

<h1
  class={twMerge(
    'border-b-text font-poppins max-w-max border-b-2 text-center text-3xl font-bold lg:text-4xl',
    clsx(cls)
  )}
  {...props}
>
  {@render children?.()}
</h1>
