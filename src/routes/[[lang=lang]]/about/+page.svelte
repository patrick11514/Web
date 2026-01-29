<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import SolarSystem from './components/SolarSystem.svelte';
  import { solarSystemConfig, type LifeEvent } from './data';

  const _state = getState();
  const lang = $derived(_state.lang.about);

  let selectedEvent = $state<LifeEvent | null>(null);

  function handleSelect(event: LifeEvent | null) {
    selectedEvent = event;
  }
</script>

<section class="relative flex h-full w-full flex-1 flex-col items-center gap-8 py-8">
  <H1>{lang.title}</H1>

  <p class="max-w-xl text-center text-white/60">
    Explore my journey through the solar system of life events. Click on a planet to learn
    more.
  </p>

  <SolarSystem
    events={solarSystemConfig}
    onSelect={handleSelect}
    selectedId={selectedEvent?.id}
  />

  {#if selectedEvent}
    <InfoPanel event={selectedEvent} onClose={() => (selectedEvent = null)} />
  {/if}
</section>
