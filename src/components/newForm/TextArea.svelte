<script lang="ts">
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import BaseTextArea from '../form/TextArea.svelte';
  import { getError, getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

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
    right: _right,
    value = $bindable()
  }: TextAreaProps = $props();

  const context = getFormContext();
  const id = `form-${name}`;

  let formValue = $state<unknown>(
    context.multiLang
      ? (context.data[context.lang.selectedLanguage] as Record<string, unknown>)[name]
      : context.data[name]
  );

  $effect(() => {
    const val = value;

    untrack(() => {
      formValue = val;
    });
  });

  $effect(() => {
    const val = formValue;

    untrack(() => {
      value = val as string | number | string[] | undefined;
    });
  });

  $effect(() => {
    const value = formValue;

    untrack(() => {
      if (context.multiLang) {
        (
          context.data[untrack(() => context.lang.selectedLanguage)] as Record<
            string,
            unknown
          >
        )[name] = value;
      } else {
        context.data[name] = value;
      }
    });
  });

  $effect(() => {
    if (context.lang.selectedLanguage) {
      untrack(
        () =>
          (formValue = context.multiLang
            ? (context.data[context.lang.selectedLanguage] as Record<string, unknown>)[
                name
              ]
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
    bind:value={formValue as string}
    {placeholder}
    error={getError(context, name)}
    class={clsx(cls)}
  />
</FormItem>
