<script lang="ts">
    import { API } from '$/lib/api';
    import { SwalAlert, extractDate } from '$/lib/functions';
    import type { DetailTypes, EquipmentInfo, GalleryItem, PartialBy } from '$/types/types';
    import { goto } from '$app/navigation';
    import Icon from '../Icon.svelte';
    import Button from '../button.svelte';
    import Group from '../group.svelte';
    import Input from '../input.svelte';
    import Label from '../label.svelte';
    import Select from '../select.svelte';
    import FileInput from './fileInput.svelte';

    export let detailTypes: DetailTypes[];
    export let equipment: EquipmentInfo[];
    export let data: PartialBy<GalleryItem, 'id'>;

    console.log(detailTypes);

    const handleDrop = async (rawFiles: (File | null)[]) => {
        const files = rawFiles.filter((file) => file !== null) as File[];

        if (files.length == 0) {
            return;
        }

        if (files.length > 1) {
            SwalAlert({
                icon: 'error',
                title: 'Můžeš nahrát pouze jeden obrázek'
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', files[0]);

        const result = await API.gallery.POST(formData);

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        data.name = result.data;
    };

    let time = '';
    let date = '';

    if (data.date) {
        const extracted = extractDate(data.date);
        date = extracted[0];
        time = extracted[1];
    }

    $: data.date = new Date(`${date}T${time}`);

    const removeEquipment = (id: number) => {
        data.equipment = data.equipment.filter((item) => item.id !== id);
    };

    let selectedEquipment = '';

    $: {
        if (selectedEquipment !== '') {
            const number = parseInt(selectedEquipment);

            const found = equipment.find((item) => item.id === number);

            if (found) {
                data.equipment = [...data.equipment, found];
            }

            selectedEquipment = '';
        }
    }

    const process = async () => {
        if (data.id !== undefined) {
            edit(data as GalleryItem);
        } else {
            add(data);
        }
    };

    const add = async (data: PartialBy<GalleryItem, 'id'>) => {
        if (!data.name || !data.date || !data.alt) {
            SwalAlert({
                icon: 'error',
                title: 'Všechny pole musí být vyplněny'
            });
            return;
        }

        const response = await API.gallery.PUT(data);

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        goto('/admin/gallery');
    };

    const edit = async (data: GalleryItem) => {
        const response = await API.gallery.PATCH(data);

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        goto('/admin/gallery');
    };

    let addedCategories: DetailTypes[] = [];

    let detailsData: {}[] = [];
</script>

<div class="mx-auto flex flex-col items-center justify-center p-4 sm:w-[80%] md:w-[75%]">
    <h2 class="text-2xl font-bold 3xl:text-3xl">
        {#if data.id !== undefined}
            Úprava {data.alt}
        {:else}
            Nový obrázek
        {/if}
    </h2>

    <Group>
        <Label for="preview">Obrázek</Label>
        <FileInput onDrop={handleDrop} class="m-2 mx-auto flex w-full min-w-40 rounded-lg p-2 transition-colors duration-200 hover:bg-secondary">
            {#if !data.name}
                <Icon class="mx-auto text-9xl" name="bi-upload" />
            {:else}
                <img class="mx-auto" id="preview" src="/customImages/gallery/{data.name}" alt="preview of project" />
            {/if}
        </FileInput>
    </Group>

    <Group>
        <Label for="date">Datum a čas vyfocení</Label>
        <Group class="w-full flex-row justify-center gap-2">
            <Input id="time" type="time" bind:value={time} />
            <Input id="date" type="date" bind:value={date} />
        </Group>
    </Group>

    <Group>
        <Label for="alt">Krátky popisek</Label>
        <Input id="alt" type="text" bind:value={data.alt} />
    </Group>

    <Group>
        <Label for="equipment">Vybavení</Label>
        <div class="flex flex-row flex-wrap gap-2">
            {#each data.equipment as equipment}
                <div class="rounded-md border-2 border-primary px-1 py-2 text-xl transition-colors duration-200 hover:bg-secondary">
                    {equipment.name}
                    <Icon on:click={() => removeEquipment(equipment.id)} class="cursor-pointer text-red-500" name="bi-trash-fill" />
                </div>
            {/each}
            <Select id="equipment" bind:value={selectedEquipment} class="text-xl font-bold">
                <option value="" selected disabled>Vyber vybavení pro přidání</option>
                {#each equipment.filter((item) => !data.equipment.map((eq) => eq.id).includes(item.id)) as item}
                    <option value={item.id}>{item.name} ({item.type})</option>
                {/each}
            </Select>
        </div>
    </Group>

    <Group>
        <Label for="details">Detaily</Label>
        <div class="flex flex-row flex-wrap gap-2">
            <Select id="details" value="">
                <option value="" selected disabled>+</option>
                {#each detailTypes as detail}
                    <option value={detail.id}>{detail.name}</option>
                {/each}
            </Select>
        </div>
    </Group>

    <Group class="mx-auto flex-row">
        <Button on:click={process}>
            {#if data.id !== undefined}
                Upravit
            {:else}
                Přidat
            {/if}
        </Button>
        <a href="/admin/gallery"><Button class="bg-red-600 hover:bg-red-500">Zpět</Button></a>
    </Group>
</div>
