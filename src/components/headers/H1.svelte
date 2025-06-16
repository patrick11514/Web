<script lang="ts">
    import clsx from 'clsx';
    import type { SvelteHTMLElements } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';
    const { children, class: cls = '', ...props }: SvelteHTMLElements['h1'] = $props();
</script>

<h1 class={twMerge('text-3xl lg:text-4xl', clsx(cls))} {...props}>
    {@render children?.()}
</h1>
