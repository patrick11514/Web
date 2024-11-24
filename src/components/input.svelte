<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    let { id, value = $bindable(), type, ...rest }: HTMLInputAttributes = $props();
</script>

<input
    {...rest}
    class="my-2 origin-bottom-left rounded-md border-b-4 border-b-primary border-b-transparent bg-accent px-2 py-1 text-xl text-text outline-none 3xl:text-2xl"
    {id}
    {type}
    bind:value
    oninput={(ev) => (value = ev.currentTarget.value)}
/>
