<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import Icon from './utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    type NavItem = {
        name: string;
        icon: BootstrapIcon;
        path: string;
        description: string;
        matchStart?: boolean;
        hidden?: boolean;
        admin?: boolean;
    };

    const _state = getState();

    const Navigation = $derived([
        {
            name: _state.lang.navigation.home,
            icon: 'bi-house-fill',
            path: '/',
            description: _state.lang.navigation.home_desc
        },
        {
            name: _state.lang.navigation.gallery,
            icon: 'bi-house-fill',
            path: '/test',
            description: _state.lang.navigation.gallery_desc
        }
    ] satisfies NavItem[]);

    const getNavItem = (path: string): NavItem | null => {
        return Navigation.find((item) => item.path === path) || null;
    };

    const currentItem = $derived(getNavItem(_state.path));

    let selectedLanguage = $state(_state.selectedLang);
    $effect(() => {
        goto(`/${selectedLanguage}${_state.path}`, {
            replaceState: true
        });
    });

    let mobileOpened = $state(false);
</script>

<svelte:head>
    <title>{currentItem?.name} | {page.url.host}</title>
    <meta name="description" content={`${_state.lang.default_desc}\n\n${currentItem?.description}`} />
</svelte:head>

<nav class="font-poppins hidden w-full p-4 md:flex">
    <div class="flex-1"></div>
    <div class="mx-auto flex justify-center gap-8 font-bold">
        {#each Navigation as item, index (index)}
            {@const isActive = _state.path === item.path}
            <a
                href="/{selectedLanguage}/{item.path}"
                class={{
                    'transition-colors duration-200 ease-in-out': true,
                    'text-primary': isActive,
                    'hover:text-primary-text': !isActive
                }}
            >
                <Icon name={item.icon} class="text-2xl" />
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
        {#each Navigation as item, index (index)}
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
    </div>
{/if}
