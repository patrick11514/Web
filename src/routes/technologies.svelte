<script lang="ts">
    const technologies = [
        {
            name: 'CSS',
            sub: [
                {
                    name: 'Vanilla CSS',
                    text: 'Čisté CSS, bez frameworků využívám jen zřídka, pouze na nějaké jednoduché úpravy, když potřebuji něco rychle udělat.'
                },
                {
                    name: 'TailwindCSS',
                    link: 'https://tailwindcss.com/',
                    text: 'Pokud pracuji s CSS, tak využívám TailwindCSS, jedná se o jednoduchý framework, který vám umožní rychle napsat CSS pomocí tříd, které jsou předdefinované, jako například text-center pro vycentrování textu.'
                }
            ]
        },
        {
            name: 'JS/TS',
            sub: [
                {
                    name: 'Vanilla JS',
                    status: 'Pokročilý',
                    text: 'Čístý JavaScript vyžívám, když si potřebuji napsat nějaký rychlý prográmek.'
                },
                {
                    name: 'NodeJS',
                    link: 'https://nodejs.org/',
                    text: 'NodeJS využívám hlavně na tvorbu discord botů a dalších aplikací, které jsou potřeba běžet na serveru a né v prohlížeči.'
                },
                {
                    name: 'TypeScript',
                    link: 'https://www.typescriptlang.org/',
                    text: 'TypeScript je nádstavba JavaScriptu, která přídává statickou typizaci, která vám umožní lépe psát kód a odhalit jednodouchou typovou chybu před tím, než se dostane do produkce.'
                },
                {
                    name: 'NextJS',
                    link: 'https://nextjs.org/',
                    text: 'Jedná se o JavaScript framework, který slouží pro tvorbu webových aplikací. Setkal jsem se s ním na jednom projektu, kde jsme ho využívali, jak na frontend, tak backend. Framework běží na jednom z populárních frameworků ReactJS.'
                },
                {
                    name: 'Svelte',
                    link: 'https://svelte.dev/',
                    text: 'Jedná se opět o JavaScript framework, s kterým se momentálně učím.'
                },
                {
                    name: 'Discord.js',
                    link: 'https://discord.js.org/#/',
                    text: 'Jedná se o JavaScript knihovnu, která slouzí pro tvorbů botů na platformě Discord. Jedná se o nejpopulárnější knihovnu pro NodeJS'
                }
            ]
        },
        {
            name: 'PHP',
            link: 'https://www.php.net/',
            text: 'Jedná se o programovací jazyk pro webové aplikace. Kód se prvně spustí na serveru, kde se zpracuje a výsledek se odešle do prohlížeče. Jazyk jsem pravidelně využíval do 31.8.2022 (+- 4 roky), kdy jsem ho vyměnil za JavaScript.'
        },
        {
            name: 'TOOLS',
            sub: [
                {
                    name: 'GitHub',
                    link: 'https://github.com',
                    text: 'Github je platforma, která slouží pro ukládání a sdílení kódů mezi vývojáři. Jedná se o úložiště pro nástroj zvaný Git. Git je nástroj, který slouží pro správu verzí vašeho projektu. Tedy zaznamenává, kdy, kdo, co upravil v kódu a každou změnu si může nějak pojmenovat. Ke změnám se může zpětně vracet. Github navíc umožňuje ostatním vývojářům příspívat k vašemu kódu.'
                },
                {
                    name: 'VS Code',
                    link: 'https://code.visualstudio.com/',
                    text: 'Jedná se o textový editor, který je mezi vývojáři velmi oblíbený, díky širokému výběru rozšíření, která umožňují tento editor využít na mnoho různých programovacích jazyků.'
                }
            ]
        }
    ]

    let lastTarget: HTMLButtonElement | null = null
    let currentTechnology: {
        name: string
        link?: string
        text?: string
        sub?: Array<{
            name: string
            link?: string
            text: string
        }>
    } | null = null

    async function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    let translating = false

    async function showData(
        ev: MouseEvent & {
            currentTarget: EventTarget & HTMLButtonElement
        }
    ) {
        if (translating) return

        let target = ev.target as HTMLButtonElement
        let text = target.innerText

        let data = technologies.find((tech) => tech.name === text)

        if (!data) return

        let elem = document.getElementById('data')
        if (!elem) return

        elem.classList.add('max-h-0', 'opacity-0', 'overflow-hidden')
        elem.classList.remove('max-h-50')

        translating = true

        if (target.classList.contains('bg-gray-800')) {
            lastTarget = null
            target.classList.add('bg-gray-700')
            target.classList.remove('bg-gray-800')
            await sleep(700)
            currentTechnology = null
            translating = false
            return
        }

        if (lastTarget) {
            lastTarget.classList.add('bg-gray-700')
            lastTarget.classList.remove('bg-gray-800')

            await sleep(700)
        }

        target.classList.add('bg-gray-800')
        target.classList.remove('bg-gray-700')

        elem.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden')
        elem.classList.add('max-h-50')

        lastTarget = target

        currentTechnology = data

        translating = false
    }
</script>

<h2 class="mx-auto pt-3 text-4xl font-bold">Technologie, které využívám s určitými jazyky:</h2>
<div class="mx-auto flex flex-col sm:flex-row text-2xl font-bold duration-500">
    {#each technologies as technology, index}
        {#if index == 0}
            <button
                on:click={showData}
                class="mx-2 sm:ml-auto sm:mr-2 my-1 p-1 min-w-100 bg-gray-700 border-black border-2 rounded-lg duration-300 hover:bg-slate-800"
                disabled={translating}
            >
                {technology.name}
            </button>
        {:else if index == 3}
            <button
                on:click={showData}
                class="mx-2 sm:mr-auto sm:ml-2 my-1 p-1 min-w-100 bg-gray-700 border-black border-2 rounded-lg duration-300 hover:bg-slate-800"
                disabled={translating}
            >
                {technology.name}
            </button>
        {:else}
            <button on:click={showData} class="mx-2 my-1 p-1 min-w-100 bg-gray-700 border-black border-2 rounded-lg duration-300 hover:bg-slate-800" disabled={translating}>
                {technology.name}
            </button>
        {/if}
    {/each}
</div>

<div id="data" class="mx-auto flex mt-4 mb-1 w-23/24 sm:w-3/4 h-max max-h-0 overflow-hidden opacity-0 p-4 flex-col bg-gray-700 rounded-xl duration-700 ">
    {#if currentTechnology}
        {#if currentTechnology.link}
            <a
                class="mx-auto text-5xl font-bold hover:text-blue-600 duration-200 border-b-4 border-b-white hover:border-b-blue-600"
                href={currentTechnology.link}
                target="_blank"
                rel="noreferrer"
            >
                {currentTechnology.name}
            </a>
        {:else}
            <h1 class="text-5xl font-bold">{currentTechnology.name}</h1>
        {/if}

        {#if currentTechnology.text}
            <h2 class="text-2xl">{currentTechnology.text}</h2>
        {/if}

        {#if currentTechnology.sub}
            {#each currentTechnology.sub as subTech}
                <div class="py-5 flex flex-col">
                    {#if subTech.link}
                        <a
                            class="w-max text-left text-3xl font-bold hover:text-blue-600 duration-200 border-b-4 border-b-white hover:border-b-blue-600"
                            href={subTech.link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {subTech.name}
                        </a>
                    {:else}
                        <h2 class="text-left text-3xl font-bold">{subTech.name}</h2>
                    {/if}
                    <span class="text-2xl text-left">{subTech.text}</span>
                </div>
            {/each}
        {/if}
    {/if}
</div>
