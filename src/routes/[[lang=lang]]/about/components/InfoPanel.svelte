<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import type { LifeEvent } from '../data';

  type Props = {
    event: LifeEvent;
    onClose: () => void;
  };
  const { event, onClose }: Props = $props();
</script>

<div
  class="fixed inset-0 z-50 flex content-center items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
>
  <!-- Backdrop -->
  <button
    class="absolute inset-0 cursor-default border-none bg-black/60 backdrop-blur-sm outline-none"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    aria-label="Close modal"
    transition:fade={{ duration: 200 }}
  ></button>

  <!-- Modal -->
  <div
    class="relative w-full max-w-md cursor-auto rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-md"
    transition:scale={{ start: 0.9, duration: 200 }}
  >
    <button
      class="absolute top-4 right-4 text-2xl text-white/50 transition-colors hover:text-white"
      onclick={onClose}
      aria-label="Close"
    >
      &times;
    </button>

    <div class="mb-6 flex items-center gap-4">
      <div
        class="h-16 w-16 rounded-full shadow-lg"
        style:background-color={event.color}
      ></div>
      <div>
        <h2 class="text-2xl font-bold text-white">{event.title}</h2>
        <p class="text-sm font-medium text-white/60">{event.date}</p>
      </div>
    </div>

    <div class="prose prose-invert">
      <p class="leading-relaxed text-gray-300">
        {event.description}
      </p>
    </div>
  </div>
</div>
