<script lang="ts">
    import Link from '$/components/link.svelte';
    import { onMount } from 'svelte';

    const born = new Date(2003, 4, 1, 7);

    const calculateAge = () => {
        const now = new Date();
        const diff = now.getTime() - born.getTime();

        const years = diff / (1000 * 60 * 60 * 24 * 365.25);

        return years.toFixed(12);
    };

    let age = $state(calculateAge());

    onMount(() => {
        const timer = setInterval(() => {
            age = calculateAge();
        }, 25);

        return () => {
            clearInterval(timer);
        };
    });
</script>

<section class="flex w-full flex-1 flex-col md:my-auto md:flex-row md:px-2 lg:mx-auto lg:w-[80%] xl:w-[75%] 3xl:w-[50%]">
    <div class="mx-auto my-4 flex aspect-square w-[50%] max-w-56 items-center justify-center self-center overflow-hidden rounded-3xl object-fill md:mx-4 md:max-w-96">
        <img src="/images/pfp.jpeg" alt="Me" />
    </div>
    <div class="mx-auto flex w-[90%] flex-col text-justify font-fira-sans text-lg md:my-auto lg:text-left lg:text-xl xl:text-2xl">
        <h2 class="text-center font-ubuntu text-3xl font-bold lg:text-4xl xl:text-5xl">Patrik Mintěl</h2>
        <p class="text-center font-roboto">Věk: {age}</p>
        <p class="my-1">
            Aktuálně studuji <Link href="https://www.vsb.cz">Vysokou školu Báňskou</Link> v Ostravě. Přesněji studuji obor Informatika na
            <Link href="http://fei.vsb.cz">fakultě elektrotechniky a informatiky</Link>. Ve volném čase se věnuji programování, hraním her a
            <Link external={false} href="/gallery">astrofotografování</Link>.
        </p>
        <p class="my-1">
            Nejvíce se věnuji tvorbě webových aplikací ve frameworku <Link href="https://kit.svelte.dev/">SvelteKit</Link>. Zde na frontend a backend primárně využívám
            <Link href="https://www.typescriptlang.org/">TypeScript</Link>. Pokud pracuji zavítám i do designu webové stránky, tak využívám
            <Link href="https://tailwindcss.com/">Tailwind CSS</Link>, ale primárně se zaměřuji na frontend a backend JavaScript.
        </p>
        <p class="my-1">Mimo tvorbu webových aplikací se věnuji i tvorbě jiných aplikací v NodeJS, jako jsou Discord boti, Twitch boti a podobně.</p>
    </div>
</section>
