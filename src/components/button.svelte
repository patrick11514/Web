<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    const {
        children,
        type = 'button',
        class: cls = '',
        ...rest
    }: {
        type?: 'button' | 'reset' | 'submit';
        class?: string;
    } & HTMLButtonAttributes = $props();
</script>

<button
    {...rest}
    class={twMerge('m-2 rounded-md bg-secondary px-4 py-2 font-ubuntu text-xl font-bold transition-all duration-200 hover:bg-accent active:translate-y-0.5', cls)}
    {type}
>
    {@render children?.()}
</button>
