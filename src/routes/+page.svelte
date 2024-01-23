<script lang="ts">
    import Link from '$/components/link.svelte'
    import { onMount } from 'svelte'
    import Navigation from '../components/navigation.svelte'

    const born = new Date(2003, 4, 1, 7)

    let age = 'Načítání...'

    const calculateAge = () => {
        const now = new Date()
        const diff = now.getTime() - born.getTime()

        const years = diff / (1000 * 60 * 60 * 24 * 365.25)

        age = years.toFixed(12)
    }

    onMount(() => {
        calculateAge()
        const timer = setInterval(calculateAge, 25)

        return () => {
            clearInterval(timer)
        }
    })
</script>

<Navigation />

<div class="flex h-full w-full flex-col">
    <img class="mx-auto my-4 h-auto w-[50%] rounded-3xl" src="/images/icon.png" alt="Artwork" />
    <div class="mx-auto flex w-[90%] flex-col text-justify font-fira-sans text-lg">
        <h2 class="text-center font-ubuntu text-3xl font-bold">Patrik Mintěl</h2>
        <p class="text-center font-roboto">Věk: {age}</p>
        <p>
            Jmenuji se Patrik Mintěl a aktuálně studuju <Link href="https://www.vsb.cz">Vysokou školu Báňskou</Link> v Ostravě. Přesněji studuji obor Informatika na <Link
                href="http://fei.vsb.cz">fakultě elektrotechniky a informatiky</Link
            >.
        </p>
        <p>
            Ve volném čase se věnuji programováním a hraním her. Nejvíce se věnuji tvorbě webových aplikací a proto nejvíce programuji v <Link
                href="https://www.typescriptlang.org/">TypeScriptu</Link
            >, kdy se převážně zaměřuji na backend a případně i frontend. U frontendu se převážně zaměřuji na jeho funkční část (TypeScript). Aktuální framework, který na tyto
            účely používám je <Link href="https://kit.svelte.dev/">SvelteKit</Link>. Když už zavítám do designu webových stránek, tak využívám <Link href="https://tailwindcss.com/"
                >Tailwind CSS</Link
            >.
        </p>
    </div>
</div>
