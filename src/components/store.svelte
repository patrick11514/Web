<script lang="ts" context="module">
    import type { LoginData } from '$/types/types';
    import { writable } from 'svelte/store';

    export const sessionData = writable<LoginData>({
        logged: false
    });
</script>
