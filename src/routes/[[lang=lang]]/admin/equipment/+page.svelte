<script lang="ts">
    import Button from '$/components/form/Button.svelte';
    import FormItem from '$/components/form/FormItem.svelte';
    import Input from '$/components/form/Input.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import { enhance } from '$app/forms';
    import type { PageProps, SubmitFunction } from './$types';
    import { SwalAlert } from '$/lib/functions';
    import { getState } from '$/lib/state.svelte';
    import { resolveError, replacePlaceholders, resolveTranslation } from '$/lib/lang';
    import { API } from '$/lib/api';
    import { invalidateAll } from '$app/navigation';
    import Select from '$/components/form/Select.svelte';
    import Dialog from '$/components/utility/Dialog.svelte';
    import Table from '$/components/table/Table.svelte';
    import THead from '$/components/table/THead.svelte';
    import Tr from '$/components/table/Tr.svelte';
    import Th from '$/components/table/Th.svelte';
    import TBody from '$/components/table/TBody.svelte';
    import Td from '$/components/table/Td.svelte';

    const _state = getState();
    const _lang = $derived(_state.lang.admin.equipment);

    const { data }: PageProps = $props();

    const createSubmitFunction = (successMessage: string, resetFn = () => {}): SubmitFunction => {
        return (() => {
            return async ({ update, result }) => {
                if (result.type === 'success') {
                    SwalAlert({
                        title: successMessage,
                        icon: 'success'
                    });
                    resetFn();
                } else if (result.type === 'failure' && result.data) {
                    SwalAlert({
                        title: resolveError(result.data.message, _state.lang),
                        icon: 'error'
                    });
                }

                update();
            };
        }) satisfies SubmitFunction;
    };

    let typeEditing = $state<null | {
        id: number;
        lang_key: string;
        priority: number;
    }>(null);

    const typeDelete = async (id: number) => {
        const result = await SwalAlert({
            timer: 0,
            toast: false,
            position: 'center',
            title: _lang.types.delete.question,
            showConfirmButton: true,
            confirmButtonText: _state.lang.yes,
            showCancelButton: true,
            cancelButtonText: _state.lang.no
        });

        if (!result.isConfirmed) return;

        const response = await API.types.DELETE(id);
        if (!response.status) {
            SwalAlert({
                title: resolveError(response.message, _state.lang),
                icon: 'error'
            });
            return;
        }

        SwalAlert({
            title: _lang.types.deleteSuccess,
            icon: 'success'
        });

        invalidateAll();
    };

    let equipmentEditing = $state<null | {
        id: number;
        name: string;
        type_id: number;
        link: string;
    }>(null);

    const equipmentDelete = async (id: number) => {
        const result = await SwalAlert({
            timer: 0,
            toast: false,
            position: 'center',
            title: _lang.equipment.delete.question,
            showConfirmButton: true,
            confirmButtonText: _state.lang.yes,
            showCancelButton: true,
            cancelButtonText: _state.lang.no
        });

        if (!result.isConfirmed) return;

        const response = await API.equipment.DELETE(id);
        if (!response.status) {
            SwalAlert({
                title: resolveError(response.message, _state.lang),
                icon: 'error'
            });
            return;
        }

        SwalAlert({
            title: _lang.equipment.deleteSuccess,
            icon: 'success'
        });

        invalidateAll();
    };

    let section = $state<'types' | 'equipment'>('types');
    let openTypeAdd = $state(false);
    let openEquipmentAdd = $state(false);
</script>

{#snippet title(text: string)}
    <h1 class="border-b-text mb-4 w-max border-b-2 text-center text-3xl font-bold lg:text-4xl">{text}</h1>
{/snippet}

{#snippet info(text: string)}
    <span class="font-poppins m-auto text-2xl font-bold lg:text-3xl"><Icon name="bi-ban-fill" class="text-red-500" /> {text}</span>
{/snippet}

{#snippet _switch(text: string, name: typeof section)}
    <button
        onclick={() => (section = name)}
        class={{
            'cursor-pointer rounded-sm p-1': true,
            'bg-primary-text': section === name,
            'text-text-muted': section !== name
        }}>{text}</button
    >
{/snippet}

<Dialog opened={typeEditing !== null} onClose={() => (typeEditing = null)}>
    {@render title(replacePlaceholders(_lang.types.edit.title, typeEditing!.id.toString()))}
    <form
        class="flex flex-col items-center justify-center"
        method="POST"
        action="?/typeEdit"
        use:enhance={createSubmitFunction(_lang.types.editSuccess, () => (typeEditing = null))}
    >
        <input type="hidden" name="id" value={typeEditing!.id} />
        <FormItem for="key" label={_lang.types.translateKey}>
            <Input id="key" name="lang_key" type="text" placeholder={_lang.types.translateKey} value={typeEditing!.lang_key} required />
        </FormItem>
        <FormItem for="priority" label={_lang.types.priority}>
            <Input id="priority" name="priority" type="number" value={typeEditing!.priority} min={0} required />
        </FormItem>
        <Button type="submit">{_lang.types.edit.button}</Button>
    </form>
</Dialog>

<Dialog opened={equipmentEditing !== null} onClose={() => (equipmentEditing = null)}>
    {@render title(replacePlaceholders(_lang.equipment.edit.title, equipmentEditing!.id.toString()))}
    <form
        class="flex flex-col items-center justify-center"
        method="POST"
        action="?/equipmentEdit"
        use:enhance={createSubmitFunction(_lang.equipment.editSuccess, () => (equipmentEditing = null))}
    >
        <input type="hidden" name="id" value={equipmentEditing!.id} />
        <FormItem for="name" label={_lang.equipment.name}>
            <Input id="name" name="name" type="text" placeholder={_lang.equipment.name} value={equipmentEditing!.name} required />
        </FormItem>
        <FormItem for="type" label={_lang.equipment.type}>
            <Select id="type" name="type" value={equipmentEditing!.type_id} required>
                {#each data.types as type (type.id.toString())}
                    <option value={type.id}>{resolveTranslation(type.lang_key, _state.lang)}</option>
                {/each}
            </Select>
        </FormItem>
        <FormItem for="link" label={_lang.equipment.link}>
            <Input id="link" name="link" type="url" placeholder={_lang.equipment.link} value={equipmentEditing!.link} required />
        </FormItem>
        <Button type="submit">{_lang.equipment.edit.button}</Button>
    </form>
</Dialog>

<Dialog bind:opened={openTypeAdd}>
    {@render title(_lang.types.addTitle)}
    <form
        class="border-text flex flex-col items-center justify-center rounded-md border-2 p-2"
        method="POST"
        action="?/typeAdd"
        use:enhance={createSubmitFunction(_lang.types.success, () => (openTypeAdd = false))}
    >
        <FormItem for="key" label={_lang.types.translateKey}>
            <Input id="key" name="lang_key" type="text" required />
        </FormItem>
        <FormItem for="priority" label={_lang.types.priority}>
            <Input id="priority" name="priority" type="number" value={0} min={0} required />
        </FormItem>
        <Button type="submit">{_lang.types.button}</Button>
    </form>
</Dialog>

<Dialog bind:opened={openEquipmentAdd}>
    {@render title(_lang.equipment.addTitle)}
    <form
        class="border-text flex flex-col items-center justify-center rounded-md border-2 p-2"
        method="POST"
        action="?/equipmentAdd"
        use:enhance={createSubmitFunction(_lang.equipment.success, () => (openEquipmentAdd = false))}
    >
        <FormItem for="name" label={_lang.equipment.name}>
            <Input id="name" name="name" type="text" required />
        </FormItem>
        <FormItem for="type" label={_lang.equipment.type}>
            <Select id="type" name="type" required>
                <option value={null} disabled selected></option>
                {#each data.types as type (type.id.toString())}
                    <option value={type.id}>{resolveTranslation(type.lang_key, _state.lang)}</option>
                {/each}
            </Select>
        </FormItem>
        <FormItem for="link" label={_lang.equipment.link}>
            <Input id="link" name="link" type="url" required />
        </FormItem>
        <Button type="submit">{_lang.equipment.button}</Button>
    </form>
</Dialog>

<section class="mx-auto flex w-full flex-1 flex-col gap-4 p-4 lg:w-[90%] xl:w-[80%]">
    <div class="text-text-inverse flex w-max gap-1 rounded-md bg-gray-600 p-1 font-bold">
        {@render _switch(_lang.types.title, 'types')}
        {@render _switch(_lang.equipment.title, 'equipment')}
    </div>

    {#if section === 'types'}
        <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
            <div class="flex w-full items-center justify-between">
                {@render title(_lang.types.title)}
                <Button onclick={() => (openTypeAdd = true)}>{_lang.types.addTitle}</Button>
            </div>
            {#if data.types.length === 0}
                {@render info(_lang.types.empty)}
            {:else}
                <div class="border-text w-full rounded-md border-2">
                    <Table class="text-center">
                        <THead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>{_lang.types.translateKey}</Th>
                                <Th>{_lang.types.priority}</Th>
                                <Th>{_lang.actions}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {#each data.types as type (type.id.toString())}
                                <Tr>
                                    <Td class="font-bold">{type.id}</Td>
                                    <Td>{type.lang_key}</Td>
                                    <Td>{type.priority}</Td>
                                    <Td class="flex justify-center gap-2">
                                        <Icon
                                            onclick={() =>
                                                (typeEditing = {
                                                    id: type.id,
                                                    lang_key: type.lang_key || '',
                                                    priority: type.priority || 0
                                                })}
                                            name="bi-pencil-fill"
                                            class="cursor-pointer"
                                        />

                                        <Icon onclick={() => typeDelete(type.id)} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                    </Td>
                                </Tr>
                            {/each}
                        </TBody>
                    </Table>
                </div>
            {/if}
        </div>
    {:else}
        <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
            <div class="flex w-full items-center justify-between">
                {@render title(_lang.equipment.title)}
                <Button onclick={() => (openEquipmentAdd = true)}>{_lang.equipment.addTitle}</Button>
            </div>
            {#if data.equipment.length === 0}
                {@render info(_lang.equipment.empty)}
            {:else}
                <div class="border-text w-full rounded-md border-2">
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>{_lang.equipment.name}</Th>
                                <Th>{_lang.equipment.type}</Th>
                                <Th>{_lang.equipment.link}</Th>
                                <Th>{_lang.actions}</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {#each data.equipment as equipment (equipment.id.toString())}
                                <Tr>
                                    <Td class="font-bold">{equipment.id}</Td>
                                    <Td>{equipment.name}</Td>
                                    <Td class="pr-2">{resolveTranslation(data.types.find((type) => type.id === equipment.type_id)!.lang_key, _state.lang)}</Td>
                                    <Td>{equipment.link}</Td>
                                    <Td class="flex justify-center gap-2">
                                        <Icon
                                            onclick={() => {
                                                equipmentEditing = {
                                                    id: equipment.id,
                                                    name: equipment.name,
                                                    type_id: equipment.type_id,
                                                    link: equipment.link
                                                };
                                            }}
                                            name="bi-pencil-fill"
                                            class="cursor-pointer"
                                        />

                                        <Icon onclick={() => equipmentDelete(equipment.id)} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                    </Td>
                                </Tr>
                            {/each}
                        </TBody>
                    </Table>
                </div>
            {/if}
        </div>
    {/if}
</section>
