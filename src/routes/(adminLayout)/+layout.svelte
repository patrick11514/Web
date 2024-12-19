<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import Navigation, { type NavigationItem } from '$/components/admin/navigation.svelte';
    import Button from '$/components/button.svelte';
    import { logout } from '$/lib/functions';
    import { getContext, type Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import type { Writable } from 'svelte/store';
    import type { LoginData } from '$/types/types';

    const { data, children }: { data: LayoutData; children: Snippet } = $props();

    let navItem = $state<NavigationItem>();
    let folded = $state(true);

    const toggleFolded = () => {
        if (folded) {
            folded = !folded;
        }
    };

    const userState = getContext<Writable<LoginData>>('userState');
</script>

{#if $userState.logged}
    <section class="flex flex-1 flex-col border-b-2 border-t-2 border-text">
        <div class="flex w-full flex-row border-b-2 border-b-text px-2">
            {#if folded}
                <button onclick={toggleFolded} class="m-2 flex rounded-md border-2 border-text px-1.5 py-0.5 text-2xl transition-colors duration-200 hover:bg-secondary">
                    <Icon class="m-auto" name="bi-list" />
                </button>
            {:else}
                <button class="m-2 flex rounded-md border-2 border-text px-1.5 py-0.5 text-2xl transition-colors duration-200 hover:bg-secondary">
                    <Icon class="m-auto" name="bi-x" />
                </button>
            {/if}
            <h2 class="text-ubuntu my-auto ml-2 w-full text-right text-xl font-bold md:text-left 3xl:text-2xl">{navItem?.fullName ?? ''}</h2>
            <div class="my-auto ml-auto hidden flex-row md:flex">
                <span class="my-auto font-ubuntu font-bold 3xl:text-lg">{$userState.data.username}</span>
                <Button onclick={logout} class="w-max px-2 py-1 text-lg 3xl:text-xl">Odhlásit se</Button>
            </div>
        </div>
        <div class="relative flex flex-1 flex-row">
            <Navigation bind:currentNavItem={navItem} bind:folded version={data.version} />

            {@render children()}
        </div>
    </section>
{/if}
