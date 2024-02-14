<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };
</script>

<div class={twMerge('flex flex-col', cls)}>
    <slot />
</div>
