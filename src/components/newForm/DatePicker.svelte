<script lang="ts">
  import clsx from 'clsx';
  import { twMerge } from 'tailwind-merge';
  import { getError, getFormContext, getValue, setValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  type DatePickerProps = {
    name: string;
    label: string;
    placeholder?: string;
    class?: string;
    type?: 'date' | 'datetime-local';
    value?: string | undefined | null;
  };

  let {
    name,
    label,
    placeholder,
    class: cls = '',
    type = 'date',
    value = $bindable('')
  }: DatePickerProps = $props();

  const context = getFormContext(false);

  const id = `form-${name}`;

  let formValue = $state(
    context
      ? context.multiLang
        ? context.data[context.lang.selectedLanguage][name]
        : context.data[name]
      : value
  );

  $effect(() => {
    formValue = getValue(context, name);
  });

  $effect(() => {
    if (context) {
      setValue(context, name, formValue);
    } else {
      value = formValue as typeof value;
    }
  });
</script>

<FormItem for={id} error={getError(context, name)} {label}>
  {#snippet right()}
    {#if context.multiLang}
      <TranslationAvailability {context} path={name} />
    {/if}
  {/snippet}

  <input
    {id}
    {name}
    {type}
    bind:value={formValue}
    {placeholder}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
      getError(context, name) !== undefined ? 'border-red-500' : '',
      clsx(cls)
    )}
  />
</FormItem>
