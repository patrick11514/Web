<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Label from '$/components/label.svelte';
    import Pre from '$/components/pre.svelte';
    import Tag from '$/components/tag.svelte';
    import { SwalAlert, createSimpleMarkDown } from '$/lib/functions';
    import type { PublicProjectData } from '$/types/types';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let projectData: PublicProjectData | undefined = undefined;

    const handleData = (response: (typeof data)['project']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: 'Nepovedlo se načíst data'
            });
            return;
        }

        projectData = response.data;
    };
    handleData(data.project);
</script>

<section class="mx-auto flex flex-1 flex-col gap-x-4 p-2 md:grid md:w-[80%] md:grid-cols-2">
    <a href="/projects"><Button>Zpět</Button></a>
    {#if !projectData}
        <Message center={true}>Někde nastala chyba :(</Message>
    {:else}
        <img class="row-start-3 mx-auto max-h-60 w-auto self-end p-2 md:mr-0" src="/customImages/{projectData.uuid}/{projectData.preview}" alt="Project's preview" />
        <div class="row-start-2 flex w-full flex-row md:flex-col">
            <h1 class="my-auto font-ubuntu text-2xl font-bold md:mb-0 md:ml-auto">{projectData.name}</h1>
            <h2 class="my-auto ml-auto text-gray-300 md:mt-0">{projectData.date.toLocaleDateString()}</h2>
        </div>
        <div class="row-start-4 my-2 flex flex-row flex-wrap items-start gap-2 md:justify-end">
            {#each projectData.tags as tag}
                <Tag color={tag.color}>{tag.name}</Tag>
            {/each}
        </div>
        <Pre class="col-start-2 row-span-3 row-start-2">{@html createSimpleMarkDown(projectData.description)}</Pre>
        <Group class="col-span-2 row-start-5">
            <Label class="text-center">Obrázky</Label>
            <div class="flex flex-col justify-center md:flex-row md:flex-wrap">
                {#each projectData.images as image}
                    <a class="m-2 flex items-center justify-center" href="/customImages/{projectData.uuid}/{image}" target="_blank">
                        <img class="md:h-auto md:max-w-96" src="/customImages/{projectData.uuid}/{image}" alt="Project's preview" />
                    </a>
                {/each}
            </div>
        </Group>
    {/if}
</section>
