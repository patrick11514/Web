<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import FileInput from '$/components/admin/fileInput.svelte';
    import Gallery from '$/components/admin/gallery.svelte';
    import Message from '$/components/admin/message.svelte';
    import Project from '$/components/admin/project.svelte';
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import Pre from '$/components/pre.svelte';
    import TextArea from '$/components/textArea.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert, createSimpleMarkDown, getDate, getFiles, uploadImage } from '$/lib/functions';
    import type { FullProjectData } from '$/types/types';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import path from 'path-browserify';
    import { onMount } from 'svelte';

    let projectData: FullProjectData | undefined = undefined;

    type ImageModified = {
        path: string;
        modified: boolean;
    };

    const fetchData = async () => {
        const result = await API.project.get.POST.fetch({
            uuid: $page.params.uuid
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        projectData = result.data;
        date = getDate(projectData.date);
        imageModified = false;

        images = projectData.images.map((image) => {
            return {
                path: image.name,
                modified: false
            };
        });
    };

    onMount(() => {
        fetchData();
    });

    let imageModified = false;

    let images: ImageModified[] = [];

    const handleDrop = async (files: (File | null)[]) => {
        if (!projectData) return;

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
        formData.set('file', onlyFiles[0]);

        const result = await API.upload.POST.fetch(formData);

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        if (imageModified) {
            const imagePath = path.parse(projectData.preview);

            const removeResult = await API.upload.DELETE.fetch({
                name: imagePath.base
            });

            if (!removeResult.status) {
                SwalAlert({
                    icon: 'error',
                    title: removeResult.message
                });
                return;
            }
        }

        projectData.preview = result.data;
        imageModified = true;
    };

    const removeImage = (id: number) => {
        images = images.filter((_, index) => index !== id);
    };

    const handleGallery = async (files: (File | null)[]) => {
        const onlyImages = getFiles(files);

        if (onlyImages.length == 0) return;

        const promises = onlyImages.map((file) => uploadImage(file));

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

        const newImages = succed.map((r) => r.data.value);

        images = [
            ...images,
            ...newImages.map((image) => {
                return {
                    path: image,
                    modified: true
                };
            })
        ];
    };

    let date: string;

    $: projectData ? (projectData.date = new Date(date)) : '';

    const deleteProject = async () => {
        if (!projectData) return;
        const result = await SwalAlert({
            toast: false,
            position: 'center',
            timer: 0,
            title: 'Opravdu chceš smazat tento projekt?',
            showConfirmButton: true,
            confirmButtonText: 'Ano',
            showCancelButton: true,
            cancelButtonText: 'Ne'
        });

        if (!result.isConfirmed) return;

        const deleteResult = await API.project.get.DELETE.fetch({
            uuid: projectData.uuid
        });

        if (!deleteResult.status) {
            SwalAlert({
                icon: 'error',
                title: deleteResult.message
            });
            return;
        }

        goto('/admin/projects');
    };

    const updateProject = async () => {
        if (!projectData) return;

        const result = await API.project.get.PATCH.fetch({
            name: projectData.name,
            date: projectData.date,
            description: projectData.description,
            filePath: projectData.preview,
            uuid: projectData.uuid,
            images: images.map((image) => image.path),
            previewChanged: imageModified
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        fetchData();
    };
</script>

<section class="mx-auto flex flex-col p-2 sm:w-[80%] md:w-[75%] lg:grid lg:grid-cols-2 lg:items-center lg:gap-4">
    {#if !projectData}
        <Message class="col-span-2">Načítání...</Message>
    {:else}
        <FileInput onDrop={handleDrop}>
            <img class="mx-auto h-auto w-[50%]" src={!imageModified ? `/customImages/${projectData.uuid}/${projectData.preview}` : projectData.preview} alt="project preview" />
        </FileInput>

        <Group>
            <Label>Náhled projektu</Label>
            <Project name={projectData.name} date={projectData.date} image={projectData.preview} uuid={imageModified ? undefined : projectData.uuid} />
        </Group>

        <Group>
            <Label for="name">Jméno projektu:</Label>
            <Input id="name" type="text" bind:value={projectData.name} />
        </Group>

        <Group>
            <Label for="name">Datum dokonění projektu:</Label>
            <Input id="name" type="date" bind:value={date} />
        </Group>

        <Group>
            <Label for="name">Popis projektu:</Label>
            <TextArea id="name" bind:value={projectData.description} />
        </Group>

        <Group class="place-self-start">
            <Label>Náhled popisu:</Label>
            <Pre>{@html createSimpleMarkDown(projectData.description)}</Pre>
        </Group>

        <Group class="col-span-2">
            <Label>Obrázky:</Label>
            <FileInput onDrop={handleGallery}>
                <Gallery
                    images={images.map((image) => {
                        if (image.modified) {
                            return image.path;
                        }
                        return `/customImages/${projectData?.uuid}/${image.path}`;
                    })}
                />
            </FileInput>
        </Group>

        {#if images}
            <div class="col-span-2 mx-auto my-2 flex w-[50%] flex-1 flex-col gap-2">
                {#each images as image, id}
                    <div class="flex flex-row rounded-md border-2 border-primary bg-accent p-1">
                        <h2 class="my-auto break-all">{image.modified ? image.path : `/customImages/${projectData?.uuid}/${image.path}`}</h2>
                        <button on:click={() => removeImage(id)} class="ml-auto p-1 text-2xl text-red-600"><Icon name="bi-trash-fill" /></button>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="col-span-2 mx-auto flex flex-row">
            <Button on:click={updateProject}>Upravit</Button>
            <Button on:click={deleteProject} class="bg-red-700 hover:bg-red-500">Smazat</Button>
        </div>
    {/if}
</section>
