<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { page } from '$app/stores';
    import { PUBLIC_ORIGIN } from '$env/static/public';
    import Icon from './Icon.svelte';
    import { sessionData } from './store.svelte';

    type NavigationItem = {
        name: string;
        path: string;
        icon: BootstrapIcon;
        start?: boolean;
        login: boolean;
        hidden?: boolean;
    };

    let currentNavItem: NavigationItem | null = null;

    const navigationData: NavigationItem[] = [
        {
            name: 'Domů',
            path: '/',
            icon: 'bi-house-fill',
            login: false
        },
        {
            name: 'Projekty',
            path: '/projects',
            icon: 'bi-braces',
            login: false
        },
        {
            name: 'Kontakt',
            path: '/contact',
            icon: 'bi-person-lines-fill',
            login: false
        },
        {
            name: 'O mně',
            path: '/about',
            icon: 'bi-person-fill',
            login: false
        },
        {
            name: 'Galerie',
            path: '/gallery',
            icon: 'bi-image',
            login: false,
            start: true
        },
        {
            name: 'Admin',
            path: '/admin',
            icon: 'bi-tools',
            login: true,
            start: true
        },
        {
            name: 'Informace o projektu',
            path: '/projects/',
            icon: 'bi-info-circle',
            start: true,
            hidden: true,
            login: false
        }
    ];

    page.subscribe((value) => {
        currentNavItem = navigationData.find((item) => (item.start && item.start === true ? value.url.pathname.startsWith(item.path) : item.path == value.url.pathname)) ?? null;
    });

    const description = 'Frontend a backend programátor v TypeScriptu, využívající primárně framework SvelteKit. Nebráním se ani tvorbě jiných NodeJS aplikací.';
</script>

<svelte:head>
    <title>{currentNavItem?.name} | patrick115.eu</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{currentNavItem?.name} | patrick115.eu" />
    <meta property="og:description" content={description} />
    <meta property="og:url" content="{PUBLIC_ORIGIN}{$page.url.pathname}" />
    <meta property="og:image" content="{PUBLIC_ORIGIN}/images/icon.webp" />
    <meta property="twitter:card" content="/summary_large_image" />
</svelte:head>

<nav class="mx-auto flex w-full flex-row flex-wrap justify-center gap-1 text-2xl 3xl:text-3xl">
    {#each navigationData.filter((item) => {
        if (item.hidden && item.hidden === true) {
            return false;
        }

        if (item.login) {
            return $sessionData.logged;
        }
        return true;
    }) as item}
        {#if currentNavItem !== null && currentNavItem.path == item.path}
            <div class="cursor-pointer px-2 py-1">
                <h2 class=" border-b-4 border-b-text font-fira-sans font-bold">
                    <Icon name={item.icon} />
                    {item.name}
                </h2>
            </div>
        {:else}
            <a href={item.path}>
                <div class="cursor-pointer px-2 py-1">
                    <h2
                        class="font-fira-sans font-bold after:block after:origin-bottom-left after:scale-x-0 after:border-b-4 after:border-b-text after:transition-all after:hover:scale-x-100"
                    >
                        <Icon name={item.icon} />
                        {item.name}
                    </h2>
                </div>
            </a>
        {/if}
    {/each}
</nav>
