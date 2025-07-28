<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type LinkProps = {
    link: string;
    target?: HTMLAnchorAttributes['target'];
    class?: string;
    children: Snippet;
  };

  const { link, target = null, class: cls = '', children }: LinkProps = $props();
</script>

<a href={link} {target} class={twMerge('text-primary-text', cls)}>
  {@render children()}
</a>
