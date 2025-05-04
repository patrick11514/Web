<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes } from 'svelte/elements';

    const { link, target = '_self', children }: { link: string; target?: HTMLAnchorAttributes['target']; children: Snippet } = $props();
</script>

<a href={link} {target} class="text-primary-text">
    {@render children()}
</a>
