<script lang="ts">
    import { clsx } from 'clsx';
    import { twMerge } from 'tailwind-merge';
    import type { FormElement } from '$/types/types';

    let {
        value = $bindable(),
        id,
        name,
        placeholder,
        type = 'text',
        class: cls,
        error = $bindable(undefined)
    }: FormElement<{
        value?: string | number | undefined | null;
        id?: string;
        name?: string;
        placeholder?: string;
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    }> = $props();

    let element: HTMLInputElement | null = null;

    $effect(() => {
        if (element) {
            element.setCustomValidity(error ?? '');
        }
    });
</script>

<input
    bind:this={element}
    {id}
    {type}
    {name}
    {placeholder}
    bind:value
    class={twMerge(
        'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold invalid:border-red-500 lg:text-2xl',
        clsx(cls)
    )}
/>
