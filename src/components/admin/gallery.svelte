<script lang="ts">
    const { images = [] }: { images: string[] } = $props();
</script>

<div class="flex min-h-32 flex-row content-center gap-2 overflow-x-scroll rounded-md bg-primary p-2">
    {#each images as image}
        <img class="my-auto h-max max-h-96 w-max" src={image} alt="gallery item" />
    {/each}
</div>
