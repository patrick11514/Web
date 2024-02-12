<script lang="ts">
    /**
     * Source: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
     */
    function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target as Node | null) && !event.defaultPrevented) {
                clickoutside();
            }
        };

        document.addEventListener('click', handleClick, true);

        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }

    export let clickoutside: () => void;
    let cls = '';
    export { cls as class };
</script>

<div class={cls} use:clickOutside><slot /></div>
