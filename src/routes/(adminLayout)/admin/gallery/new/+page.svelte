<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import FileInput from '$/components/admin/fileInput.svelte';
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import { goto } from '$app/navigation';

    let image = '';
    let date = '';
    let time = '';
    let alt = '';

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

        image = result.data;
    };

    const add = async () => {
        if (!image || !date || !time || !alt) {
            SwalAlert({
                icon: 'error',
                title: 'Všechny pole musí být vyplněny'
            });
            return;
        }

        const fullDate = new Date(`${date}T${time}`);

        const data = await API.gallery.PUT({
            date: fullDate,
            image,
            alt
        });

        if (!data.status) {
            SwalAlert({
                icon: 'error',
                title: data.message
            });
            return;
        }

        goto('/admin/gallery');
    };
</script>

<div class="m-2 mx-auto flex w-full flex-col p-4 sm:w-[80%] md:w-[75%]">
    <Group>
        <Label for="preview">Obrázek</Label>
        <FileInput onDrop={handleDrop}>
            <div class="m-2 mx-auto flex w-[80%] rounded-lg p-2 transition-colors duration-200 hover:bg-secondary">
                {#if !image}
                    <Icon class="mx-auto text-9xl" name="bi-upload" />
                {:else}
                    <img class="mx-auto" id="preview" src={image} alt="preview of project" />
                {/if}
            </div>
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
        <Input id="alt" type="text" bind:value={alt} />
    </Group>

    <Group class="mx-auto flex-row">
        <Button on:click={add}>Přidat</Button>
        <a href="/admin/gallery"><Button class="bg-red-600 hover:bg-red-500">Zpět</Button></a>
    </Group>
</div>
