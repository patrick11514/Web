<script lang="ts">
    import '../../app.css';
    import '../../fonts.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    import { API } from '$/lib/api';
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import { setLanguage, setPath } from '$/lib/lang/index.svelte';
    import Navigation from '$/components/Navigation.svelte';
    import { page } from '$app/state';

    let { children, data }: { children: Snippet; data: LayoutData } = $props();

    API.hydrateFromServer(data.api);
    setLanguage(data.lang);
    setPath(page.url.pathname, data.languageList);
</script>

<main class="bg-background text-text font-roboto flex h-full min-h-screen w-full min-w-screen flex-col">
    <Navigation />

    {@render children()}
</main>
