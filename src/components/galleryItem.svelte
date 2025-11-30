<script lang="ts">
    import { API } from '$/lib/api';
    import { SwalAlert, formatDate } from '$/lib/functions';
    import type { EquipmentInfo, GalleryItem } from '$/types/types';
    import { twMerge } from 'tailwind-merge';
    import Icon from './Icon.svelte';
    import Group from './group.svelte';
    import Link from './link.svelte';

    const {
        class: cls,
        admin = false,
        data = $bindable()
    }: {
        admin: boolean;
        class: string;
        data: GalleryItem;
    } = $props();

    const remove = async (ev: MouseEvent) => {
        ev.preventDefault();

        const confirmation = await SwalAlert({
            toast: false,
            timer: 0,
            position: 'center',
            title: 'Opravdu chceš smazat tento obrázek?',
            showCancelButton: true,
            cancelButtonText: 'Zrušit',
            showConfirmButton: true,
            confirmButtonText: 'Ano'
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const response = await API.gallery.DELETE(data.id);

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: 'Nepovedlo se smazat obrázek'
            });

            return;
        }

        SwalAlert({
            icon: 'success',
            title: 'Obrázek byl smazán'
        });
    };

    let transformedEquipment: Record<string, EquipmentInfo[]> = {};

    for (const item of data.equipment.toSorted((a, b) => {
        return a.type_id - b.type_id;
    })) {
        if (!(item.type in transformedEquipment)) {
            transformedEquipment[item.type] = [];
        }

        transformedEquipment[item.type].push(item);
    }
</script>

<a
    class={twMerge('duration-400 m-0.5 inline-block h-full w-full rounded-sm border-1 border-white bg-white bg-opacity-0 transition-all hover:bg-opacity-5', cls)}
    href={admin ? `/admin/gallery/${data.id}` : `/customImages/gallery/${data.name}?format=jpeg`}
    target={admin ? undefined : '_blank'}
>
    <img class="h-auto w-full" src="/customImages/gallery/{data.name}?format=jpeg&scale=50" alt={data.alt} loading="lazy" />
    <div class="flex flex-col p-2">
        <h2 class="font-ubuntu font-bold lg:text-xl xl:text-2xl">
            {data.alt}
            {#if admin}
                <Icon onclick={remove} class="cursor-pointer text-red-500" name="bi-trash-fill" />
            {/if}
        </h2>
        <Group>
            <h2 class="font-ubuntu font-bold lg:text-lg xl:text-xl">Datum Pořízení:</h2>
            <h3>{formatDate(data.date)}</h3>
        </Group>
        {#if Object.keys(transformedEquipment).length > 0}
            <Group>
                <h2 class="font-ubuntu font-bold lg:text-lg xl:text-xl">Vybavení:</h2>
                {#each Object.entries(transformedEquipment) as [name, items]}
                    <Group>
                        <h3 class="font-ubuntu lg:text-lg xl:text-xl">{name}:</h3>
                        <ul>
                            {#each items as item}
                                <Link
                                    href={item.link}
                                    class="before:content flex w-max text-lg font-bold before:m-1 before:my-auto before:block before:h-2 before:w-2 before:rounded-full before:bg-primary"
                                    button={true}
                                >
                                    {item.name}
                                </Link>
                            {/each}
                        </ul>
                    </Group>
                {/each}
            </Group>
        {/if}
    </div>
</a>
