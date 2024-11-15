<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const { class: cls = '', children }: { class?: string; children: Snippet } = $props();
</script>

<p class={twMerge('mt-2 whitespace-pre-wrap font-ubuntu text-lg 3xl:text-xl', cls)}>{@render children()}</p>
