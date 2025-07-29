<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import { getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';

  type TextAreaProps = SvelteHTMLElements['textarea'] & {
    name: string;
    label: string;
  };
  const { name, class: cls = '', placeholder, label }: TextAreaProps = $props();

  const context = getFormContext();

  const id = `form-${name}`;
</script>

<FormItem for={id} error={context.errors()[name]} {label}>
  <textarea
    {id}
    {name}
    bind:value={context.data[name]}
    {placeholder}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
      context.errors()[name] !== undefined ? 'border-red-500' : '',
      clsx(cls)
    )}
  ></textarea>
</FormItem>
