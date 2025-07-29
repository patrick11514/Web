<script lang="ts">
  import clsx from 'clsx';
  import { twMerge } from 'tailwind-merge';
  import { getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';

  type DatePickerProps = {
    name: string;
    label: string;
    class?: string;
    placeholder?: string;
    type?: 'date' | 'datetime-local';
  };

  const {
    name,
    class: cls = '',
    placeholder,
    type = 'date',
    label
  }: DatePickerProps = $props();

  const context = getFormContext();

  const id = `form-${name}`;
</script>

<FormItem for={id} error={context.errors()[name]} {label}>
  <input
    {id}
    {name}
    {type}
    bind:value={context.data[name]}
    {placeholder}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
      context.errors()[name] !== undefined ? 'border-red-500' : '',
      clsx(cls)
    )}
  />
</FormItem>
