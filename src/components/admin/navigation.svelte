<script lang="ts" context="module">
    export type NavigationItem = {
        name: string;
        path: string;
        fullName: string;
        icon: BootstrapIcon;
    };
</script>

<script lang="ts">
    import ClickOutside from '$/components/clickOutside.svelte';
    import { logout } from '$/routes/(adminLayout)/+layout.svelte';
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { page } from '$app/stores';
    import { twMerge } from 'tailwind-merge';
    import Icon from '../Icon.svelte';
    import Button from '../button.svelte';
    import { sessionData } from '../store.svelte';

    export let currentNavItem: NavigationItem | null = null;

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
        }
    ];

    page.subscribe((value) => {
        currentNavItem = navigationData.find((item) => item.path == value.url.pathname) ?? null;
    });

    export let folded: boolean;
    export let version: string;
</script>

{#if $sessionData.logged}
    <ClickOutside clickoutside={() => (folded = true)}>
        <nav
            class={twMerge(
                'absolute top-0 flex h-full min-w-max -translate-x-full flex-col flex-wrap gap-1 border-r-2 border-r-text bg-background px-8 py-2 text-2xl transition-all duration-300 md:static  md:translate-x-0 3xl:text-3xl',
                folded == false ? 'translate-x-0' : ''
            )}
        >
            <div class="flex flex-col text-center text-xl md:hidden">
                <span class="font-ubuntu font-bold">{$sessionData.data.username}</span>
                <Button on:click={logout} class="px-2 py-1 text-lg">Odhlásit se</Button>
            </div>
            {#each navigationData as item}
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
            <footer class="mt-auto text-center font-ubuntu text-sm font-bold">
                v{version}
            </footer>
        </nav>
    </ClickOutside>
{/if}