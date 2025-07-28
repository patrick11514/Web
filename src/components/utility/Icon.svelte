<script lang="ts">
  import type { BootstrapIcon } from '$/types/bootstrap_icons';
  import type { SvelteHTMLElements } from 'svelte/elements';

  type IconProps = SvelteHTMLElements['i'] & {
    class?: string;
    name: BootstrapIcon;
  };

  const { children, class: cls = '', name, ...rest }: IconProps = $props();
</script>

<i {...rest} role="button" tabindex="-1" class="bi {name} {cls}">
  {@render children?.()}
</i>
