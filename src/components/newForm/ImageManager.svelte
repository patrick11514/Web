<script lang="ts">
  import { Icon } from '$/components/utility';
  import { API } from '$/lib/api';
  import { SwalAlert } from '$/lib/functions';
  import { languages, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { GalleryImage } from '$/types/database';
  import { twMerge } from 'tailwind-merge';
  import Button from './Button.svelte';
  import { getError, getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';

  const { name = 'images', label = 'Images' }: { name?: string; label?: string } =
    $props();

  const context = getFormContext();
  const _state = getState();

  // Helper to ensure array exists for a language
  const ensureArray = (lang: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = context.data as Record<string, any>;
    if (!data[lang]) data[lang] = {};
    if (!data[lang][name]) data[lang][name] = [];
    return data[lang][name] as GalleryImage[];
  };

  // We derive the master list from 'cs' (default)
  const images = $derived(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((context.data as Record<string, any>)['cs']?.[name] || []) as GalleryImage[]
  );

  let fileInput: HTMLInputElement;

  const handleUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const formData = new FormData();
      formData.set('file', file);
      const res = await API.upload.POST(formData);

      if (res.status) {
        const filename = res.data;
        const newImage = {
          name: filename,
          alt_text: '',
          id: -1,
          article_id: ''
        };

        // Push key to ALL languages
        for (const lang of Object.keys(languages)) {
          const arr = ensureArray(lang);
          // Clone to allow independent alt_text editing
          arr.push(structuredClone(newImage) as unknown as GalleryImage);
        }
      } else {
        SwalAlert({
          title: resolveError(res.message, _state.lang),
          icon: 'error'
        });
      }
    }
  };

  const removeImage = (idx: number) => {
    for (const lang of Object.keys(languages)) {
      const arr = ensureArray(lang);
      if (arr[idx]) arr.splice(idx, 1);
    }
  };

  const setAltText = (idx: number, lang: string, text: string) => {
    const arr = ensureArray(lang);
    if (arr[idx]) {
      arr[idx].alt_text = text;
    }
  };

  const getAltText = (idx: number, lang: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = context.data as Record<string, any>;
    return data[lang]?.[name]?.[idx]?.alt_text || '';
  };
</script>

<FormItem for={name} {label} error={getError(context, name)}>
  {#snippet right()}
    <input
      type="file"
      multiple
      class="hidden"
      bind:this={fileInput}
      onchange={handleUpload}
    />
    <Button type="button" onclick={() => fileInput.click()}>Add Image</Button>
  {/snippet}

  <div class="mt-4 flex flex-col gap-4">
    {#each images as img, idx (img.name)}
      <div class="flex items-start gap-4 rounded border p-2">
        <img
          src={`/image/${img.name}`}
          class="h-32 w-32 rounded object-cover"
          alt="Preview"
        />
        <div class="flex flex-1 flex-col gap-3">
          {#each Object.entries(languages) as [langKey, langInfo] (langKey)}
            {@const inputId = `${name}-${idx}-${langKey}`}
            <div class="flex flex-col gap-1">
              <label for={inputId} class="flex items-center gap-2 text-sm font-semibold">
                <span>{langInfo.flag}</span>
                {langInfo.name}
              </label>
              <!-- Reuse Input styling manually or create usage -->
              <input
                id={inputId}
                type="text"
                class={twMerge(
                  'focus:ring-primary-500 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder-neutral-400 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500'
                  // Error styling could be added here if we had per-image errors
                )}
                value={getAltText(idx, langKey)}
                oninput={(e) => setAltText(idx, langKey, e.currentTarget.value)}
                placeholder="Description / Alt Text"
              />
            </div>
          {/each}
        </div>
        <button
          type="button"
          class="p-2 text-red-500 hover:text-red-700"
          onclick={() => removeImage(idx)}
        >
          <Icon name="bi-trash" />
        </button>
      </div>
    {/each}

    {#if images.length === 0}
      <div class="p-4 text-center text-gray-500 italic">No images selected</div>
    {/if}
  </div>
</FormItem>
