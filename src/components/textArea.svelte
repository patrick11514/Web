<script lang="ts">
    export let value: string | undefined;
    export let cols = 30;
    export let rows = 10;
    export let name = '';
    export let id = '';
</script>

<textarea class="h-max rounded-xl border-2 border-primary bg-transparent p-1 text-lg font-medium 3xl:text-xl" {name} {id} {cols} {rows} bind:value></textarea>
