<script lang="ts">
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import BaseSelect from '../form/Select.svelte';
  import { getError, getFormContext, getValue, setValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  type SelectProps = SvelteHTMLElements['select'] & {
    name: string;
    label: string;
    variant?: 'small' | 'normal';
    right?: Snippet;
  };

  let {
    name,
    label,
    class: cls = '',
    children,
    variant,
    right: _right
  }: SelectProps = $props();

  const context = getFormContext();
  const id = `form-${name}`;

  let formValue = $state<unknown>(getValue(context, name));

  $effect(() => {
    formValue = getValue(context, name);
  });

  $effect(() => {
    setValue(context, name, formValue);
  });
</script>

<FormItem for={id} error={getError(context, name)} {label} {variant}>
  {#snippet right()}
    {#if _right}
      {@render _right()}
    {/if}
    {#if context.multiLang}
      <TranslationAvailability {context} path={name} />
    {/if}
  {/snippet}

  <BaseSelect
    {id}
    {name}
    bind:value={formValue as string}
    error={getError(context, name)}
    class={clsx(cls)}
  >
    {@render children?.()}
  </BaseSelect>
</FormItem>
