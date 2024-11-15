<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    const { class: cls, color, children, ...rest }: HTMLButtonAttributes & { class: string; color: string; children: Snippet } = $props();
</script>

{#if color.startsWith('#')}
    <button {...rest} class={twMerge('m-1 w-max cursor-pointer rounded-md px-2 py-1 font-ubuntu font-bold shadow-xl drop-shadow-md', cls)} style="background-color: {color}">
        {@render children()}
    </button>
{:else}
    <button {...rest} class={twMerge('m-1 w-max cursor-pointer rounded-md px-2 py-1 font-ubuntu font-bold shadow-xl drop-shadow-md', color, cls)}>
        {@render children()}
    </button>
{/if}
