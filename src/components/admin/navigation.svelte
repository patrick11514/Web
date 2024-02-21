<script lang="ts" context="module">
    export type NavigationItem = {
        name: string;
        path: string;
        fullName: string;
        icon: BootstrapIcon;
        hidden?: boolean;
        start?: boolean;
    };
</script>

<script lang="ts">
    import ClickOutside from '$/components/clickOutside.svelte';
    import { logout } from '$/lib/functions';
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { page } from '$app/stores';
    import { twMerge } from 'tailwind-merge';
    import Icon from '../Icon.svelte';
    import Button from '../button.svelte';
    import { sessionData } from '../store.svelte';

    const navigationData: NavigationItem[] = [
        {
            name: 'Domů',
            fullName: 'Hlavní Stránka',
            path: '/admin/main',
            icon: 'bi-house-fill'
        },
        {
            name: 'Projekty',
            fullName: 'Správa Projektů',
            path: '/admin/projects',
            icon: 'bi-window-fullscreen'
        },
        {
            name: 'Tagy',
            fullName: 'Správa Tagů',
            path: '/admin/tags',
            icon: 'bi-tags-fill'
        },
        {
            name: 'New',
            fullName: 'Přidat Projekt',
            path: '/admin/projects/new',
            icon: 'bi-plus',
            hidden: true
        },
        {
            name: 'Info',
            fullName: 'Prohlížení Projektu',
            path: '/admin/projects/',
            icon: 'bi-info-circle',
            start: true,
            hidden: true
        }
    ];

    const getNavItem = (value: typeof $page) => {
        return navigationData.find((item) => (item.start ? value.url.pathname.startsWith(item.path) : item.path == value.url.pathname)) ?? null;
    };

    export let currentNavItem: NavigationItem | null = getNavItem($page);

    page.subscribe((value) => {
        currentNavItem = getNavItem(value);
    });

    export let folded: boolean;
    export let version: string;
</script>

{#if $sessionData.logged}
    <ClickOutside clickoutside={() => (folded = true)}>
        <nav
            class={twMerge(
                'absolute top-0 z-10 flex h-full min-w-max -translate-x-full flex-col flex-wrap gap-1 border-r-2 border-r-text bg-background px-8 py-2 text-2xl transition-all duration-300 3xl:text-3xl',
                folded == false ? 'translate-x-0' : ''
            )}
        >
            <div class="flex flex-col text-center text-xl md:hidden">
                <span class="font-ubuntu font-bold">{$sessionData.data.username}</span>
                <Button on:click={logout} class="px-2 py-1 text-lg">Odhlásit se</Button>
            </div>
            {#each navigationData.filter((item) => (item.hidden && item.hidden === true ? false : true)) as item}
                {#if currentNavItem !== null && currentNavItem.path == item.path}
                    <div class="mx-auto w-max cursor-pointer px-2 py-1">
                        <h2 class="mx-auto w-max border-b-4 border-b-text font-fira-sans font-bold">
                            <Icon name={item.icon} />
                            {item.name}
                        </h2>
                    </div>
                {:else}
                    <a href={item.path}>
                        <div class="mx-auto w-max cursor-pointer px-2 py-1">
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
            <footer class="mt-auto text-center font-ubuntu text-sm font-bold 3xl:text-base">
                v{version}
            </footer>
        </nav>
    </ClickOutside>
{/if}
