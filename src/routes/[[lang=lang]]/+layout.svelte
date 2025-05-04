<script lang="ts">
    import '../../app.css';
    import '../../fonts.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    import { API } from '$/lib/api';
    import { type Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import Navigation from '$/components/Navigation.svelte';
    import { page } from '$app/state';
    import { setState } from '$/lib/state.svelte';
    import { getPath } from '$/lib/lang';
    import Footer from '$/components/Footer.svelte';

    let { children, data }: { children: Snippet; data: LayoutData } = $props();

    API.hydrateFromServer(data.api);

    setState({
        lang: data.lang,
        selectedLang: data.selectedLang,
        languages: data.languageList,
        path: getPath(page.url.pathname, Object.keys(data.languageList))
    });

    $effect(() => {
        setState({
            lang: data.lang,
            selectedLang: data.selectedLang,
            path: getPath(page.url.pathname, Object.keys(data.languageList))
        });
    });
</script>

<section class="text-text font-ubuntu flex h-full min-h-screen w-full min-w-screen flex-col text-lg lg:text-xl">
    <Navigation />

    <main class="flex flex-1 flex-col">
        {@render children()}
    </main>

    <Footer />
</section>
