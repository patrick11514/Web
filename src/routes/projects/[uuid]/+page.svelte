<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Group from '$/components/group.svelte';
    import Label from '$/components/label.svelte';
    import Pre from '$/components/pre.svelte';
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

<section class="flex flex-1 flex-col p-2">
    {#if !projectData}
        <Message center={true}>Někde nastala chyba :(</Message>
    {:else}
        <img class="mx-auto max-h-60 w-auto p-2" src="/customImages/{projectData.uuid}/{projectData.preview}" alt="Project's preview" />
        <div class="flex w-full flex-row">
            <h1 class="font-ubuntu text-2xl font-bold">{projectData.name}</h1>
            <h2 class="my-auto ml-auto text-gray-300">{projectData.date.toLocaleDateString()}</h2>
        </div>
        <Pre>{@html createSimpleMarkDown(projectData.description)}</Pre>
        <Group>
            <Label>Obrázky</Label>
            <div class="flex flex-col">
                {#each projectData.images as image}
                    <a class="m-2 flex justify-center" href="/customImages/{projectData.uuid}/{image}" target="_blank">
                        <img src="/customImages/{projectData.uuid}/{image}" alt="Project's preview" />
                    </a>
                {/each}
            </div>
        </Group>
    {/if}
</section>
