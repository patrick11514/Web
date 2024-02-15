<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    export let id: string;
    export let name = '';
    export let value: string;
    let cls = '';
    export { cls as class };
</script>

<select class={twMerge('text-md m-1 rounded-md bg-accent px-2 py-1 font-ubuntu', cls)} {name} {id} bind:value><slot /></select>
