<script lang="ts">
  import type { FormElement } from '$/types/types';
  import { clsx } from 'clsx';
  import { untrack } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  const toDate = (date = new Date()) => {
    return date.toISOString().split('T')[0];
  };

  const toDateTime = (date = new Date()) => {
    return date.toISOString().slice(0, 16);
  };

  type DatePickerProps = FormElement<{
    value?: Date;
    id?: string;
    name?: string;
    placeholder?: string;
    type?: 'date' | 'datetime-local';
    required?: boolean;
  }>;

  let {
    value = $bindable(),
    id,
    name,
    placeholder,
    type = 'date',
    class: cls,
    error = undefined,
    required = false
  }: DatePickerProps = $props();

  let rawValue = $state(type === 'date' ? toDate(value) : toDateTime(value));

  $effect(() => {
    const str = untrack(() => (type === 'date' ? toDate(value) : toDateTime(value)));
    if (rawValue) {
      untrack(() => (value = new Date(rawValue)));
    } else if (str !== rawValue) {
      rawValue = str;
    }
  });
</script>

<input
  {id}
  {type}
  {name}
  {placeholder}
  {required}
  bind:value={rawValue}
  class={twMerge(
    'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
    error !== undefined ? 'border-red-500' : '',
    clsx(cls)
  )}
/>
