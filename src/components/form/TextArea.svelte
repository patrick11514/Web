<script lang="ts">
    import clsx from 'clsx';
    import type { SvelteHTMLElements } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    let {
        value = $bindable(''),
        class: cls = '',
        error,
        ...props
    }: SvelteHTMLElements['textarea'] & {
        error?: string;
    } = $props();
</script>

<textarea
    bind:value
    class={twMerge(
        'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
        error !== undefined ? 'border-red-500' : '',
        clsx(cls)
    )}
    {...props}
>
</textarea>
