<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import CreateTag from '$/components/admin/tagCreate.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { Tag } from '$/types/types';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let tagData: Tag | undefined = undefined;

    const handleData = (result: (typeof data)['tag']) => {
        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        tagData = result.data;

        color = tagData.color.startsWith('#') ? 'custom' : tagData.color;
        customColor = tagData.color.startsWith('#') ? tagData.color : '#000';
    };

    const load = async () => {
        const result = await API.tag.POST({
            id: parseInt($page.params.id)
        });

        handleData(result);
    };

    const updateTag = async () => {
        if (!tagData) return;

        const result = await API.tag.PATCH({
            id: tagData.id,
            text: tagData.name,
            color: color === 'custom' ? customColor : color
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        SwalAlert({
            icon: 'success',
            title: 'Tag byl úspěšně upraven'
        });

        load();
    };

    let color: string;
    let customColor: string;

    handleData(data.tag);
</script>

<div class="flex w-full flex-col p-2 xsm:mx-auto xsm:w-[80%] sm:w-[70%] md:w-[60%] lg:max-w-112">
    {#if !tagData}
        <Message>Načítání...</Message>
    {:else}
        <CreateTag
            bind:tagText={tagData.name}
            bind:color
            bind:customColor
            handleCancel={() => goto('/admin/tags')}
            handleRefresh={load}
            buttonName="Upravit tag"
            cancelName="Zpět"
            handleButton={updateTag}
        />
    {/if}
</div>
