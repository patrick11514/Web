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
        error = undefined,
        required = false
    }: FormElement<{
        value?: string | number | undefined | null;
        id?: string;
        name?: string;
        placeholder?: string;
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
        required?: boolean;
    }> = $props();
</script>

<input
    {id}
    {type}
    {name}
    {placeholder}
    {required}
    bind:value
    class={twMerge(
        'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
        error !== undefined ? 'border-red-500' : '',
        clsx(cls)
    )}
/>
