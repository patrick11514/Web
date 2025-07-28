<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type ThProps = SvelteHTMLElements['th'];

  const { children, class: cls = '', ...props }: ThProps = $props();
</script>

<th class={twMerge('p-2', clsx(cls))} {...props}>
  {@render children?.()}
</th>
