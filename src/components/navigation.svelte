<script lang="ts">
    import type { BootstrapIcon } from '$/types/bootstrap_icons'
    import { page } from '$app/stores'
    import Icon from './Icon.svelte'

    type NavigationItem = {
        name: string
        path: string
        icon: BootstrapIcon
        end?: boolean
    }

    let currentNavItem: NavigationItem | null = null

    const navigationData: NavigationItem[] = [
        {
            name: 'Domů',
            path: '/',
            icon: 'bi-house-fill'
        },
        {
            name: 'Projekty',
            path: '/projects',
            icon: 'bi-braces'
        }
    ]

    page.subscribe((value) => {
        currentNavItem = navigationData.find((item) => item.path == value.url.pathname) ?? null
    })
</script>

<div class="mx-auto flex w-full flex-row justify-center gap-4">
    {#each navigationData as item}
        {#if currentNavItem !== null && currentNavItem.path == item.path}
            <div class="cursor-pointer p-2">
                <h2 class=" border-b-4 border-b-text font-fira-sans text-2xl font-bold">
                    <Icon name={item.icon} />
                    {item.name}
                </h2>
            </div>
        {:else}
            <a href={item.path}>
                <div class="cursor-pointer p-2">
                    <h2
                        class="border-b-4 border-b-transparent font-fira-sans text-2xl font-bold after:block after:origin-bottom-left after:scale-x-0 after:border-b-4 after:border-b-text after:transition-all after:hover:scale-x-100"
                    >
                        <Icon name={item.icon} />
                        {item.name}
                    </h2>
                </div>
            </a>
        {/if}
    {/each}
</div>
