<script lang="ts">
  import { clsx } from 'clsx';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import { getFormContext } from './Form.svelte';

  type ButtonProps = HTMLButtonAttributes;

  const { children, class: cls, onclick = () => {}, ...rest }: ButtonProps = $props();

  const context = getFormContext(false);
</script>

<button
  onclick={context.onSubmitHandler ?? onclick}
  {...rest}
  class={twMerge(
    'border-secondary hover:border-primary font-roboto w-max cursor-pointer rounded-md border-2 px-4 py-1 text-xl font-bold transition-all duration-200 active:translate-y-0.5 disabled:grayscale lg:text-2xl',
    clsx(cls)
  )}
>
  {@render children?.()}
</button>
