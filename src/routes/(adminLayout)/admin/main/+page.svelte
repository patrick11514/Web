<script lang="ts">
    import Chart from '$/components/admin/chart.svelte';
    import { SwalAlert } from '$/lib/functions';
    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    let today = $state<number>();

    const getToday = () => {
        if (!data.today.status) {
            SwalAlert({
                icon: 'error',
                title: 'Nepovedlo se načíst dnešní návštévníky'
            });
            return;
        }

        today = data.today.data;
    };

    getToday();

    let thisWeek = $state<number>();

    const getWeek = () => {
        if (!data.thisWeek.status) {
            SwalAlert({
                icon: 'error',
                title: 'Nepovedlo se načíst týdenní návštévníky'
            });
            return;
        }

        thisWeek = data.thisWeek.data;
    };

    getWeek();

    let yearData: { YEAR: number; WEEK: number; COUNT: number }[] = [];

    const getYearData = () => {
        if (!data.yearData.status) {
            SwalAlert({
                icon: 'error',
                title: 'Nepovedlo se načíst roční statistiky'
            });
            return;
        }

        yearData = data.yearData.data;
    };

    getYearData();

    let chartData: {
        datasets: { label: string; data: { x: string; y: number }[] }[];
    } = {
        datasets: []
    };

    //get all unique years
    const years = new Set(yearData.filter((item) => item.YEAR).map((item) => item.YEAR));

    for (const year of years) {
        chartData.datasets.push({
            label: year.toString(),
            data: yearData.filter((item) => item.YEAR === year).map((item) => ({ x: item.WEEK.toString(), y: item.COUNT }))
        });
    }
</script>

<section class="flex flex-1 flex-col p-4 md:flex-row">
    <section class="w-full md:w-[50%]">
        <h1 class="text-2xl font-bold 2xl:text-3xl">Statistiky</h1>
        <h3 class="text-lg 2xl:text-xl">Unikátní návštěvníci dnes: {today}</h3>
        <h3 class="text-lg 2xl:text-xl">Unikátní návštěvníci tento týden: {thisWeek}</h3>
        <div class="w-96">
            <Chart type="line" data={chartData} />
        </div>
    </section>
    <section class="w-full md:w-[50%]">
        {#if data.cat}
            <img src={data.cat} alt="Random cat :)" />
        {:else}
            No cat found :(
        {/if}
    </section>
</section>
