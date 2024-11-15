<script lang="ts">
    import { createSimpleMarkDown } from '$/lib/functions';
    import type { PublicProjectData } from '$/types/types';
    import Pre from './pre.svelte';
    import Tag from './tag.svelte';

    const { project }: { project: PublicProjectData } = $props();
</script>

<a
    href="/projects/{project.uuid}"
    class="mx-auto flex h-auto max-h-128 w-full flex-col rounded-md bg-secondary p-2 transition-all duration-200 hover:scale-102 xsm:w-[80%] sm:w-[65%] md:mx-0 md:max-w-96"
>
    <img class="m-2 mx-auto max-h-60" src="/customImages/{project.uuid}/{project.preview}" alt="Project's Preview" />
    <div class="flex flex-row">
        <h1 class="font-ubuntu text-2xl font-bold">{project.name}</h1>
        <h2 class="my-auto ml-auto text-gray-300">{project.date.toLocaleDateString()}</h2>
    </div>
    <Pre class="line-clamp-4 overflow-ellipsis">{@html createSimpleMarkDown(project.description)}</Pre>
    <div class="my-1 mt-auto flex flex-row flex-wrap">
        {#each project.tags as tag}
            <Tag color={tag.color}>{tag.name}</Tag>
        {/each}
    </div>
</a>
