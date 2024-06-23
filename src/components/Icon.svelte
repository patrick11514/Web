<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    let cls = '';
    export { cls as class };
    export let name: BootstrapIcon;
</script>

<i on:click on:keypress role="button" tabindex="-1" class="bi {name} {cls}"><slot /></i>
