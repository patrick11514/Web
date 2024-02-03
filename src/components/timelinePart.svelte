<script lang="ts">
    export let reverse = false
    export let label: string | undefined = undefined
    export let src:
        | string
        | {
              [selector: string]: string
              default: string
          }
    export let alt: string

    //
</script>

<section class="flex font-ubuntu lg:mx-auto lg:w-[80%] 3xl:text-xl" class:flex-row={!reverse} class:flex-row-reverse={reverse}>
    {#if typeof src === 'string'}
        <img class="my-2 h-auto w-[40%] self-center px-2 xl:w-[45%]" {src} {alt} />
    {:else}
        <picture class="my-2 h-auto w-[40%] self-center px-2 xl:w-[45%]">
            {#each Object.keys(src).filter((src) => src !== 'default') as selector}
                <source media="({selector})" srcset={src[selector]} />
            {/each}
            <img src={src.default} {alt} />
        </picture>
    {/if}
    <section class="flex w-[20%] flex-col items-center justify-center text-center xl:w-[10%]">
        <div class="w-0.5 flex-grow bg-white"></div>
        {#if label !== undefined}
            <span class="text-wrap font-ubuntu text-lg font-bold 3xl:text-xl">{label}</span>
        {/if}
        <div class="w-0.5 flex-grow bg-white"></div>
    </section>
    <span class="my-2 w-[40%] self-center px-2 xl:w-[45%]" class:text-right={!reverse}><slot /></span>
</section>
