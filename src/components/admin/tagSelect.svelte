<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { twMerge } from 'tailwind-merge';
    import Icon from '../Icon.svelte';
    import type { Snippet } from 'svelte';

    let {
        id,
        color,
        icon,
        action,
        class: cls = '',
        children
    }: {
        id: number;
        color: string;
        icon: BootstrapIcon;
        action: (id: number) => void;
        class?: string;
        children: Snippet;
    } = $props();
</script>

{#if color.startsWith('#')}
    <div class="flex w-max rounded-md px-2 py-1" style="color: {color};">
        <span class="my-auto">{@render children()}</span>
        <button class={twMerge('text-xl', cls)} onclick={() => action(id)}>
            <Icon name={icon} />
        </button>
    </div>
{:else}
    <div class={twMerge('flex w-max rounded-md px-2 py-1', !color.startsWith('#') ? color : '')}>
        <span class="my-auto">{@render children()}</span>
        <button class={twMerge('text-xl', cls)} onclick={() => action(id)}>
            <Icon name={icon} />
        </button>
    </div>
{/if}
