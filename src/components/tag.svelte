<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };

    export let color: string;
</script>

{#if color.startsWith('#')}
    <button on:click class={twMerge('m-1 w-max cursor-pointer rounded-md px-2 py-1 font-ubuntu font-bold shadow-xl drop-shadow-md', cls)} style="background-color: {color}">
        <slot />
    </button>
{:else}
    <button on:click class={twMerge('m-1 w-max cursor-pointer rounded-md px-2 py-1 font-ubuntu font-bold shadow-xl drop-shadow-md', color, cls)}>
        <slot />
    </button>
{/if}
