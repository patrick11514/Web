<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import Icon from './utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import { page } from '$app/state';

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

    const Navigation = [
        {
            name: _state.lang.navigation.home,
            icon: 'bi-house-fill',
            path: '/',
            description: _state.lang.navigation.home_desc
        },
        {
            name: 'Test',
            icon: 'bi-house-fill',
            path: '/test',
            description: 'test'
        }
    ] satisfies NavItem[];

    let currentItem = $state<NavItem | null>(null);

    $effect(() => {
        currentItem = Navigation.find((item) => item.path === _state.path) || null;
    });
</script>

<svelte:head>
    <title>{currentItem?.name} | {page.url.host}</title>
    <meta name="description" content={currentItem?.description} />
</svelte:head>

<nav class="flex w-full p-4">
    <div class="mx-auto flex justify-center gap-8 font-bold">
        {#each Navigation as item, index (index)}
            <a
                href={item.path}
                class={{
                    'text-primary': _state.path === item.path
                }}
            >
                <Icon name={item.icon} class="text-2xl" />
                {item.name}
            </a>
        {/each}
    </div>
</nav>
