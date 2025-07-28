<script lang="ts">
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type CardProps = {
    children: Snippet;
    class?: ClassValue;
  };

  const { children, class: cls = '' }: CardProps = $props();
</script>

<div
  class={twMerge(
    'border-text flex w-full flex-col gap-4 rounded-md border-2 p-4',
    clsx(cls)
  )}
>
  {@render children()}
</div>
