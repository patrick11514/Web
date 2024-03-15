<script lang="ts">
    import type { GalleryItem } from '$/types/types';
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };

    export let data: GalleryItem;
</script>

<a
    class={twMerge('duration-400 m-0.5 inline-block h-full w-full rounded-sm border-1 border-white bg-white bg-opacity-0 transition-all hover:bg-opacity-5', cls)}
    href="/customImages/gallery/{data.name}"
    target="_blank"
>
    <img class="h-auto w-full" src="/customImages/gallery/{data.name}" alt={data.alt} />
    <h2 class="ml-1.5 font-ubuntu lg:text-lg xl:text-xl">{data.alt}</h2>
</a>
