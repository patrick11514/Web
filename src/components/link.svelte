<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const {
        href,
        external = true,
        class: cls = '',
        button = false,
        children
    }: {
        href: string;
        external?: boolean;
        class?: string;
        button?: boolean;
        children: Snippet;
    } = $props();
</script>

{#if button}
    <button class={twMerge('text-primary', cls)} onclick={() => window.open(href, external ? '_blank' : '_self')}>{@render children()}</button>
{:else}
    <a class={twMerge('text-primary', cls)} {href} target={external ? '_blank' : undefined}>{@render children()}</a>
{/if}
