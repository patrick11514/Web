<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    const {
        link,
        target = '_self',
        class: cls = '',
        children
    }: {
        link: string;
        target?: HTMLAnchorAttributes['target'];
        class?: string;
        children: Snippet;
    } = $props();
</script>

<a href={link} {target} class={twMerge('text-primary-text', cls)}>
    {@render children()}
</a>
