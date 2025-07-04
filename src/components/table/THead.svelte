<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  const { children, class: cls = '', ...props }: SvelteHTMLElements['thead'] = $props();
</script>

<thead class={cls} {...props}>
  {@render children?.()}
</thead>
