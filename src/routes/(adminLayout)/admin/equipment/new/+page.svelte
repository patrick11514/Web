<script lang="ts">
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import Select from '$/components/select.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { EquipmentType } from '$/types/types';
    import { goto } from '$app/navigation';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let types: EquipmentType[] = [];

    const processTypes = (response: (typeof data)['types']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        types = response.data;
    };

    processTypes(data.types);

    let name = '';
    let link = '';
    let type = '';

    const add = async () => {
        if (name.length == 0) {
            SwalAlert({
                icon: 'error',
                title: 'Vyplň název'
            });
            return;
        }

        try {
            new URL(link);
        } catch (_) {
            SwalAlert({
                icon: 'error',
                title: 'Zadal jsi neplatný odkaz'
            });
            return;
        }

        if (type === '') {
            SwalAlert({
                icon: 'error',
                title: 'Vyber typ vybavení'
            });
            return;
        }

        let numType: number;

        try {
            numType = parseInt(type);
        } catch (_) {
            SwalAlert({
                icon: 'error',
                title: 'Vyber platný typ vybavení'
            });
            return;
        }

        const response = await API.equipment.PUT({
            name,
            link,
            type: numType
        });

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        goto('/admin/equipment');

        SwalAlert({
            icon: 'success',
            title: 'Vybavení bylo přidáno'
        });
    };
</script>

<div class="m-2 mx-auto flex w-full flex-col p-4 sm:w-[80%] md:w-[75%]">
    <Group>
        <Label for="name">Název</Label>
        <Input id="name" type="text" bind:value={name} />
    </Group>
    <Group>
        <Label for="link">Odkaz</Label>
        <Input id="link" type="url" bind:value={link} />
    </Group>
    <Group>
        <Label for="type">Typ</Label>
        <Select id="type" bind:value={type} class="py-2 text-xl font-bold">
            <option value="" selected disabled>Vyber typ</option>
            {#each types as type}
                <option value={type.id}>{type.name}</option>
            {/each}
        </Select>
    </Group>
    <Group class="mx-auto flex-row">
        <Button on:click={add}>Přidat</Button>
        <a href="/admin/equipment"><Button class="bg-red-600 hover:bg-red-500">Zpět</Button></a>
    </Group>
</div>
