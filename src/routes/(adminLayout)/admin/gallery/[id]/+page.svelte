<script lang="ts">
    import GalleryManage from '$/components/admin/galleryManage.svelte';
    import { SwalAlert } from '$/lib/functions';
    import type { GalleryItem } from '$/types/types';
    import { writable } from 'svelte/store';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    const itemData = writable<GalleryItem>();

    const parseData = (response: (typeof data)['data']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        itemData.set(response.data);
    };

    parseData(data.data);
</script>

<GalleryManage bind:data={$itemData} equipment={data.equipment.data} />
