<script lang="ts">
    import type { Snippet } from 'svelte';

    //https://www.npmjs.com/package/@svelte-parts/drop-file
    const {
        onDrop,
        onEnter = null,
        onLeave = null,
        class: cls = '',
        children
    }: {
        onDrop: (files: Array<File | null>) => void;
        onEnter?: (() => void) | null;
        onLeave?: (() => void) | null;
        class?: string;
        children: Snippet;
    } = $props();

    let isOver = false;
    let input: HTMLInputElement;

    const handleEnter = () => {
        isOver = true;
        if (onEnter) {
            onEnter();
        }
    };

    const handleLeave = () => {
        isOver = false;
        if (onLeave) {
            onLeave();
        }
    };

    const handleDrop = (
        e: DragEvent & {
            currentTarget: EventTarget & HTMLDivElement;
        }
    ) => {
        e.preventDefault();

        let items: Array<DataTransferItem> = [];
        if (e.dataTransfer?.items) {
            items = Array.from(e.dataTransfer.items);
        }
        onDrop(items.map((d) => d.getAsFile()));
        isOver = false;
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    const handleChange = (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => {
        e.preventDefault();
        let target = e.target as HTMLInputElement;

        onDrop(target.files?.length ? Array.from(target.files) : []);
    };
</script>

<div
    ondrop={handleDrop}
    onkeydown={() => {
        return;
    }}
    ondragover={handleDragOver}
    ondragenter={handleEnter}
    ondragleave={handleLeave}
    onclick={() => input.click()}
    role="button"
    tabindex="0"
    class={cls}
>
    {@render children()}
</div>
<input style="display:none" type="file" onchange={handleChange} bind:this={input} multiple />
