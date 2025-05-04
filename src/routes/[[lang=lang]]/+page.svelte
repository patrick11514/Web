<script lang="ts">
    import RichText from '$/components/utility/RichText.svelte';
    import { getState } from '$/lib/state.svelte';
    import Starback from 'starback';
    import { onMount } from 'svelte';

    const _state = getState();

    const birthday = new Date(2003, 4, 1, 7);

    const getAge = () => {
        const diff = Date.now() - birthday.getTime();
        const age = diff / (1000 * 60 * 60 * 24 * 365.25);
        return age.toFixed(12);
    };

    let age = $state(getAge());

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

        const intervalId = setInterval(() => {
            age = getAge();
        }, 50);

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            clearInterval(intervalId);
            starback.destroy();

            window.removeEventListener('resize', resizeCanvas);
        };
    });
</script>

<canvas bind:this={canvas} class="absolute inset-0 -z-10 h-full w-full overflow-hidden"></canvas>

<div class="mx-auto my-auto flex w-full flex-col items-center justify-center gap-16 md:w-[90%] lg:w-[80%] lg:flex-row xl:w-[70%]">
    <div class="aspect-square max-w-96 overflow-hidden rounded-full">
        <picture>
            <source srcset="/images/Image-400.webp 400w, /images/Image-800.webp 800w" type="image/webp" sizes="(max-width: 640px) 400px, 800px" />
            <source srcset="/images/Image-400.jpg 400w, /images/Image-800.jpg 800w" type="image/jpeg" sizes="(max-width: 640px) 400px, 800px" />
            <img src="/images/Image-400.jpg" alt="Profile IMG" loading="lazy" class="h-full w-full object-cover object-center" />
        </picture>
    </div>
    <div class="flex w-[80%] flex-col items-center md:w-1/2 md:items-start">
        <h1 class="text-4xl font-bold lg:text-5xl">Patrik Mintěl</h1>
        <h2 class="border-t-text mb-8 w-max border-t-2">{_state.lang.main.age}: {age}</h2>
        <h3 class="text-center text-xl md:text-left lg:text-2xl"><RichText text={_state.lang.main.text} /></h3>
    </div>
</div>
