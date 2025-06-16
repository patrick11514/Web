<script lang="ts">
    import clsx from 'clsx';
    import type { SvelteHTMLElements } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    const { children, class: cls = '', ...props }: SvelteHTMLElements['h3'] = $props();
</script>

<h3 class={twMerge('font-poppins text-xl font-medium lg:text-2xl', clsx(cls))} {...props}>
    {@render children?.()}
</h3>
