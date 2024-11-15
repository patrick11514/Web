<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const {
        class: cls = '',
        center = false,
        children
    }: {
        class?: string;
        center?: boolean;
        children: Snippet;
    } = $props();
</script>

<h2 class={twMerge('w-full text-center font-ubuntu text-2xl font-bold 3xl:text-3xl', cls)} class:my-auto={center}>
    {@render children()}
</h2>
