<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import GalleryItemElm from '$/components/galleryItem.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { GalleryItem } from '$/types/types';
    import { onMount } from 'svelte';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let images: GalleryItem[] | undefined = undefined;

    const handleImages = async (request: (typeof data)['images']) => {
        if (!request.status) {
            SwalAlert({
                icon: 'error',
                title: request.message
            });
            return;
        }

        images = request.data;
    };

    handleImages(data.images);

    onMount(async () => {
        const data = await API.gallery.GET();
        handleImages(data);
    });
</script>

<section class="flex flex-1 flex-col">
    <h2 class="mx-auto text-2xl font-bold">Galerie z mého koníčku astrofotografie.</h2>
    <div class="flex p-8">
        <div class="h-full gap-2 [column-count:1] md:[column-count:2] 2xl:[column-count:3]">
            {#if !images}
                <Message center={true}>Načítání obrázků...</Message>
            {:else if images.length == 0}
                <Message center={true}>Žádné obrázky nenalezeny.</Message>
            {:else}
                {#each images as image}
                    <GalleryItemElm data={image} />
                {/each}
            {/if}
        </div>
    </div>
</section>
