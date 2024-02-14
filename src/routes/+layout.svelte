<script lang="ts">
    import { sessionData } from '$/components/store.svelte';
    import { API } from '$/lib/api';
    import 'bootstrap-icons/font/bootstrap-icons.min.css';
    import '../app.css';
    import Navigation from '../components/navigation.svelte';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    sessionData.set(data.sessionData);
    API.hydrateFromServer(data.appData);
</script>

<section class="flex h-full min-h-screen w-full flex-col items-stretch bg-background text-text">
    <Navigation />
    <slot />
    <footer class="mx-auto font-ubuntu font-bold 3xl:text-lg">&copy; Patrik Mintěl 2021 - {new Date().getFullYear()}</footer>
</section>
