<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { resolveTranslation, type LanguagePath } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { BootstrapIcon } from '$/types/bootstrap_icons';

  type Platform = {
    icon: BootstrapIcon;
    name: string;
    tag: string;
    url: string;
    button: 'visit' | 'send';
    descriptionKey: LanguagePath;
  };

  const _state = getState();
  const lang = $derived(_state.lang.contact);

  const platforms = [
    {
      icon: 'bi-github',
      name: 'GitHub',
      button: 'visit',
      tag: '@patrick11514',
      url: 'https://github.com/patrick11514',
      descriptionKey: 'contact.descriptions.github'
    },
    {
      icon: 'bi-envelope',
      name: 'Email',
      button: 'send',
      tag: 'info@patrick115.eu',
      url: 'mailto:info@patrick115.eu',
      descriptionKey: 'contact.descriptions.email'
    },
    {
      icon: 'bi-linkedin',
      name: 'LinkedIn',
      button: 'visit',
      tag: '/in/patrick115',
      url: 'https://www.linkedin.com/in/patrick115/',
      descriptionKey: 'contact.descriptions.linkedin'
    },
    {
      icon: 'bi-instagram',
      name: 'Instagram',
      button: 'visit',
      tag: '@patrikmintel',
      url: 'https://www.instagram.com/patrikmintel/',
      descriptionKey: 'contact.descriptions.instagram'
    },
    {
      icon: 'bi-twitch',
      name: 'Twitch',
      button: 'visit',
      tag: '@PatrikMint',
      url: 'https://www.twitch.tv/patrikmint',
      descriptionKey: 'contact.descriptions.twitch'
    },
    {
      icon: 'bi-discord',
      name: 'Discord',
      button: 'send',
      tag: 'patrik.',
      url: 'https://discord.com/users/620266881227423745',
      descriptionKey: 'contact.descriptions.discord'
    },
    {
      icon: 'bi-discord',
      name: 'Discord Server',
      button: 'visit',
      tag: 'Patrikovo Království',
      url: 'https://discord.patrick115.eu/',
      descriptionKey: 'contact.descriptions.discordServer'
    }
  ] as const satisfies Platform[];
</script>

<section class="flex h-full w-full flex-1 flex-col px-4">
  <H1 class="mx-auto mb-8">{lang.title}</H1>
  <div class="flex w-full flex-wrap items-stretch justify-center gap-2">
    {#each platforms as platform (`${platform.name}-${platform.tag}`)}
      <a
        href={platform.url}
        target="_blank"
        class="border-text bg-background group flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-all duration-300 hover:scale-105 hover:bg-gray-900 sm:w-1/3 md:w-1/4"
      >
        <Icon
          name={platform.icon}
          class="group-hover:text-text rounded-full bg-gray-900 px-4 py-3.5 text-5xl text-gray-400 transition-colors duration-300 "
        />
        <h2 class="font-poppins text-xl font-semibold lg:text-2xl">{platform.name}</h2>
        <div
          class="font-ubuntu rounded-full bg-gray-800 p-2 text-base font-medium text-gray-300 lg:text-lg"
        >
          {platform.tag}
        </div>
        <h3 class="text-text-muted text-center text-base lg:text-lg">
          {resolveTranslation(platform.descriptionKey, _state.lang)}
        </h3>
      </a>
    {/each}
  </div>
</section>
