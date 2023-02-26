<script lang="ts">
    import Technologies from './technologies.svelte'
    import Age from './age.svelte'
    import Projects from './projects.svelte'
    import Contact from './contact.svelte'

    function getYear() {
        let year = 2021
        let current = new Date().getFullYear()

        if (current > year) {
            return `${year}-${current}`
        }
        return current
    }
</script>

<div id="card" class="m-auto py-4 px-10 rounded-xl w-full md:w-11/12 h-auto bg-gray-900 text-white text-center duration-500">
    <img class="mx-auto min-w-100 w-2/24 rounded-3xl" src="/logo.png" alt="Logo" />
    <h1 class="mx-auto my-5 w-max border-b-2 border-white text-4xl font-bold">Patrik Mintěl</h1>
    <Age />
    <span class="mx-auto text-xl">
        Jmenuji se Patrik Mintěl, aktuálně studuji
        <a href="https://www.vsb.cz/" target="_blank" rel="noreferrer" class="underline font-bold text-blue-500">Vysokou školu Báňskou v Ostravě</a>
        na oboru
        <a href="https://www.fei.vsb.cz/" target="_blank" rel="noreferrer" class="underline font-bold text-blue-500">Informatika</a>. Dělám převážně webové aplikace, či discord
        boty, kdy ui webových aplikací převážně jejich funkčnost, nad designem. Většinu programuji v jazyku TypeScript, který je nadstavbou JavaScriptu. Když už dělám design,
        využívám framework
        <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" class="underline font-bold text-blue-500">TailWindCSS</a>.
    </span>
    <Technologies />
    <Contact />
    <Projects />

    <span>&copy; Patrik Mintěl {getYear()}</span>
</div>

<style type="text/scss">
    @import './style.scss';
</style>
