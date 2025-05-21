<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import Icon from './utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { untrack } from 'svelte';

    type NavItem = {
        name: string;
        icon: BootstrapIcon;
        path: string;
        matchStart?: boolean;
        hidden?: boolean;
        admin?: boolean;
    };

    type AdminItem = Omit<NavItem, 'admin'>;

    const _state = getState();

    const Navigation = $derived([
        {
            name: _state.lang.navigation.home,
            icon: 'bi-house-fill',
            path: '/'
        },
        {
            name: _state.lang.navigation.gallery,
            icon: 'bi-image-fill',
            path: '/gallery'
        },
        {
            name: _state.lang.navigation.login,
            icon: 'bi-person-fill',
            path: '/login',
            hidden: true
        },
        {
            name: _state.lang.navigation.admin,
            icon: 'bi-hdd-rack',
            path: '/admin',
            admin: true
        }
    ] satisfies NavItem[]);

    const AdminNavigation = $derived([
        {
            name: _state.lang.adminNavigation.home,
            icon: 'bi-clipboard-data',
            path: '/admin'
        },
        {
            name: _state.lang.adminNavigation.equipment,
            icon: 'bi-moon-stars-fill',
            path: '/admin/equipment'
        },
        {
            name: _state.lang.adminNavigation.articles,
            icon: 'bi-journal-text',
            path: '/admin/article'
        }
    ] satisfies AdminItem[]);

    const getNavItem = (path: string): NavItem | AdminItem | null => {
        const mainNav = Navigation.find((item) => item.path === path) || null;
        if (mainNav) {
            return mainNav;
        }

        const adminNav = AdminNavigation.find((item) => {
            return path === item.path;
        });

        if (adminNav) {
            return adminNav;
        }

        return null;
    };

    const currentItem = $derived(getNavItem(_state.path));

    let selectedLanguage = $state(_state.selectedLang);
    $effect(() => {
        let target = `/${selectedLanguage}${_state.path}`;
        untrack(() => {
            if (page.url.pathname !== target) {
                const queryParams = page.url.searchParams.toString();
                if (queryParams) {
                    target += `?${queryParams}`;
                }

                goto(target, {
                    replaceState: true
                });
            }
        });
    });

    let mobileOpened = $state(false);

    const title = $derived.by(() => `${currentItem?.name} | ${page.url.host}`);
    const description = $derived(_state.lang.default_desc);

    const filteredNavigation = $derived(
        Navigation.filter((item) => {
            const isLogged = _state.userState.logged;
            if (item.admin) {
                return isLogged;
            }
            if (item.hidden) {
                return false;
            }
            return true;
        })
    );
    const filteredAdminNavigation = $derived(
        AdminNavigation.filter((/*item*/) => {
            /*if (item.hidden) {
                return false;
            }*/
            return true;
        })
    );
</script>

<svelte:head>
    {#if currentItem}
        <title>{title}</title>
        <meta property="og:title" content={title} />
    {/if}
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:image" content="{page.url.origin}/images/PFP.jpg" />
</svelte:head>

<nav class="font-poppins hidden w-full p-4 text-xl md:flex lg:text-2xl">
    <div class="flex-1"></div>
    <div class="mx-auto flex justify-center gap-8 font-bold">
        {#each filteredNavigation as item, index (index)}
            {@const isActive = _state.path === item.path}
            <a
                href="/{selectedLanguage}{item.path}"
                class={{
                    'flex gap-2 transition-colors duration-200 ease-in-out': true,
                    'text-primary': isActive,
                    'hover:text-primary-text': !isActive
                }}
            >
                <Icon name={item.icon} class="text-2xl lg:text-3xl" />
                {item.name}
            </a>
        {/each}
    </div>

    <div class="flex flex-1 items-center justify-end">
        <select bind:value={selectedLanguage} class="cursor-pointer font-bold">
            {#each Object.entries(_state.languages) as [langKey, langData] (langKey)}
                <option value={langKey}>{langData.flag} {langData.name}</option>
            {/each}
        </select>
    </div>
</nav>
{#if _state.userState.logged && _state.path.startsWith('/admin')}
    <section class="font-poppins mb-4 hidden w-full px-4 text-xl md:flex lg:text-2xl">
        <div class="flex-1"></div>
        <div class="mx-auto flex justify-center gap-8 font-bold">
            {#each filteredAdminNavigation as item, index (index)}
                {@const isActive = _state.path === item.path}
                <a
                    href="/{selectedLanguage}{item.path}"
                    class={{
                        'flex gap-2 transition-colors duration-200 ease-in-out': true,
                        'text-primary': isActive,
                        'hover:text-primary-text': !isActive
                    }}
                >
                    <Icon name={item.icon} class="text-2xl lg:text-3xl" />
                    {item.name}
                </a>
            {/each}
        </div>
        <div class="flex-1"></div>
    </section>
{/if}

<Icon
    onclick={() => (mobileOpened = true)}
    name="bi-list"
    class="border-text transition-color hover:bg-primary m-4 ml-auto w-max cursor-pointer rounded-md border-2 px-1 text-4xl duration-200 md:hidden"
/>

{#if mobileOpened}
    <div class="bg-background fixed top-0 left-0 flex h-screen w-screen flex-col items-center gap-4 text-2xl md:hidden">
        <Icon
            onclick={() => (mobileOpened = false)}
            name="bi-x-lg"
            class="border-text transition-color hover:bg-primary m-4 ml-auto w-max cursor-pointer rounded-md border-2 px-1 text-4xl duration-200 md:hidden"
        />
        <select bind:value={selectedLanguage} class="mb-8 cursor-pointer font-bold">
            {#each Object.entries(_state.languages) as [langKey, langData] (langKey)}
                <option value={langKey}>{langData.flag} {langData.name}</option>
            {/each}
        </select>
        {#each filteredNavigation as item, index (index)}
            {@const isActive = _state.path === item.path}
            <a
                onclick={() => (mobileOpened = false)}
                href="/{selectedLanguage}/{item.path}"
                class={{
                    'text-3xl font-bold transition-colors duration-200 ease-in-out': true,
                    'text-primary': isActive,
                    'hover:text-primary-text': !isActive
                }}
            >
                <Icon name={item.icon} class="text-4xl" />
                {item.name}
            </a>
        {/each}

        {#if _state.userState.logged && _state.path.startsWith('/admin')}
            <hr class="bg-text h-1 w-full" />
            {#each filteredAdminNavigation as item, index (index)}
                {@const isActive = _state.path === item.path}
                <a
                    onclick={() => (mobileOpened = false)}
                    href="/{selectedLanguage}/{item.path}"
                    class={{
                        'text-3xl font-bold transition-colors duration-200 ease-in-out': true,
                        'text-primary': isActive,
                        'hover:text-primary-text': !isActive
                    }}
                >
                    <Icon name={item.icon} class="text-4xl" />
                    {item.name}
                </a>
            {/each}
        {/if}
    </div>
{/if}
