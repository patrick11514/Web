<script lang="ts">
    import type { Snippet } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    let {
        id,
        name = '',
        value = $bindable(),
        class: cls = '',
        children
    }: {
        id: string;
        name?: string;
        value: string;
        class?: string;
        children: Snippet;
    } = $props();
</script>

<select class={twMerge('text-md m-1 rounded-md bg-accent px-2 py-1 font-ubuntu', cls)} {name} {id} bind:value>{@render children()}</select>
