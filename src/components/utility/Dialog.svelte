<script lang="ts">
    import type { Snippet } from 'svelte';
    import ClickOutside from './clickOutside.svelte';

    let { children, opened = $bindable(false), onClose = () => {} }: { children: Snippet; opened: boolean; onClose?: () => void } = $props();
</script>

{#if opened}
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen bg-black/80">
        <ClickOutside
            clickoutside={() => {
                opened = false;
                onClose();
            }}
            class="border-text m-auto flex flex-col rounded-md border-2 bg-black/80 p-4"
        >
            {@render children()}
        </ClickOutside>
    </div>
{/if}
