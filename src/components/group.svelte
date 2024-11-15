<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    const { class: cls = '', children }: { class?: string; children: Snippet } = $props();
</script>

<div class={twMerge('my-2 flex flex-col', cls)}>
    {@render children()}
</div>
