<script lang="ts">
    import Message from '$/components/admin/message.svelte';
    import Project from '$/components/admin/project.svelte';
    import Button from '$/components/button.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { ProjectType } from '$/types/types';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let projects:
        | (Omit<ProjectType, 'date'> & {
              date: Date;
          })[]
        | undefined = undefined;

    onMount(async () => {
        const result = await API.project.list.fetch();

        if ('status' in result) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        projects = result.map((project) => {
            return {
                ...project,
                date: new Date(project.date)
            };
        });
    });
</script>

<div class="mx-auto flex w-full flex-col sm:mx-auto sm:w-[80%] md:w-[60%] lg:max-w-[812px]">
    {#if !projects}
        <Message>Načítání...</Message>
    {:else}
        <Button class="xsm:mx-auto xsm:w-[80%] xsm:max-w-64 3xl:max-w-96" on:click={() => goto('/admin/projects/new')}>Přidat projekt</Button>
        {#if projects.length == 0}
            <Message>Nebyly nalezeny žádné projekty, přidej nějaký.</Message>
        {:else}
            {#each projects as project}
                <Project name={project.name} date={project.date} image={project.preview} uuid={project.uuid} />
            {/each}
        {/if}
    {/if}
</div>
