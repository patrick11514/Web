<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { twMerge } from 'tailwind-merge';
    import Icon from '../Icon.svelte';

    export let id: number;
    export let color: string;
    export let icon: BootstrapIcon;
    export let action: (id: number) => void;
    let cls = '';
    export { cls as class };
</script>

{#if color.startsWith('#')}
    <div class="flex w-max rounded-md px-2 py-1" style="color: {color};">
        <span class="my-auto"><slot /></span>
        <button class={twMerge('text-xl', cls)} on:click={() => action(id)}>
            <Icon name={icon} />
        </button>
    </div>
{:else}
    <div class={twMerge('flex w-max rounded-md px-2 py-1', !color.startsWith('#') ? color : '')}>
        <span class="my-auto"><slot /></span>
        <button class={twMerge('text-xl', cls)} on:click={() => action(id)}>
            <Icon name={icon} />
        </button>
    </div>
{/if}
