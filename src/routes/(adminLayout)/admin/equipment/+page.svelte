<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import Button from '$/components/button.svelte';
    import Link from '$/components/link.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { EquipmentInfo } from '$/types/types';
    import type { PageServerData } from './$types';

    export let data: PageServerData;

    let equipments: EquipmentInfo[] = [];

    const getEquipment = (response: (typeof data)['equipment']) => {
        equipments = response.data.toSorted((a, b) => {
            return a.type_id - b.type_id;
        });
    };

    getEquipment(data.equipment);

    const fetchEquipment = async () => {
        const response = await API.equipment.GET();

        getEquipment(response);
    };

    const deleteEquipment = async (id: number) => {
        const confirmation = await SwalAlert({
            toast: false,
            timer: 0,
            position: 'center',
            title: 'Opravdu chceš smazat toto vybavení?',
            showCancelButton: true,
            cancelButtonText: 'Zrušit',
            showConfirmButton: true,
            confirmButtonText: 'Ano'
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const response = await API.equipment.DELETE(id);

        if (!response.status) {
            SwalAlert({
                icon: 'error',
                title: response.message
            });
            return;
        }

        SwalAlert({
            title: 'Vybavení bylo smazáno.',
            icon: 'error'
        });

        fetchEquipment();
    };
</script>

<section class="flex h-min w-full flex-row flex-wrap items-center justify-center gap-2 p-4">
    {#each equipments as equipment}
        <div class="rounded-md border-2 border-primary px-2 py-1 text-xl font-bold transition-colors duration-200 hover:bg-secondary">
            <Link href="/admin/equipment/{equipment.id}" external={false}>{equipment.name}</Link>
            <Icon on:click={() => deleteEquipment(equipment.id)} class="cursor-pointer text-red-500" name="bi-trash-fill" />
        </div>
    {/each}
    <a href="/admin/equipment/new"><Button>Přidat vybavení</Button></a>
</section>
