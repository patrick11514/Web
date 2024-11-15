<script lang="ts">
    import { sessionData } from '$/components/store.svelte';
    import { API } from '$/lib/api';
    import 'bootstrap-icons/font/bootstrap-icons.min.css';
    import '../app.css';
    import Navigation from '../components/navigation.svelte';
    import type { PageData } from './$types';
    import type { Snippet } from 'svelte';

    const { children: children, data }: { children: Snippet; data: PageData } = $props();

    sessionData.set(data.sessionData);
    API.hydrateFromServer(data.appData);
</script>

<section class="flex h-full min-h-screen w-full flex-col items-stretch bg-background text-text">
    <Navigation />
    {@render children()}
    <footer class="mx-auto font-ubuntu font-bold 3xl:text-lg">&copy; Patrik Mintěl 2021 - {new Date().getFullYear()}</footer>
</section>
