<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    console.log(data.projects);

    onMount(() => {
        //API.projects();
    });
</script>

Ahoj
