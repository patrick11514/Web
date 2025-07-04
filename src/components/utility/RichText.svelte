<script lang="ts">
  import type { r } from '$/lib/lang/_template';
  import type { z } from 'zod';
  import Link from './Link.svelte';

  const { text }: { text: z.infer<typeof r> } = $props();
</script>

{#each text as part, index (index)}
  {#if typeof part === 'string'}
    {#if part === '%%SPACE%%'}
      <span class="my-2 block"></span>
    {:else}
      <!-- eslint-disable-next-line svelte/no-at-html-tags !-->
      {@html part}
    {/if}
  {:else}
    <Link link={part.link} target={part.blank === undefined || part.blank === true ? '_blank' : undefined}>
      {part.text}
    </Link>
  {/if}
{/each}
