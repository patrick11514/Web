<script lang="ts">
  import type { Snippet } from 'svelte';
  import Markdown from '../utility/Markdown.svelte';
  import { getError, getFormContext, getValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';

  type MarkdownFieldProps = {
    name: string;
    label: string;
    variant?: 'small' | 'normal';
    right?: Snippet;
    class?: string;
  };

  const {
    name,
    label,
    variant,
    right: _right,
    class: cls = ''
  }: MarkdownFieldProps = $props();

  const context = getFormContext();
  const id = `form-${name}`;
  const value = $derived((getValue(context, name) ?? '') as string);
</script>

<FormItem for={id} error={getError(context, name)} {label} {variant} class={cls}>
  {#snippet right()}
    {#if _right}
      {@render _right()}
    {/if}
  {/snippet}

  <Markdown content={value} />
</FormItem>
