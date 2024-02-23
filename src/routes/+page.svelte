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

    let age = calculateAge();

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
    <img class="mx-auto my-4 aspect-square w-[50%] max-w-56 self-center rounded-3xl md:mx-4 md:max-w-96" src="/images/icon.webp" alt="Artwork" />
    <div class="mx-auto flex w-[90%] flex-col text-justify font-fira-sans text-lg md:my-auto lg:text-left lg:text-xl xl:text-2xl">
        <h2 class="text-center font-ubuntu text-3xl font-bold lg:text-4xl xl:text-5xl">Patrik Mintěl</h2>
        <p class="text-center font-roboto">Věk: {age}</p>
        <p class="my-1">
            Aktuálně studuju <Link href="https://www.vsb.cz">Vysokou školu Báňskou</Link> v Ostravě. Přesněji studuji obor Informatika na
            <Link href="http://fei.vsb.cz">fakultě elektrotechniky a informatiky</Link>. Ve volném čase se věnuji programováním a hraním her.
        </p>
        <p class="my-1">
            Nejvíce se věnuji tvorbě webových aplikací a proto nejvíce programuji v
            <Link href="https://www.typescriptlang.org/">TypeScriptu</Link>, kdy se převážně zaměřuji na backend a případně i frontend. U frontendu se převážně zaměřuji na jeho
            funkční část (TypeScript). Aktuální framework, který na tyto účely používám je <Link href="https://kit.svelte.dev/">SvelteKit</Link>. Když už zavítám do designu
            webových stránek, tak využívám <Link href="https://tailwindcss.com/">Tailwind CSS</Link>.
        </p>
        <p class="my-1">Mimo tvorbu webových aplikací se věnuji i tvorbě jiných aplikací v NodeJS, jako jsou Discord boti, Twitch boti a podobně.</p>
    </div>
</section>
