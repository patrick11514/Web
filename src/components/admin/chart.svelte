<script lang="ts">
    import { Chart, type ChartConfiguration } from 'chart.js/auto';
    import { onMount } from 'svelte';

    const {
        type,
        data,
        options = {}
    }: {
        type: ChartConfiguration['type'];
        data: ChartConfiguration['data'];
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
