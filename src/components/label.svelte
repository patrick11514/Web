<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let id: string = '';
    let cls = '';
    export { id as for };
    export { cls as class };
</script>

<label class={twMerge('font-ubuntu text-2xl font-bold 3xl:text-3xl', cls)} for={id}><slot /></label>
