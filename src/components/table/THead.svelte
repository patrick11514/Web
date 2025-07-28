<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  type THeadProps = SvelteHTMLElements['thead'];

  const { children, class: cls = '', ...props }: THeadProps = $props();
</script>

<thead class={cls} {...props}>
  {@render children?.()}
</thead>
