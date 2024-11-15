<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const {
        href,
        external = true,
        class: cls = '',
        children
    }: {
        href: string;
        external?: boolean;
        class?: string;
        children: Snippet;
    } = $props();
</script>

<a class={twMerge('text-primary', cls)} {href} target={external ? '_blank' : undefined}>Ahoj</a>
