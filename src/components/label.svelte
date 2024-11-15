<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const { for: id, class: cls = '', children }: { for?: string; class?: string; children: Snippet } = $props();
</script>

<label class={twMerge('font-ubuntu text-2xl font-bold 3xl:text-3xl', cls)} for={id}>{@render children()}</label>
