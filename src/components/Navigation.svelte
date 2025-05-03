<script lang="ts">
    import { getLanguage, getPath } from '$/lib/lang/index.svelte';
    import type { BootstrapIcon } from '$/types/bootstrap_icons';
    import { page } from '$app/state';

    type NavItem = {
        name: string;
        icon: BootstrapIcon;
        path: string;
        matchStart?: boolean;
        hidden?: boolean;
        admin?: boolean;
    };

    const lang = getLanguage();
    const path = getPath();
    console.log(path);

    const Navigation = [
        {
            name: lang.navigation.home
        }
    ] satisfies NavItem[];
</script>

<nav class="flex w-full"></nav>
