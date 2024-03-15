<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Button from '$/components/button.svelte';
    import GalleryItemElm from '$/components/galleryItem.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { GalleryItem } from '$/types/types';
    import { onMount } from 'svelte';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let items: GalleryItem[] | undefined = undefined;

    const parseItems = (request: (typeof data)['items']) => {
        if (!request.status) {
            SwalAlert({
                icon: 'error',
                title: request.message
            });
            return;
        }

        items = request.data;
    };

    parseItems(data.items);

    onMount(async () => {
        const data = await API.gallery.GET();
        parseItems(data);
    });
</script>

<section class="flex flex-1 flex-col items-center">
    <a href="/admin/gallery/new"><Button class="mx-auto">Přidat obrázek</Button></a>

    {#if !items}
        <Message center={true}>Načítání...</Message>
    {:else if items.length == 0}
        <Message center={true}>Přidej nějaký obrázky do galerie</Message>
    {:else}
        {#each items as item}
            <GalleryItemElm class="w-[60%]" data={item} />
        {/each}
    {/if}
</section>
