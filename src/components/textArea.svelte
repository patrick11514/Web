<script lang="ts">
    let {
        value = $bindable(),
        cols = 0,
        rows = 10,
        name = '',
        id = ''
    }: {
        value: string | undefined;
        cols?: number;
        rows?: number;
        name?: string;
        id?: string;
    } = $props();
</script>

<textarea class="h-max rounded-xl border-2 border-primary bg-transparent p-1 text-lg font-medium 3xl:text-xl" {name} {id} {cols} {rows} bind:value></textarea>
