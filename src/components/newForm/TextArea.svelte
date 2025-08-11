<script lang="ts">
  import clsx from 'clsx';
  import { untrack } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import { getError, getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  type TextAreaProps = SvelteHTMLElements['textarea'] & {
    name: string;
    label: string;
    value?: string | undefined | null;
  };

  let {
    name,
    label,
    class: cls = '',
    placeholder,
    value = $bindable('')
  }: TextAreaProps = $props();

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
    if (context) {
      if (context.multiLang) {
        context.data[untrack(() => context.lang.selectedLanguage)][name] = formValue;
      } else {
        context.data[name] = formValue;
      }
    } else {
      value = formValue as typeof value;
    }
  });

  $effect(() => {
    if (context.lang.selectedLanguage) {
      untrack(
        () =>
          (formValue = context.multiLang
            ? context.data[context.lang.selectedLanguage][name]
            : context.data[name])
      );
    }
  });
</script>

<FormItem for={id} error={getError(context, name)} {label}>
  {#snippet right()}
    {#if context.multiLang}
      <TranslationAvailability {context} path={name} />
    {/if}
  {/snippet}

  <textarea
    {id}
    {name}
    bind:value={formValue}
    {placeholder}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
      getError(context, name) !== undefined ? 'border-red-500' : '',
      clsx(cls)
    )}
  ></textarea>
</FormItem>
