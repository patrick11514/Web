<script lang="ts">
  import { H1, H4 } from '$/components/headers';
  import { API } from '$/lib/api';
  import type { LiveStatus } from '$/lib/server/nina';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';

  const appState = getState();

  let liveData = $state<LiveStatus | null>(null);
  let now = $state(Date.now());

  const refreshData = async () => {
    try {
      const prevData = liveData;

      liveData = await API.telescope();

      if (
        liveData.active &&
        (prevData?.active != liveData.active ||
          liveData?.imageInfo?.Date != prevData?.imageInfo?.Date)
      ) {
        now = Date.now();
      }
    } catch {
      liveData = { active: false };
    }
  };

  onMount(() => {
    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    return () => clearInterval(interval);
  });
</script>

<section class="px-4">
  <H1>
    {appState.lang.live_photo.title}
  </H1>
  <H4>{appState.lang.live_photo.description}</H4>

  <div class="mt-8 grid grid-cols-1 gap-6 px-2 lg:grid-cols-3">
    <div class="lg:col-span-2">
      {#if liveData?.active && liveData?.showImage}
        <img
          src={`/api/live-image?t=${now}`}
          alt="Live view"
          class="w-full rounded-lg shadow-lg"
        />
      {:else}
        <div
          class="flex aspect-video w-full items-center justify-center rounded-lg bg-black text-xl text-white shadow-lg"
        >
          {liveData?.active
            ? liveData?.currentAction || appState.lang.live_photo.inactive
            : appState.lang.live_photo.inactive}
        </div>
      {/if}
    </div>

    <div
      class="bg-background border-border text-text h-fit rounded-2xl border-2 p-6 shadow-lg"
    >
      <h2 class="text-primary mb-4 text-2xl font-bold">
        {appState.lang.live_photo.stats}
      </h2>

      <div class="space-y-4">
        <!-- Current status -->
        <div>
          <h3 class="mb-2 border-b border-zinc-300 pb-1 font-semibold">
            {appState.lang.live_photo.current_status}
          </h3>
          <p class=" text-secondary font-bold">
            {liveData?.currentAction || '-'}
          </p>
        </div>

        <!-- Mount Section -->
        <div>
          <h3 class="mb-2 border-b border-zinc-300 pb-1 font-semibold">
            {appState.lang.live_photo.mount}
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.ra}:</span
            >
            <span> {liveData?.mountInfo?.RightAscensionString || '-'}</span>

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.dec}:</span
            >
            <span> {liveData?.mountInfo?.DeclinationString || '-'}</span>
          </div>
        </div>

        <!-- Image Info Section -->
        <div>
          <h3 class="mb-2 border-b border-zinc-300 pb-1 font-semibold">
            {appState.lang.live_photo.image}
          </h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.target}:</span
            >
            <span class="truncate text-right" title={liveData?.imageInfo?.TargetName}>
              {liveData?.imageInfo?.TargetName || 'No info'}</span
            >

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.date}:</span
            >
            <span class="text-right">
              {liveData?.imageInfo?.Date
                ? new Date(liveData.imageInfo.Date).toLocaleTimeString()
                : '-'}</span
            >

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.exposure}:</span
            >
            <span class="text-right">
              {liveData?.imageInfo?.ExposureTime
                ? `${liveData.imageInfo.ExposureTime}s`
                : '-'}</span
            >

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.temp}:</span
            >
            <span class="text-right">
              {liveData?.imageInfo?.Temperature
                ? `${liveData.imageInfo.Temperature}°C`
                : '-'}</span
            >

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.gain}:</span
            >
            <span class="text-right"> {liveData?.imageInfo?.Gain ?? '-'}</span>

            <span class="text-secondary font-bold">
              {appState.lang.live_photo.labels.focal_length}:</span
            >
            <span class="text-right">
              {liveData?.imageInfo?.FocalLength
                ? `${liveData.imageInfo.FocalLength}mm`
                : '-'}</span
            >

            <span class="text-secondary col-span-2 font-bold">
              {appState.lang.live_photo.labels.telescope}:</span
            >
            <span class="col-span-2 truncate" title={liveData?.imageInfo?.TelescopeName}>
              {liveData?.imageInfo?.TelescopeName || 'No info'}</span
            >

            <span class="text-secondary col-span-2 font-bold">
              {appState.lang.live_photo.labels.camera}:</span
            >
            <span class="col-span-2 truncate" title={liveData?.imageInfo?.CameraName}>
              {liveData?.imageInfo?.CameraName || 'No info'}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
