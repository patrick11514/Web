<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };
    export let center = false;
</script>

<h2 class={twMerge('w-full text-center font-ubuntu text-2xl font-bold 3xl:text-3xl', cls)} class:my-auto={center}>
    <slot />
</h2>
