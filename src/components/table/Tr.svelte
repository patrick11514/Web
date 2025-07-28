<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type TrProps = SvelteHTMLElements['tr'];

  const { children, class: cls = '', ...props }: TrProps = $props();
</script>

<tr
  class={twMerge(
    'hover:bg-secondary-text/25 border-b-text border-b-2 transition-colors duration-100',
    clsx(cls)
  )}
  {...props}
>
  {@render children?.()}
</tr>
