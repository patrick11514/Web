<script lang="ts">
    import type { Snippet } from 'svelte';

    const { children, for: id, label, error = $bindable(undefined) }: { children: Snippet; for: string; label: string; error?: string } = $props();
</script>

<div class="flex flex-col">
    <label for={id} class="font-poppins border-b-text mb-2 w-max border-b-2 text-2xl font-bold lg:text-3xl">{label}</label>
    {@render children()}
    <span class:invisible={error === undefined} class="lg:text-md font-poppins text-base font-bold text-red-500">{error ?? '...'}</span>
</div>
