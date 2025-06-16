<script lang="ts">
    import Chart from '$/components/utility/Chart.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const _state = getState();

    let chartData: {
        datasets: { label: string; data: { x: string; y: number }[] }[];
    } = {
        datasets: []
    };

    //get all unique years
    const years = new Set(data.weekGraph.filter((item) => item.YEAR).map((item) => item.YEAR));

    for (const year of years) {
        chartData.datasets.push({
            label: year.toString(),
            data: data.weekGraph.filter((item) => item.YEAR === year).map((item) => ({ x: item.WEEK.toString(), y: item.COUNT }))
        });
    }
</script>

<section class="flex h-full flex-1 flex-col md:flex-row">
    <div class="flex flex-1 flex-col items-center">
        <h1 class="font-poppins w-max text-3xl font-bold lg:text-4xl"><Icon name="bi-bar-chart" /> {_state.lang.admin.main.stats}</h1>
        <h3><span class="font-bold">{_state.lang.admin.main.today}</span>: {data.today}</h3>
        <h3><span class="font-bold">{_state.lang.admin.main.week}</span>: {data.week}</h3>
        <div class="mx-auto w-[95%] md:w-lg">
            <Chart type="line" data={chartData} />
        </div>
    </div>
    <div class="mx-auto flex max-w-1/2 flex-col items-center md:m-0">
        <h1 class="font-poppins w-max text-3xl font-bold lg:text-4xl"><Icon name="bi-hearts" class="text-red-500" /> Cat of the day :)</h1>
        <img class="h-auto md:max-w-2/3" src="https://cataas.com/cat" alt="Random cat" />
    </div>
</section>
