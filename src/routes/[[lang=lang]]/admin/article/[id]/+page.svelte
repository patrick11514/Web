<script lang="ts">
    import FormItem from '$/components/form/FormItem.svelte';
    import Input from '$/components/form/Input.svelte';
    import TextArea from '$/components/form/TextArea.svelte';
    import Card from '$/components/utility/Card.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import type { PageProps, Snapshot } from './$types';
    import Markdown from '$/components/utility/Markdown.svelte';
    import Select from '$/components/form/Select.svelte';
    import Button from '$/components/form/Button.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import { resolveError } from '$/lib/lang';
    import Image from '$/components/utility/Image.svelte';

    const { data }: PageProps = $props();

    let article = $state(data.article);

    const editing = $derived('id' in data.article);

    const _state = getState();
    const _lang = $derived(_state.lang.admin.article.form);

    let showPreview = $state(false);

    let selectedEquipment = $state<null | number>(null);

    $effect(() => {
        if (selectedEquipment !== null) {
            article.equipment.push(selectedEquipment);
            selectedEquipment = null;
        }
    });

    export const snapshot = {
        capture: () => article,
        restore: (data) => (article = data)
    } satisfies Snapshot<typeof data.article>;

    let imageDescription = $state('');
    let imageFiles = $state<FileList | null>(null);

    const uploadImage = async () => {
        if (imageDescription.trim() === '') {
            SwalAlert({
                title: _lang.images.alt,
                icon: 'error'
            });
            return;
        }

        if (!imageFiles || imageFiles.length === 0) {
            SwalAlert({
                title: _lang.images.noImage,
                icon: 'error'
            });
            return;
        }

        if (imageFiles.length > 1) {
            SwalAlert({
                title: _lang.images.multiple,
                icon: 'error'
            });
            return;
        }

        const formData = new FormData();
        formData.set('file', imageFiles[0]);
        const response = await API.upload.POST(formData);

        if (!response.status) {
            SwalAlert({
                title: resolveError(response.message, _state.lang),
                icon: 'error'
            });
            return;
        }

        article.images.push({
            name: response.data,
            alt_text: imageDescription,
            //@TODO: after inserting the image, fill article_ids
            article_id: ''
        });

        imageDescription = '';
    };

    const deleteImage = async (image: string) => {
        const confirm = await SwalAlert({
            title: _lang.images.confirmDelete,
            toast: false,
            timer: 0,
            position: 'center',
            showCancelButton: true,
            cancelButtonText: _state.lang.no,
            showConfirmButton: true,
            confirmButtonText: _state.lang.yes
        });

        if (!confirm.isConfirmed) {
            return;
        }

        const response = await API.upload.DELETE(image);

        if (!response.status) {
            SwalAlert({
                title: resolveError(response.message, _state.lang),
                icon: 'error'
            });
            return;
        }

        article.images = article.images.filter((img) => img.name !== image);
    };
</script>

{#snippet subTitle(text: string)}
    <h2 class="text-2xl font-bold lg:text-3xl">{text}</h2>
{/snippet}

<section class="mx-auto flex w-full flex-1 p-4 lg:w-[90%] xl:w-[80%]">
    <form class="border-text flex w-full flex-col items-start gap-4 rounded-md border-2 p-4">
        <a href="/{_state.selectedLang}/admin/article">
            <Icon name="bi-chevron-left" />
            {_lang.back}
        </a>

        <h1 class="border-b-text mb-4 w-max border-b-2 text-center text-3xl font-bold lg:text-4xl">{editing ? _lang.editTitle : _lang.createTitle}</h1>
        <Card>
            {@render subTitle(_lang.details.title)}
            <FormItem for="title" label={_lang.details.titleInput} variant="small">
                <Input id="title" name="title" placeholder={_lang.details.titlePlaceholder} bind:value={article.title} />
            </FormItem>
            <FormItem for="content" label={_lang.details.content} variant="small">
                {#snippet right()}
                    <div>{showPreview ? _lang.details.previewContent : _lang.details.editContent} <input type="checkbox" bind:checked={showPreview} /></div>
                {/snippet}

                {#if !showPreview}
                    <TextArea id="content" name="content" rows={10} placeholder={_lang.details.contentPlaceholder} bind:value={article.content_md} />
                {:else}
                    <Markdown content={article.content_md} />
                {/if}
            </FormItem>
        </Card>
        <Card>
            {@render subTitle(_lang.equipment.title)}
            <Select bind:value={selectedEquipment}>
                <option value={null} selected disabled>{_lang.equipment.select}</option>
                {#each data.equipment.filter((item) => !article.equipment.includes(item.id)) as item (item.id)}
                    <option value={item.id}>{item.name}</option>
                {/each}
            </Select>
            {#if article.equipment.length === 0}
                <h2 class="font-bold">{_lang.equipment.empty}</h2>
            {:else}
                <div class="flex flex-wrap gap-2">
                    {#each data.equipment.filter((item) => article.equipment.includes(item.id)) as item (item.id)}
                        <div class="border-text rounded-md border-2 px-2 py-1 font-bold">
                            {item.name}
                            <Icon
                                onclick={() => (article.equipment = article.equipment.filter((_item) => _item !== item.id))}
                                name="bi-trash-fill"
                                class="cursor-pointer text-red-500"
                            />
                        </div>
                    {/each}
                </div>
            {/if}
        </Card>
        <Card>
            {@render subTitle(_lang.images.title)}
            <FormItem for="image" label={_lang.images.upload} class="gap-2">
                <div class="flex flex-row items-center justify-stretch gap-2">
                    <Input type="text" class="flex-1" placeholder={_lang.images.descriptionPlaceholder} bind:value={imageDescription} />
                    <label
                        for="image"
                        class="border-secondary hover:border-primary font-roboto w-max cursor-pointer rounded-md border-2 px-4 py-1 text-xl font-bold transition-all duration-200 active:translate-y-0.5 disabled:grayscale lg:text-2xl"
                    >
                        <Icon name="bi-upload" />
                        {_lang.images.browse}
                    </label>
                    <input type="file" accept="image/*" class="hidden" id="image" bind:files={imageFiles} />
                </div>
                <Button
                    onclick={(ev) => {
                        ev.preventDefault();
                        uploadImage();
                    }}
                    class="w-full"><Icon name="bi-plus" /> {_lang.images.upload}</Button
                >
                {#if article.images.length === 0}
                    <h2 class="font-bold">{_lang.images.empty}</h2>
                {:else}
                    <div class="flex flex-wrap gap-2">
                        {#each article.images as image (image.name)}
                            <div class="border-text group relative flex max-w-[30%] flex-col rounded-md border-2 font-bold">
                                <Image name={image.name} alt={image.alt_text} />
                                <span class="border-t-text border-t-2 p-1 font-bold">{image.alt_text}</span>
                                <div
                                    class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black/75 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                >
                                    <Icon
                                        onclick={() => deleteImage(image.name)}
                                        name="bi-trash-fill"
                                        class="cursor-pointer rounded-md border-2 border-red-600 bg-red-500 px-2 py-1"
                                    />
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </FormItem>
        </Card>
    </form>
</section>
