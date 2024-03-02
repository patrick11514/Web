<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import type { BootstrapIcon } from '$/types/bootstrap_icons';

    const contacts: {
        link: string;
        icon: BootstrapIcon;
        title: string;
    }[] = [
        {
            link: 'https://github.com/patrick11514',
            icon: 'bi-github',
            title: 'Github'
        },
        {
            link: 'mailto:info@patrick115.eu',
            icon: 'bi-envelope',
            title: 'Email'
        },
        {
            link: 'https://linkedin.com/in/patrick115',
            icon: 'bi-linkedin',
            title: 'LinkedIn'
        },
        {
            link: 'https://instagram.com/patrikmintel',
            icon: 'bi-instagram',
            title: 'Instagram'
        },
        {
            link: 'https://twitch.tv/PatrikMint',
            icon: 'bi-twitch',
            title: 'Twitch'
        },
        {
            link: 'https://discord.com/users/620266881227423745',
            icon: 'bi-discord',
            title: 'Discord Profil'
        },
        {
            link: 'https://discord.patrick115.eu',
            icon: 'bi-discord',
            title: 'Discord Server'
        }
    ];
</script>

<section class="flex flex-1 flex-col justify-center p-2">
    <h2 class="mb-4 w-full text-center font-ubuntu text-2xl font-bold xl:text-3xl">Tady mě všude najdeš.</h2>
    <div class="flex flex-row flex-wrap items-center justify-center gap-4">
        {#each contacts as contact}
            <a
                class="rounded-full border-2 border-text p-3 text-5xl text-text transition-colors duration-200 hover:bg-secondary xl:p-6 xl:text-6xl"
                title={contact.title}
                href={contact.link}
                target="_blank"
            >
                <Icon name={contact.icon} />
            </a>
        {/each}
    </div>
</section>
