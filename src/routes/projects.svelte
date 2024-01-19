<script lang="ts">
    let tags = [
        {
            name: 'PHP',
            link: 'https://www.php.net/',
            color: 'bg-blue-500'
        },
        {
            name: 'HTML',
            color: 'bg-red-500'
        },
        {
            name: 'JS',
            color: 'bg-yellow-500'
        },
        {
            name: 'TS',
            color: 'bg-blue-300'
        },
        {
            name: 'CSS',
            color: 'bg-blue-700'
        },
        {
            name: 'SCSS',
            color: 'bg-pink-500'
        },
        {
            name: 'TailWindCSS',
            color: 'bg-green-500'
        },
        {
            name: 'Discord.js',
            color: 'bg-purple-500'
        },
        {
            name: 'Svelte',
            color: 'bg-red-300'
        },
        {
            name: 'NextJS',
            color: 'bg-blue-700'
        },
        {
            name: 'Společně se Skypad6000',
            color: 'bg-blue-800'
        }
    ]

    let projects: Array<{
        name: string
        link?: string
        description: string
        tags: string[]
        folder: string
        images: number | Array<string>
        date: number
    }> = [
        {
            name: 'SurprisePlay.eu Info Panel',
            link: 'https://info.surpriseplay.eu',
            description: 'Panel pro zobrazení dat z Minecraft Serveru. Obsahoval Ticket systém, Todo list, nastavení účtu a další...',
            tags: ['HTML', 'JS', 'PHP', 'SCSS', 'Společně se Skypad6000'],
            folder: 'sp-infopanel',
            images: 1,
            date: 1589733265000
        },
        {
            name: 'Počítání Q-Testu',
            link: 'https://sch.patrick115.eu/beta-prumer/',
            description: 'PHP aplikace na počítání Q-Testu a poté Lodrova Testu. Využíváno na škole.',
            tags: ['HTML', 'PHP', 'CSS'],
            folder: 'qtest',
            images: 4,
            date: 1646348400000
        },
        {
            name: 'Rovnice z grafu',
            link: 'https://sch.patrick115.eu/rovnice_z_grafu/',
            description: 'JS aplikace na počítání rovnice z grafu, kdy se zadá počet bodů a jejich souřadnice (hodnoty x a y osy).',
            tags: ['HTML', 'JS', 'SCSS'],
            folder: 'rovnice_z_grafu',
            images: 4,
            date: 1641855600000
        },
        {
            name: 'GameRealms.cz Discord Bot',
            description:
                'DiscordBot pro Minecraftový server GameRealms. Discord bot umí tickety, návrhy, přidávat levely uživatelům podle napsaných zpráv, generovat changelogy, zobrazovat nové boostery Discord Serveru, případně základní hlídání chatu podle regexu.',
            tags: ['TS', 'Discord.js'],
            folder: 'gamerealms',
            images: 4,
            date: 1657836000000
        },
        {
            name: 'Hostuj.eu',
            description:
                'Web pro hosting serverů. Obsahuje kompletní systém od objednání, až po zaplacení serveru. Lze přes něho ovládat servery, procházet soubory na serveru. Server běží na Pterodactyl Panelu a a jsou ovládany přes API. V Panelu je také správa uživatelů, serverů a ticket systém.',
            tags: ['HTML', 'TS', 'SCSS', 'NextJS', 'Společně se Skypad6000'],
            folder: 'hostuj',
            images: 9,
            date: 1667602800000
        },
        {
            name: 'Arconix.eu Status Bot',
            description:
                'Discord bot pro server Arconix.eu na zobrazování určitých statusů a jejich procent. Bot má příkaz na přidáni a odebrání statusu a poté na upravení procent daného statusu. Status je poté reprezentovaný určitými emotikony, které se dají nastavit v configu.',
            tags: ['TS', 'Discord.js'],
            folder: 'arconix_status',
            images: 2,
            date: 1674082800000
        },
        {
            name: 'Arconix.eu Bot na návrhy',
            description:
                'Discord bot pro server Arconix.eu na návrhy, které můžou podat hráči za pomocí kliknutí tlačítka podat návrh. Návrh poté ostatní mohou komentovat, případně hlastovat pro to, aby se přidal, či nikoliv. Administrátor poté může návrh schválit, či zamítnout.',
            tags: ['TS', 'Discord.js'],
            folder: 'arconix_suggest',
            images: 4,
            date: 1672959600000
        },
        {
            name: 'Miňonka',
            description:
                'Discord bot pro vlastní použití. Discord bot primárně slouží pro zobrazení informací ze hry League of Legends. Dokáže zobrazit hráčský profil, jeho hodnocení v hodnocených hrách, případně historii zápasů.',
            tags: ['TS', 'Discord.js'],
            folder: 'minonka',
            images: 11,
            date: 1676934000000
        },
        {
            name: 'Moje stránky',
            description: 'Moje stránky, kde se nachází tento projekt.',
            tags: ['HTML', 'TS', 'TailWindCSS', 'Svelte'],
            folder: 'patrick115',
            images: 8,
            date: 1677271527000
        },
        {
            name: 'GameRealms.cz Wiki',
            description: 'Wiki pro minecraftový server GameRealms.cz',
            tags: ['HTML', 'CSS', 'TS', 'Svelte'],
            link: 'https://gamerealms.cz/',
            folder: 'gamerealms_wiki',
            images: 15,
            date: 1687397392000
        },
        {
            name: 'NowPlaying for OBS',
            description: 'Widget, který zobrazuje aktuální písničku na spotify pro OBS, nebo další streamovací aplikace.',
            tags: ['HTML', 'TailWindCSS', 'TS', 'SVELTE'],
            link: 'https://nowplaying.patrick115.eu/',
            folder: 'nowplaying',
            images: ['1.png', '2.png', '3.png', '4.png', '5.gif'],
            date: 1691256474000
        }
    ]

    let currentProjects = prepareImages(projects)
    let selectedTag: string | null = null

    function prepareImages(proj: typeof projects) {
        return proj
            .map((p) => {
                return {
                    name: p.name,
                    description: p.description,
                    link: p.link,
                    tags: p.tags,
                    //date to dd.MM.YYYY
                    date: new Date(p.date).toLocaleDateString('cs-CZ'),
                    preview: `/projects/${p.folder}/index.png`,
                    images:
                        typeof p.images == 'number'
                            ? Array.from({ length: p.images }, (_, i) => `/projects/${p.folder}/image${i + 1}.png`)
                            : p.images.map((image) => {
                                  return `/projects/${p.folder}/${image}`
                              })
                }
            })
            .toReversed()
    }

    function tagClick(tag: string) {
        if (selectedTag) {
            if (selectedTag === tag) {
                selectedTag = null
                currentProjects = prepareImages(projects)
                return
            }
        }

        selectedTag = tag

        currentProjects = prepareImages(projects.filter((proj) => proj.tags.includes(tag)))
    }

    let currentShowed: null | number = null

    let currentImages: string[] = []
    let currentIndex: number = 0

    function showGalery(id: number) {
        if (currentShowed || currentShowed == 0) return

        let project = currentProjects[id]

        let images = []
        images.push(project.preview)
        images.push(...project.images)

        if (images.length == 0) return

        currentShowed = id
        currentImages = images
        currentIndex = 0

        document.querySelector('body')?.classList.add('overflow-y-hidden')
        window.scrollTo(0, 0)
    }

    function changeImage(index: number) {
        currentIndex = index
    }

    function closeGalery(
        this: any,
        ev:
            | (MouseEvent & {
                  currentTarget: EventTarget & HTMLDivElement
              })
            | (KeyboardEvent & {
                  currentTarget: EventTarget & HTMLDivElement
              })
            | (TouchEvent & {
                  currentTarget: EventTarget & HTMLDivElement
              })
    ) {
        let target = ev.target as HTMLDivElement
        let currentTarget = ev.currentTarget as HTMLDivElement

        if (target != currentTarget) return

        currentShowed = null
        currentImages = []
        currentIndex = 0

        document.querySelector('body')?.classList.remove('overflow-y-hidden')
        document.querySelector('#projects')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }
</script>

<div id="projects" class="mt-1 flex flex-col">
    <h2 class="mx-auto mb-2 w-max text-4xl font-bold">Moje projekty</h2>
    <div class="mx-auto p-2 w-2/4 bg-gray-700 rounded-t-lg">
        {#each tags as tag}
            <button
                class={`m-1 px-2 min-w-24 min-h-8 rounded-md ${tag.color} font-bold` + (tag.name == selectedTag ? ' border-2 border-white' : '')}
                on:click={() => tagClick(tag.name)}
            >
                {tag.name}
            </button>
        {/each}
    </div>
    <div class="mx-auto w-23/24 p-4  bg-gray-700 rounded-xl duration-700">
        {#if currentProjects.length == 0}
            <h1 class="text-2xl font-bold">Nenalezeny žádné projekty</h1>
        {:else}
            <div class="mx-auto w-full grid lg:grid-cols-2 2xl:grid-cols-3 grid-cols-1">
                {#each currentProjects as project, index}
                    <div>
                        <div class="m-1 p-4 rounded-xl bg-slate-800">
                            {#if project?.link}
                                <a href={project.link} class="text-2xl font-bold hover:text-blue-600 duration-200 border-b-4 border-b-white" target="_blank" rel="noreferrer">
                                    {project.name}
                                </a>
                            {:else}
                                <h2 class="text-2xl font-bold">{project.name}</h2>
                            {/if}
                            <h4 class="text-md">{project.description}</h4>
                            <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1">
                                {#each tags.filter((tag) => {
                                    if (project.tags.includes(tag.name)) return true
                                    return false
                                }) as tag}
                                    <button
                                        class={`m-1 px-2 min-w-max min-h-8 rounded-md ${tag.color} font-bold` + (tag.name == selectedTag ? ' border-2 border-white' : '')}
                                        on:click={() => tagClick(tag.name)}>{tag.name}</button
                                    >
                                {/each}
                            </div>
                            <img on:click={() => showGalery(index)} on:keypress={() => showGalery(index)} src={project.preview} alt="Project preview" tabIndex="0" />
                            <h6>{project.date}</h6>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
        <h2 class="my-2 font-bold text-2xl">Další moje projekty můžete najít například na githubu níže.</h2>
    </div>
</div>

{#if currentShowed || currentShowed == 0}
    <div
        on:click={(e) => closeGalery(e)}
        on:keydown={(e) => closeGalery(e)}
        on:keypress={(e) => closeGalery(e)}
        class="w-screen h-screen top-0 left-0 absolute bg-black bg-opacity-40 flex"
        tabIndex="0"
    >
        <div class="my-8 mx-6 p-4 w-full bg-slate-700 rounded-xl flex flex-col">
            <h2 class="mb-2 font-bold text-lg">Zavřete kliknutím mimo kartu</h2>
            <div class="mx-auto max-w-15/24 h-[70%] overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-gray-500">
                <img class="mx-auto" src={currentImages[currentIndex]} alt="Selected img" />
            </div>
            <div class="mt-4 overflow-x-scroll h-[30%] flex scrollbar scrollbar-track-transparent scrollbar-thumb-gray-500">
                {#each currentImages as image, index}
                    {#if index == currentIndex}
                        <img class="mx-2 max-h-72 border-4 border-white" src={image} alt="List" />
                    {:else}
                        <img
                            class="mx-2 max-h-72 border-4 border-transparent"
                            on:click={() => changeImage(index)}
                            on:keypress={() => changeImage(index)}
                            src={image}
                            alt="List"
                            tabIndex="0"
                        />
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}
