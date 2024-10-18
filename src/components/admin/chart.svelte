<script lang="ts">
    import { Chart, type ChartConfiguration } from 'chart.js/auto';
    import { onMount } from 'svelte';

    export let type: ChartConfiguration['type'];
    export let data: ChartConfiguration['data'];
    export let options: ChartConfiguration['options'] = {};

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

<canvas bind:this={canvas} />
