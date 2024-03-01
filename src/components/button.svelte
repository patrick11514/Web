<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    export let type: 'button' | 'reset' | 'submit' = 'button';
    let cls = '';
    export { cls as class };
</script>

<button
    class={twMerge('m-2 rounded-md bg-secondary px-4 py-2 font-ubuntu text-xl font-bold transition-all duration-200 hover:bg-accent active:translate-y-0.5', cls)}
    {type}
    on:click
>
    <slot />
</button>
