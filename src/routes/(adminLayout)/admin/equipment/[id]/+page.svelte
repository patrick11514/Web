<script lang="ts">
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import Select from '$/components/select.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { Equipment, EquipmentType } from '$/types/types';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import type { PageData } from './$types';

    const { data }: { data: PageData } = $props();

    let types = $state<EquipmentType[]>([]);

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

    let equipmentData = writable<
        Omit<Equipment, 'type'> & {
            type: string;
        }
    >({
        id: 0,
        name: '',
        link: '',
        type: ''
    });

    const putEquipmentData = (response: (typeof data)['equipment']) => {
        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        equipmentData.set({
            ...response.data,
            type: response.data.type.toString()
        });
    };

    putEquipmentData(data.equipment);

    const edit = async () => {
        if ($equipmentData.name.length == 0) {
            SwalAlert({
                icon: 'error',
                title: 'Vyplň název'
            });
            return;
        }

        try {
            new URL($equipmentData.link);
        } catch (_) {
            SwalAlert({
                icon: 'error',
                title: 'Zadal jsi neplatný odkaz'
            });
            return;
        }

        if ($equipmentData.type === '') {
            SwalAlert({
                icon: 'error',
                title: 'Vyber typ vybavení'
            });
            return;
        }

        let numType: number;

        try {
            numType = parseInt($equipmentData.type);
        } catch (_) {
            SwalAlert({
                icon: 'error',
                title: 'Vyber platný typ vybavení'
            });
            return;
        }

        const response = await API.equipment.PATCH({
            id: $equipmentData.id,
            name: $equipmentData.name,
            link: $equipmentData.link,
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
            title: 'Vybavení bylo upraveno'
        });
    };
</script>

<div class="m-2 mx-auto flex w-full flex-col p-4 sm:w-[80%] md:w-[75%]">
    <Group>
        <Label for="name">Název</Label>
        <Input id="name" type="text" bind:value={$equipmentData.name} />
    </Group>
    <Group>
        <Label for="link">Odkaz</Label>
        <Input id="link" type="url" bind:value={$equipmentData.link} />
    </Group>
    <Group>
        <Label for="type">Typ</Label>
        <Select id="type" bind:value={$equipmentData.type} class="py-2 text-xl font-bold">
            <option value="" selected disabled>Vyber typ</option>
            {#each types as type}
                <option value={type.id.toString()}>{type.name}</option>
            {/each}
        </Select>
    </Group>
    <Group class="mx-auto flex-row">
        <Button onclick={edit}>Upravit</Button>
        <a href="/admin/equipment"><Button class="bg-red-600 hover:bg-red-500">Zpět</Button></a>
    </Group>
</div>
