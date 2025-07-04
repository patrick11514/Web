<script lang="ts">
  import { Chart, type ChartConfiguration, type ChartData, type ChartTypeRegistry } from 'chart.js/auto';
  import { onMount } from 'svelte';

  const {
    type,
    data,
    options = {}
  }: {
    type: ChartConfiguration['type'];
    data: ChartData<keyof ChartTypeRegistry, { x: string | number; y: number }[]>;
    options?: ChartConfiguration['options'];
  } = $props();

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Chart(canvas, {
      type,
      data,
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: { grid: { color: 'white' } },
          y: { grid: { color: 'white' } }
        },
        ...options
      }
    });
  });
</script>

<canvas bind:this={canvas}></canvas>
