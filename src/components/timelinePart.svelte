<script lang="ts">
    export let reverse = false
    export let label: string | undefined = undefined
    export let src: string
    export let alt: string
</script>

<section class="flex" class:flex-row={!reverse} class:flex-row-reverse={reverse}>
    <img class="my-2 h-auto w-[45%] self-center px-2" {src} {alt} />
    <section class="flex w-[10%] flex-col items-center justify-center text-center">
        <div class="w-0.5 flex-grow bg-white"></div>
        {#if label !== undefined}
            <span class="text-wrap font-ubuntu text-lg font-bold">{label}</span>
        {/if}
        <div class="w-0.5 flex-grow bg-white"></div>
    </section>
    <span class="my-2 w-[45%] px-2"><slot /></span>
</section>
