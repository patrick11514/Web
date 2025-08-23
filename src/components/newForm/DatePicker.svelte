<script lang="ts">
  import BaseDatePicker from '../form/DatePicker.svelte';
  import { getError, getFormContext, getValue, setValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  import type { Snippet } from 'svelte';
  type DatePickerProps = {
    name: string;
    label: string;
    placeholder?: string;
    class?: string;
    type?: 'date' | 'datetime-local';
    variant?: 'small' | 'normal';
    right?: Snippet;
  };

  let {
    name,
    label,
    placeholder,
    class: cls = '',
    type = 'date',
    variant,
    right: _right
  }: DatePickerProps = $props();

  const context = getFormContext();

  const id = `form-${name}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let formValue = $state<any>(getValue(context, name));

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

  <BaseDatePicker
    {id}
    {name}
    {type}
    bind:value={formValue}
    {placeholder}
    error={getError(context, name)}
    class={cls}
  />
</FormItem>
