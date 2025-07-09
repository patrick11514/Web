<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import type { PageProps } from './$types';
  import { getState } from '$/lib/state.svelte';
  import Image from '$/components/utility/Image.svelte';
  import H2 from '$/components/headers/H2.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { formatDate, sToHHMM } from '$/lib/functions';

  const { data }: PageProps = $props();
  const _state = getState();
  const _lang = $derived(_state.lang.gallery);
  const _langDynamic = $derived(data.dynamicTranslations);
</script>

{#snippet badge(text: string)}
  <div class="border-text font-poppins rounded-full border px-2 py-0.5 text-base font-medium">{text}</div>
{/snippet}

<section class="flex h-full flex-1 flex-col">
  <H1 class="mx-auto mb-8">{_lang.title}</H1>
  <div class="flex flex-wrap justify-center gap-4 p-4">
    {#each data.posts as post (post.id)}
      <a href="/{_state.selectedLang}/gallery/{post.id}" class="group border-text flex aspect-[4/5] w-full flex-col rounded-md border-2 sm:w-[calc(50%_-_0.5rem)] lg:w-md xl:w-lg">
        <div class="relative h-1/2 flex-1/2 overflow-hidden">
          <Image
            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            name={post.images[0].name}
            alt={_langDynamic[post.images[0].alt_text]}
          />
          <div class="absolute top-0 left-0 flex w-full justify-end p-4">
            <div class="bg-background/75 rounded-full px-2 py-1 text-base font-medium">
              <Icon name="bi-clock" />
              {sToHHMM(post.exposures.filter((ex) => ex.type === 'light').reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0))}
            </div>
          </div>
        </div>
        <div class="bg-background flex flex-1/2 flex-col gap-2 p-4">
          <H2>{_langDynamic[post.title]}</H2>
          <p class="text-text-muted">{_langDynamic[post.description]}</p>
          <div class="flex w-full flex-wrap gap-2">
            {#each post.equipment.slice(0, 3) as equipment (equipment.id)}
              {@render badge(equipment.name)}
            {/each}
            {#if post.equipment.length > 3}
              {@render badge(`+${post.equipment.length - 3} ${_lang.more}`)}
            {/if}
          </div>
          <div class="mt-auto flex justify-between">
            <div class="text-text-muted">
              <Icon name="bi-calendar" />
              {#if post.created_at.getTime() === post.updated_at.getTime()}
                {_lang.created} {formatDate(post.created_at, false)}
              {:else}
                {_lang.updated}
                {formatDate(post.updated_at, false)}
              {/if}
            </div>
            <button class="cursor-pointer font-medium">{_lang.readMore} <Icon name="bi-arrow-right" /></button>
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>
