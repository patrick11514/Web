<script lang="ts" context="module">
    export const logout = async () => {
        const result = await API.auth.logout.fetch();

        if (result.status === false) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        sessionData.set({
            logged: false
        });

        goto('/admin');
    };
</script>

<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import Navigation, { type NavigationItem } from '$/components/admin/navigation.svelte';
    import Button from '$/components/button.svelte';
    import { sessionData } from '$/components/store.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import { goto } from '$app/navigation';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    let navItem: NavigationItem | null = null;
    let folded = true;

    const toggleFolded = () => {
        if (folded) {
            folded = !folded;
        }
    };
</script>

{#if $sessionData.logged}
    <section class="flex flex-1 flex-col border-b-2 border-t-2 border-text">
        <div class="flex w-full flex-row border-b-2 border-b-text px-2">
            {#if folded}
                <button on:click={toggleFolded} class="m-2 flex rounded-md border-2 border-text px-1.5 py-0.5 text-2xl transition-colors duration-200 hover:bg-secondary md:hidden">
                    <Icon class="m-auto" name="bi-list" />
                </button>
            {:else}
                <button class="m-2 flex rounded-md border-2 border-text px-1.5 py-0.5 text-2xl transition-colors duration-200 hover:bg-secondary md:hidden">
                    <Icon class="m-auto" name="bi-x" />
                </button>
            {/if}
            <h2 class="text-ubuntu my-auto ml-2 w-full text-right text-xl font-bold md:text-left">{navItem?.fullName ?? ''}</h2>
            <div class="my-auto ml-auto hidden flex-row md:flex">
                <span class="my-auto font-ubuntu font-bold">{$sessionData.data.username}</span>
                <Button on:click={logout} class="w-max px-2 py-1 text-lg">Odhlásit se</Button>
            </div>
        </div>
        <div class="relative flex flex-1 flex-row">
            <Navigation bind:currentNavItem={navItem} bind:folded version={data.version} />

            <slot />
        </div>
    </section>
{/if}
