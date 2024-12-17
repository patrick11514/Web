<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Group from '$/components/group.svelte';
    import Label from '$/components/label.svelte';
    import Pre from '$/components/pre.svelte';
    import Tag from '$/components/tag.svelte';
    import { SwalAlert, createSimpleMarkDown } from '$/lib/functions';
    import type { PublicProjectData } from '$/types/types';
    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    let projectData = $state<PublicProjectData | undefined>(undefined);

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

<section class="mx-auto flex w-full flex-1 flex-col gap-x-4 border-t-2 border-t-text p-2 md:grid md:w-[80%] md:grid-cols-2">
    <!-- <a href="/projects"><Button>Zpět</Button></a>-->
    {#if !projectData}
        <Message center={true}>Někde nastala chyba :(</Message>
    {:else}
        <div class="col-span-2 row-start-1 flex w-full flex-col md:flex-col">
            <h1 class="mx-auto my-auto font-ubuntu text-2xl font-bold md:mb-0 md:ml-auto">{projectData.name}</h1>
            <h2 class="mx-auto my-auto text-gray-300 md:mt-0">{projectData.date.toLocaleDateString()}</h2>
        </div>
        <img class="row-start-3 mx-auto max-h-60 w-auto self-start p-2 md:mr-0" src="/customImages/{projectData.uuid}/{projectData.preview}" alt="Project's preview" />
        <div class="col-span-2 row-start-2 my-2 flex flex-row flex-wrap items-start justify-center gap-2">
            {#each projectData.tags as tag}
                <Tag color={tag.color}>{tag.name}</Tag>
            {/each}
        </div>
        <Group class="col-start-2 row-start-3 rounded-md bg-sky-600 p-2">
            <Label class="text-center md:text-left">Popis projektu</Label>
            <Pre>{@html createSimpleMarkDown(projectData.description)}</Pre>
        </Group>
        {#if projectData.images.length > 0}
            <Group class="col-span-2 row-start-5 rounded-md border-[1px] border-white p-2">
                <Label class="mx-auto mb-2 w-max border-b-2 border-b-white text-center">Obrázky</Label>
                <div class="flex flex-col justify-center gap-4 p-2 md:flex-row md:flex-wrap md:items-start">
                    {#each projectData.images as image}
                        <a
                            class="flex w-max max-w-full items-center justify-center rounded-md border-[1px] border-white p-2 transition-transform duration-200 hover:brightness-125"
                            href="/customImages/{projectData.uuid}/{image}"
                            target="_blank"
                        >
                            <img class="md:h-auto md:max-w-96" src="/customImages/{projectData.uuid}/{image}" alt="Project's preview" />
                        </a>
                    {/each}
                </div>
            </Group>
        {/if}
    {/if}
</section>
