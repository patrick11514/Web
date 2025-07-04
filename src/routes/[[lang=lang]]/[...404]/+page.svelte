<script lang="ts">
  import Icon from '$/components/utility/Icon.svelte';
  import Link from '$/components/utility/Link.svelte';
  import { getState } from '$/lib/state.svelte';
  import { page } from '$app/state';

  const _state = getState();

  const title = $derived.by(() => `${_state.lang.error.title} | ${page.url.host}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<div class="m-auto">
  <h1 class="text-4xl font-bold lg:text-5xl"><Icon name="bi-code-slash" /> {_state.lang.error.message}</h1>
  <h2 class="text-3xl font-bold lg:text-4xl">{_state.lang.error.sub_message}</h2>
  <Link link="/{_state.selectedLang}" class="text-xl font-bold lg:text-2xl">{_state.lang.error.go_home}</Link>
</div>
