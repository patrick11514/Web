<script lang="ts">
    import Fa from 'svelte-fa'

    import { faDiscord, faGithub, faInstagram, faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons'
    import { faEnvelope, faServer } from '@fortawesome/free-solid-svg-icons'

    let contacts = [
        {
            name: 'Instagram',
            link: 'https://www.instagram.com/patrikmintel/',
            icon: faInstagram
        },
        {
            name: 'Github',
            link: 'https://github.com/patrick11514',
            icon: faGithub
        },
        {
            name: 'Twitch',
            link: 'https://www.twitch.tv/PatrikMint',
            icon: faTwitch
        },
        {
            name: 'YouTube',
            link: 'https://www.youtube.com/PatrikYT',
            icon: faYoutube
        },
        {
            name: 'Email',
            link: 'mailto:info@patrick115.eu',
            icon: faEnvelope
        },
        {
            name: 'Discord Tag',
            link: 'https://discord.com/users/620266881227423745',
            icon: faDiscord
        },
        {
            name: 'Discord Server',
            link: 'https://discord.patrick115.eu',
            icon: faServer
        }
    ]
</script>

<h2 class="my-4 text-4xl font-bold">Kontakty a sociální sítě</h2>
<div>
    {#each contacts as contact}
        <li class="m-4 inline-block w-32 h-32 border-white border-2 rounded-full hover:bg-white hover:bg-opacity-60 duration-500" title={contact.name}>
            {#if contact?.link}
                <a href={contact.link} target="_blank" rel="noreferrer">
                    <Fa class="mt-7 mx-auto block" icon={contact.icon} size="4x" />
                </a>
            {/if}
        </li>
    {/each}
</div>
