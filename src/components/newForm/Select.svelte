<script lang="ts">
  import clsx from 'clsx';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import { getError, getFormContext, getValue, setValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  type SelectProps = HTMLSelectAttributes & {
    name: string;
    label: string;
  };

  let {
    name,
    label,
    class: cls = '',
    value = $bindable(''),
    children
  }: SelectProps = $props();

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

  <select
    {id}
    {name}
    bind:value={formValue}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto rounded-md border-2 px-2 py-1.5 text-xl font-bold transition-colors duration-200 lg:text-2xl',
      getError(context, name) !== undefined ? 'border-red-500' : '',
      clsx(cls)
    )}
  >
    {@render children?.()}
  </select>
</FormItem>
