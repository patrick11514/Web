<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import FileInput from '$/components/admin/fileInput.svelte';
    import Gallery from '$/components/admin/gallery.svelte';
    import Project from '$/components/admin/project.svelte';
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import Pre from '$/components/pre.svelte';
    import TextArea from '$/components/textArea.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert, createSimpleMarkDown, getDate, getFiles, uploadImage } from '$/lib/functions';
    import { projectDataSchema, type ProjectData } from '$/types/types';
    import { goto } from '$app/navigation';
    import type { Snapshot } from '@sveltejs/kit';
    import path from 'path-browserify';

    let projectData = $state<Partial<ProjectData>>({
        filePath: undefined,
        name: '',
        description: '',
        images: []
    });

    const handleDrop = async (files: (File | null)[]) => {
        const onlyFiles = getFiles(files);

        if (onlyFiles.length == 0) return;
        if (onlyFiles.length > 1) {
            SwalAlert({
                icon: 'error',
                title: 'Můžeš nahrát pouze jeden obrázek'
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', onlyFiles[0]);

        try {
            const result = await uploadImage(onlyFiles[0]);

            if (projectData.filePath) {
                const imagePath = path.parse(projectData.filePath);

                const resultOfRemove = await API.upload.DELETE({
                    name: imagePath.base
                });

                if (!resultOfRemove.status) {
                    SwalAlert({
                        icon: 'error',
                        title: resultOfRemove.message
                    });
                    return;
                }
            }

            projectData.filePath = result;
        } catch (e) {
            if (typeof e === 'string') {
                SwalAlert({
                    icon: 'error',
                    title: e
                });
            }
            return;
        }
    };

    const handleGallery = async (files: (File | null)[]) => {
        const onlyFiles = getFiles(files);

        if (onlyFiles.length == 0) return;

        const promises = onlyFiles.map((file) => uploadImage(file));

        type FullFilled = {
            id: number;
            data: PromiseFulfilledResult<string>;
        };

        type Rejected = {
            id: number;
            data: PromiseRejectedResult;
        };

        const result = (await Promise.allSettled(promises)).map((r, id) => {
            return {
                id,
                data: r
            };
        });

        const succed = result.filter((r) => r.data.status === 'fulfilled') as FullFilled[];
        const rejected = result.filter((r) => r.data.status === 'rejected') as Rejected[];

        if (rejected.length > 0) {
            SwalAlert({
                icon: 'error',
                title: 'Některé soubory se nepovedlo nahrát:<br /><br/>' + rejected.map((r) => `${files[r.id]?.name}: ${r.data.reason}`).join('<br />')
            });
        }

        const images = succed.map((r) => r.data.value);

        if (projectData.images) {
            projectData.images = [...projectData.images, ...images];
            return;
        }

        projectData.images = images;
    };

    const removeImage = async (id: number) => {
        if (!projectData.images) return;

        const imagePath = path.parse(projectData.images[id]);

        const result = await API.upload.DELETE({
            name: imagePath.base
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        projectData.images = projectData.images.filter((_, i) => i !== id);
    };

    const addProject = async () => {
        const result = projectDataSchema.safeParse(projectData);

        if (!result.success) {
            SwalAlert({
                icon: 'error',
                title: result.error.errors.map((e) => e.message).join('<br />')
            });
            return;
        }

        const response = await API.project.get.PUT(result.data);

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        SwalAlert({
            icon: 'success',
            title: 'Projekt byl úspěšně přidán'
        });

        projectData = {
            filePath: undefined,
            name: '',
            description: '',
            images: []
        };

        goto(`/admin/projects/${response.data}`);
    };

    let date = $state(getDate(''));

    $effect(() => {
        projectData.date = new Date(date);
    });

    export const snapshot = {
        capture: () => ({
            date,
            projectData
        }),
        restore: (value) => {
            date = value.date;
            projectData = {
                ...value.projectData,
                date: value.projectData.date ? new Date(value.projectData.date) : undefined
            };
        }
    } satisfies Snapshot<{
        date: string;
        projectData: Partial<ProjectData>;
    }>;
</script>

<div class="m-2 mx-auto flex flex-col p-4 sm:w-[80%] md:w-[75%] lg:grid lg:grid-cols-2 lg:items-center lg:gap-4">
    <Group>
        <Label for="preview">Náhledový obrázek</Label>
        <FileInput onDrop={handleDrop}>
            <div class="m-2 mx-auto flex w-[80%] rounded-lg p-2 transition-colors duration-200 hover:bg-secondary">
                {#if !projectData.filePath}
                    <Icon class="mx-auto text-9xl" name="bi-upload" />
                {:else}
                    <img class="mx-auto" id="preview" src={projectData.filePath} alt="preview of project" />
                {/if}
            </div>
        </FileInput>
    </Group>

    <Group class="col-start-2 row-start-1">
        <Label>Náhled projektu:</Label>
        <Project name={projectData.name ?? 'Example'} date={projectData.date ?? new Date()} image={projectData.filePath ?? '/images/example_project.png'} />
    </Group>

    <Group>
        <Label for="name">Jméno projektu</Label>
        <Input bind:value={projectData.name} id="name" type="text" />
    </Group>

    <Group>
        <Label for="date">Datum</Label>
        <Input id="date" type="date" bind:value={date} />
    </Group>

    <Group>
        <Label for="description">Popis projektu</Label>
        <TextArea bind:value={projectData.description} id="description" />
    </Group>

    <Group class="col-start-2 row-start-3 self-start">
        <Label>Náhled popisu:</Label>
        <Pre>{@html createSimpleMarkDown(projectData.description)}</Pre>
    </Group>

    <Group class="col-span-2">
        <Label>Obrázky:</Label>
        <FileInput onDrop={handleGallery}>
            <Gallery images={projectData.images ?? []} />
        </FileInput>
    </Group>

    {#if projectData.images}
        <div class="col-span-2 mx-auto my-2 flex w-[50%] flex-1 flex-col gap-2">
            {#each projectData.images as image, id}
                <div class="flex flex-row rounded-md border-2 border-primary bg-accent p-1">
                    <h2 class="my-auto break-all">{image}</h2>
                    <button onclick={() => removeImage(id)} class="ml-auto p-1 text-2xl text-red-600"><Icon name="bi-trash-fill" /></button>
                </div>
            {/each}
        </div>
    {/if}

    <Button class="col-span-2 sm:mx-auto sm:w-[60%]" onclick={addProject}>Přidat</Button>
</div>
