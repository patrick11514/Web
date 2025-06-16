<script lang="ts">
    import type { Snippet } from 'svelte';
    import ClickOutside from './clickOutside.svelte';

    let { children, opened = $bindable(false), onClose = () => {} }: { children: Snippet; opened: boolean; onClose?: () => void } = $props();
</script>

{#if opened}
    <div class="bg-background/80 fixed top-0 left-0 z-10 flex h-screen w-screen">
        <ClickOutside
            clickoutside={() => {
                opened = false;
                onClose();
            }}
            class="border-text bg-background/80 m-auto flex max-w-[90%] flex-col rounded-md border-2 p-4"
        >
            {@render children()}
        </ClickOutside>
    </div>
{/if}
