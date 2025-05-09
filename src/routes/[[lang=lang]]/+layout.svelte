<script lang="ts">
    import '../../app.css';
    import '../../fonts.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';

    import { API } from '$/lib/api';
    import { onMount } from 'svelte';
    import type { LayoutProps } from './$types';
    import Navigation from '$/components/Navigation.svelte';
    import { page } from '$app/state';
    import { setState } from '$/lib/state.svelte';
    import { getPath } from '$/lib/lang';
    import Footer from '$/components/Footer.svelte';
    import Starback from 'starback';

    let { children, data }: LayoutProps = $props();

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

    let canvas: HTMLCanvasElement;

    const resizeCanvas = () => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    };

    onMount(() => {
        const starback = Starback.create(canvas, {
            type: 'dot',
            quantity: 250,
            direction: 225,
            randomOpacity: true,
            starSize: [0.1, 0.2, 0.3, 0.4],
            speed: [0.3, 0.5],
            backgroundColor: '#030304',
            width: window.innerWidth,
            height: window.innerHeight
        });
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            starback.destroy();

            window.removeEventListener('resize', resizeCanvas);
        };
    });
</script>

<canvas bind:this={canvas} class="absolute inset-0 -z-10 h-full w-full overflow-hidden"></canvas>

<section class="text-text font-ubuntu flex h-full min-h-screen w-full min-w-screen flex-col text-lg lg:text-xl">
    <Navigation />

    <main class="flex flex-1 flex-col">
        {@render children()}
    </main>

    <Footer />
</section>
