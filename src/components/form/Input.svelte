<script lang="ts">
    import { clsx } from 'clsx';
    import { twMerge } from 'tailwind-merge';
    import type { FormElement } from '$/types/types';

    type NumberInput = {
        type: 'number';
        value?: number | undefined | null;
        min?: number;
        max?: number;
    };

    type TextInput = {
        type?: 'text' | 'email' | 'password' | 'tel' | 'url';
        value?: string | undefined | null;
    };

    let {
        value = $bindable(),
        id,
        name,
        placeholder,
        type = 'text',
        class: cls,
        error = undefined,
        required = false,
        ...props
    }: FormElement<
        (NumberInput | TextInput) & {
            id?: string;
            name?: string;
            placeholder?: string;
            required?: boolean;
        }
    > = $props();
</script>

<input
    {id}
    {type}
    {name}
    {placeholder}
    {required}
    {...props}
    bind:value
    class={twMerge(
        'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
        error !== undefined ? 'border-red-500' : '',
        clsx(cls)
    )}
/>
