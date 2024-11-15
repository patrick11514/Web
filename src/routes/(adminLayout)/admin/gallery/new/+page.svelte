<script lang="ts">
    import GalleryManage from '$/components/admin/galleryManage.svelte';
    import type { GalleryItem, PartialBy } from '$/types/types';
    import { writable } from 'svelte/store';
    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    const galleryData = writable<PartialBy<GalleryItem, 'id'>>({
        id: undefined,
        name: '',
        alt: '',
        date: new Date(),
        equipment: []
    });
</script>

<GalleryManage data={$galleryData} equipment={data.equipment.data} detailTypes={data.details.data} />
