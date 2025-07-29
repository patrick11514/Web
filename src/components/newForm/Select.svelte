<script lang="ts">
  import clsx from 'clsx';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import { getFormContext } from './Form.svelte';
  import FormItem from './FormItem.svelte';

  type SelectProps = HTMLSelectAttributes & {
    name: string;
    label: string;
  };
  const { name, class: cls = '', children, label }: SelectProps = $props();

  const context = getFormContext();

  const id = `form-${name}`;
</script>

<FormItem for={id} error={context.errors()[name]} {label}>
  <select
    {id}
    {name}
    bind:value={context.data[name]}
    class={twMerge(
      'border-secondary focus:border-primary font-roboto rounded-md border-2 px-2 py-1.5 text-xl font-bold transition-colors duration-200 lg:text-2xl',
      clsx(cls)
    )}
  >
    {@render children?.()}
  </select>
</FormItem>
