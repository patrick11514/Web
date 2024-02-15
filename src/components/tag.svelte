<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };

    export let color: string;
</script>

{#if color.startsWith('#')}
    <span class={twMerge('m-0.5 w-max rounded-lg px-1 font-ubuntu font-bold shadow-xl drop-shadow-md', cls)} style="background-color: {color}"><slot /></span>
{:else}
    <span class={twMerge('m-0.5 w-max rounded-lg px-1 font-ubuntu font-bold shadow-xl drop-shadow-md', color, cls)}><slot /></span>
{/if}
