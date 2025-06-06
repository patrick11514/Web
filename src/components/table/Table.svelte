<script lang="ts">
    import clsx from 'clsx';
    import type { HTMLTableAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    const { children, class: cls = '', ...props }: HTMLTableAttributes = $props();
</script>

<table class={twMerge('w-full table-auto', clsx(cls))} {...props}>
    {@render children?.()}
</table>
