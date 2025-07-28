<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type TBodyProps = SvelteHTMLElements['tbody'];

  const { children, class: cls = '', ...props }: TBodyProps = $props();
</script>

<tbody class={twMerge('[&_tr:last-child]:border-b-0', clsx(cls))} {...props}>
  {@render children?.()}
</tbody>
