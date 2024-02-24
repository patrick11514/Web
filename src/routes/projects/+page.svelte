<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Project from '$/components/project.svelte';
    import Tag from '$/components/tag.svelte';
    import { SwalAlert } from '$/lib/functions';
    import type { PublicProjectData, Tag as PublicTag } from '$/types/types';
    import { twMerge } from 'tailwind-merge';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let projects: PublicProjectData[] | undefined = undefined;
    let tags: PublicTag[] | undefined = undefined;

    const resolveTags = (response: (typeof data)['tags']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        tags = response.data;
    };
    resolveTags(data.tags);

    const handleData = (response: (typeof data)['projects']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        projects = response.data.toSorted((a, b) => (a.date > b.date ? -1 : 1));
    };

    handleData(data.projects);

    let selectedTag: number | undefined = undefined;

    const selectTag = (id: number) => {
        if (selectedTag === id) {
            selectedTag = undefined;
            return;
        }

        selectedTag = id;
    };
</script>

<span class="text-center font-ubuntu font-bold 2xl:text-xl">Kliknutím na tag můžeš podle něho filtrovat projekty</span>
<section class="flex flex-row flex-wrap items-center justify-center px-2">
    {#if !tags}
        <Message>Nepovedlo se načíst tagy :/</Message>
    {:else}
        {#each tags as tag}
            <Tag on:click={() => selectTag(tag.id)} class={twMerge('border-2 border-transparent', tag.id == selectedTag ? 'border-text' : '')} color={tag.color}>{tag.name}</Tag>
        {/each}
    {/if}
</section>

<section class="mx-auto flex flex-1 flex-col items-stretch justify-center gap-4 p-4 md:w-full md:flex-row md:flex-wrap">
    {#if !projects}
        <Message center={true}>Někde nastala chyba :/</Message>
    {:else if projects?.length == 0}
        <Message center={true}>Nic tady není :(</Message>
    {:else}
        {#each projects.filter((project) => (selectedTag ? project.tags.map((tag) => tag.id).includes(selectedTag) : true)) as project}
            <Project {project} />
        {/each}
    {/if}
</section>
