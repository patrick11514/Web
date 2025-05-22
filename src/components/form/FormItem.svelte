<script lang="ts">
    import type { Snippet } from 'svelte';

    const {
        children,
        for: id,
        label,
        error = $bindable(undefined),
        variant = 'normal',
        right
    }: { children: Snippet; for: string; label: string; error?: string; variant?: 'small' | 'normal'; right?: Snippet } = $props();

    let labelClass = $state('');

    switch (variant) {
        case 'normal':
            labelClass = 'text-2xl lg:text-3xl';
            break;
        case 'small':
            labelClass = 'text-xl lg:text-2xl';
            break;
    }
</script>

<div class="flex w-full flex-col">
    <div class="flex items-center justify-between">
        <label for={id} class="font-poppins border-b-text mb-2 w-max border-b-2 font-bold {labelClass}">{label}</label>
        {#if right}
            {@render right()}
        {/if}
    </div>
    {@render children()}
    <span class:invisible={error === undefined} class="lg:text-md font-poppins text-base font-bold text-red-500">{error ?? '...'}</span>
</div>
