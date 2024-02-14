<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };
</script>

<p class={twMerge('mt-2 whitespace-pre-wrap font-ubuntu text-lg 3xl:text-xl', cls)}><slot /></p>
