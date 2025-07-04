<script lang="ts">
  import clsx from 'clsx';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  let { children, class: cls, value = $bindable(), ...props }: HTMLSelectAttributes = $props();
</script>

<select
  bind:value
  class={twMerge('border-secondary focus:border-primary font-roboto rounded-md border-2 px-2 py-1.5 text-xl font-bold transition-colors duration-200 lg:text-2xl', clsx(cls))}
  {...props}
>
  {@render children?.()}
</select>
