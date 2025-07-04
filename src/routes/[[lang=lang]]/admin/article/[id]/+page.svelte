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
  import { formatDate, SwalAlert } from '$/lib/functions';
  import { resolveError } from '$/lib/lang';
  import Image from '$/components/utility/Image.svelte';
  import DatePicker from '$/components/form/DatePicker.svelte';
  import Table from '$/components/table/Table.svelte';
  import Tr from '$/components/table/Tr.svelte';
  import Th from '$/components/table/Th.svelte';
  import Td from '$/components/table/Td.svelte';
  import TBody from '$/components/table/TBody.svelte';
  import THead from '$/components/table/THead.svelte';
  import { goto } from '$app/navigation';
  import { articleSchema } from '$/types/schemes';
  import H1 from '$/components/headers/H1.svelte';

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
    restore: (data) => {
      article = {
        ...data,
        created_at: data.created_at ? new Date(data.created_at) : undefined,
        exposures: data.exposures.map((exposure) => ({
          ...exposure,
          date: new Date(exposure.date)
        }))
      };
    }
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

  let exposureDate = $state<Date | undefined>(undefined);
  let exposureType = $state('light');
  let exposureCount = $state(1);
  let exposureDuration = $state(30);

  const addExposure = () => {
    article.exposures.push({
      type: exposureType,
      date: exposureDate ?? new Date(),
      count: exposureCount,
      exposure_time_s: exposureDuration,
      article_id: article.id ?? ''
    });
  };

  const articleAdd = async () => {
    const response = await API.article.POST(article);

    if (!response.status) {
      SwalAlert({
        title: resolveError(response.message, _state.lang),
        icon: 'error'
      });
      return;
    }

    SwalAlert({
      title: _lang.created,
      icon: 'success'
    });

    goto(`/${_state.selectedLang}/admin/article`);
  };

  const articleEdit = async () => {
    const parsed = articleSchema.required().safeParse(article);
    if (!parsed.success) return;
    const response = await API.article.PUT(parsed.data);

    if (!response.status) {
      SwalAlert({
        title: resolveError(response.message, _state.lang),
        icon: 'error'
      });
      return;
    }

    SwalAlert({
      title: _lang.updated,
      icon: 'success'
    });

    goto(`/${_state.selectedLang}/admin/article`);
  };
</script>

{#snippet subTitle(text: string)}
  <h2 class="text-2xl font-bold lg:text-3xl">{text}</h2>
{/snippet}

<section class="mx-auto flex w-full flex-1 p-4 lg:w-[90%] xl:w-[80%]">
  <div class="border-text flex w-full flex-col items-start gap-4 rounded-md border-2 p-4">
    <a href="/{_state.selectedLang}/admin/article">
      <Icon name="bi-chevron-left" />
      {_lang.back}
    </a>

    <H1 class="mb-4">{editing ? _lang.editTitle : _lang.createTitle}</H1>
    <Card>
      {@render subTitle(_lang.details.title)}
      <FormItem for="title" label={_lang.details.titleInput} variant="small">
        <Input id="title" placeholder={_lang.details.titlePlaceholder} bind:value={article.title} max={56} />
      </FormItem>
      <FormItem for="desc" label={_lang.details.description} variant="small">
        <Input id="desc" placeholder={_lang.details.descriptionPlaceholder} bind:value={article.description} max={128} />
      </FormItem>
      <FormItem for="content" label={_lang.details.content} variant="small">
        {#snippet right()}
          <div>{showPreview ? _lang.details.previewContent : _lang.details.editContent} <input type="checkbox" bind:checked={showPreview} /></div>
        {/snippet}

        {#if !showPreview}
          <TextArea id="content" rows={10} placeholder={_lang.details.contentPlaceholder} bind:value={article.content_md} />
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
              <Icon onclick={() => (article.equipment = article.equipment.filter((_item) => _item !== item.id))} name="bi-trash-fill" class="cursor-pointer text-red-500" />
            </div>
          {/each}
        </div>
      {/if}
    </Card>
    <Card>
      {@render subTitle(_lang.images.title)}
      <FormItem for="image" label={_lang.images.upload} class="gap-2" variant="small">
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
              <div class="border-text group relative flex max-w-[30%] flex-col rounded-md border-2 font-bold [&>picture]:m-auto">
                <Image name={image.name} alt={image.alt_text} />
                <span class="border-t-text border-t-2 p-1 font-bold">{image.alt_text}</span>
                <div
                  class="bg-background/75 absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <Icon onclick={() => deleteImage(image.name)} name="bi-trash-fill" class="cursor-pointer rounded-md border-2 border-red-600 bg-red-500 px-2 py-1" />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </FormItem>
    </Card>
    <Card>
      {@render subTitle(_lang.exposures.title)}
      <div class="flex gap-2">
        <FormItem for="date" label={_lang.exposures.date} variant="small">
          <DatePicker id="date" type="date" bind:value={exposureDate} />
        </FormItem>
        <FormItem for="type" label={_lang.exposures.type} variant="small">
          <Select id="type" bind:value={exposureType}>
            <option value="light">{_state.lang.frames.light}</option>
            <option value="dark">{_state.lang.frames.dark}</option>
            <option value="flat">{_state.lang.frames.flat}</option>
            <option value="bias">{_state.lang.frames.bias}</option>
          </Select>
        </FormItem>
        <FormItem class="flex-1" for="count" label={_lang.exposures.count} variant="small">
          <Input id="count" type="number" min={1} bind:value={exposureCount} />
        </FormItem>
        <FormItem class="flex-1" for="duration" label={_lang.exposures.seconds} variant="small">
          <Input id="duration" type="number" min={1} bind:value={exposureDuration} />
        </FormItem>
      </div>

      <Button
        class="w-full"
        onclick={(ev) => {
          ev.preventDefault();
          addExposure();
        }}
      >
        {_lang.exposures.button}
      </Button>

      <div class="border-text rounded-md border-2 text-center">
        <Table>
          <THead>
            <Tr>
              <Th>{_lang.exposures.date}</Th>
              <Th>{_lang.exposures.type}</Th>
              <Th>{_lang.exposures.count}</Th>
              <Th>{_lang.exposures.time}</Th>
              <Th>{_lang.exposures.total}</Th>
              <Th></Th>
            </Tr>
          </THead>
          <TBody>
            {#if article.exposures.length === 0}
              <Tr>
                <Th colspan={6}>{_lang.exposures.empty}</Th>
              </Tr>
            {:else}
              {#each article.exposures as exposure, idx (`${exposure.date.toISOString()}-${exposure.type}-${exposure.count}-${exposure.exposure_time_s}`)}
                <Tr>
                  <Td>{formatDate(exposure.date, false)}</Td>
                  <Td>{exposure.type}</Td>
                  <Td>{exposure.count}</Td>
                  <Td>{exposure.exposure_time_s}</Td>
                  <Td>{exposure.count * exposure.exposure_time_s}</Td>
                  <Td>
                    <Icon
                      onclick={() => (article.exposures = article.exposures.filter((_, _idx) => _idx !== idx))}
                      name="bi-trash-fill"
                      class="cursor-pointer text-2xl text-red-500"
                    />
                  </Td>
                </Tr>
              {/each}
            {/if}
          </TBody>
        </Table>
      </div>

      <div class="bg-divider flex items-center justify-between rounded-md p-4">
        {#each ['light', 'dark', 'flat', 'bias'] as const as type (type)}
          <div class="flex flex-col">
            <span class="text-xl font-medium lg:text-2xl">{_state.lang.frames[type]} {_lang.exposures.frames}</span>
            <span class="text-2xl font-extrabold lg:text-3xl">
              {article.exposures.filter((ex) => ex.type === type).reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)}s
            </span>
          </div>
        {/each}
      </div>
    </Card>
    <div class="flex w-full justify-end gap-2">
      <Button onclick={() => goto(`/${_state.selectedLang}/admin/article`)}>{_lang.cancel}</Button>
      <Button onclick={() => (editing ? articleEdit() : articleAdd())} class="bg-primary">{editing ? _lang.save : _lang.create}</Button>
    </div>
  </div>
</section>
