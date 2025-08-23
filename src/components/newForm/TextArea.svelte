<script lang="ts">
  import clsx from 'clsx';
  import { untrack } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import BaseTextArea from '../form/TextArea.svelte';
  import { getError, getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  import type { Snippet } from 'svelte';
  type TextAreaProps = SvelteHTMLElements['textarea'] & {
    name: string;
    label: string;
    variant?: 'small' | 'normal';
    right?: Snippet;
  };

  let {
    name,
    label,
    class: cls = '',
    placeholder,
    variant,
    right: _right
  }: TextAreaProps = $props();

  const context = getFormContext();

  const id = `form-${name}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let formValue = $state<any>(
    context.multiLang
      ? context.data[context.lang.selectedLanguage][name]
      : context.data[name]
  );

  $effect(() => {
    if (context.multiLang) {
      context.data[untrack(() => context.lang.selectedLanguage)][name] = formValue;
    } else {
      context.data[name] = formValue;
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

<FormItem for={id} error={getError(context, name)} {label} {variant}>
  {#snippet right()}
    {#if _right}
      {@render _right()}
    {/if}
    {#if context.multiLang}
      <TranslationAvailability {context} path={name} />
    {/if}
  {/snippet}

  <BaseTextArea
    {id}
    {name}
    bind:value={formValue}
    {placeholder}
    error={getError(context, name)}
    class={clsx(cls)}
  />
</FormItem>
