<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    let cls = '';
    export { cls as class };
</script>

<div class={twMerge('my-2 flex flex-col', cls)}>
    <slot />
</div>
