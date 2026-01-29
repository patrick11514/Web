<script lang="ts">
  import type { LifeEvent } from '../data';
  import CelestialBody from './CelestialBody.svelte';
  import Orbit from './Orbit.svelte';

  type Props = {
    events: LifeEvent[];
    onSelect?: (event: LifeEvent | null) => void;
    selectedId?: string | null;
  };
  const { events, onSelect, selectedId }: Props = $props();

  const planetOrder = [
    'mercury',
    'venus',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'uranus',
    'neptune'
  ];

  const baseOrbit = 80;
  const orbitGap = 50;
  const sunSize = 80;
</script>

<div
  class="relative mx-auto flex aspect-square w-full max-w-[800px] items-center justify-center overflow-visible rounded-full"
>
  <!-- Sun -->
  <CelestialBody
    type="sun"
    size={sunSize}
    color="#FCCB00"
    distance={0}
    label="Origin"
    onClick={() => onSelect?.(null)}
  />

  {#each planetOrder as pName, i (pName)}
    {@const event = events.find((e) => e.planet === pName && e.available)}
    {#if event}
      {@const radius = baseOrbit + i * orbitGap}
      {@const duration = 60 + i * 20}
      <!-- Distribute starting positions -->
      {@const angle = i * 130 - 45}
      {@const delay = -1 * (angle / 360) * duration}

      <Orbit {radius} />

      <!-- Orbit Rotation Container -->
      <div
        class="orbit-animation pointer-events-none absolute top-1/2 left-1/2 rounded-full"
        style:width="{radius * 2}px"
        style:height="{radius * 2}px"
        style:animation-duration="{duration}s"
        style:animation-delay="{delay}s"
      >
        <!-- Planet Wrapper (at top of orbit circle, counter-rotating) -->
        <div
          class="counter-rotate pointer-events-auto absolute top-0 left-1/2"
          style:animation-duration="{duration}s"
          style:animation-delay="{delay}s"
        >
          <CelestialBody
            type="planet"
            size={25}
            color={event.color || '#888'}
            distance={0}
            angle={0}
            label={event.title}
            onClick={() => onSelect?.(event)}
            class={selectedId === event.id ? 'scale-125 ring-4 ring-white/50' : ''}
          />
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  @keyframes orbit {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  @keyframes counter-rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }

  .orbit-animation {
    animation-name: orbit;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .counter-rotate {
    animation-name: counter-rotate;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
</style>
