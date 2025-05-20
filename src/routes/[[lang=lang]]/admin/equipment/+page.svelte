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
    import ClickOutside from '$/components/utility/clickOutside.svelte';
    import Select from '$/components/form/Select.svelte';

    const _state = getState();

    const { data }: PageProps = $props();

    const typeAdd = (() => {
        return async ({ update, result }) => {
            if (result.type === 'success') {
                SwalAlert({
                    title: _state.lang.admin.equipment.types.success,
                    icon: 'success'
                });
                openTypeAdd = false;
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;

    let typeEditing = $state<null | {
        id: number;
        lang_key: string;
    }>(null);

    const typeDelete = async (id: number) => {
        const result = await SwalAlert({
            timer: 0,
            toast: false,
            position: 'center',
            title: _state.lang.admin.equipment.types.delete.question,
            showConfirmButton: true,
            confirmButtonText: _state.lang.admin.equipment.types.delete.yes,
            showCancelButton: true,
            cancelButtonText: _state.lang.admin.equipment.types.delete.no
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
            title: _state.lang.admin.equipment.types.deleteSuccess,
            icon: 'success'
        });

        invalidateAll();
    };

    const typeEdit = (() => {
        return async ({ update, result }) => {
            if (result.type === 'success') {
                SwalAlert({
                    title: _state.lang.admin.equipment.types.editSuccess,
                    icon: 'success'
                });

                typeEditing = null;
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;

    const equipmentAdd = (() => {
        return async ({ update, result }) => {
            if (result.type === 'success') {
                SwalAlert({
                    title: _state.lang.admin.equipment.equipment.success,
                    icon: 'success'
                });
                openEquipmentAdd = false;
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;

    let equipmentEditing = $state<null | {
        id: number;
        name: string;
        type_id: number;
        link: string;
    }>(null);

    const equipmentEdit = (() => {
        return async ({ update, result }) => {
            if (result.type === 'success') {
                SwalAlert({
                    title: _state.lang.admin.equipment.equipment.editSuccess,
                    icon: 'success'
                });

                equipmentEditing = null;
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;

    const equipmentDelete = async (id: number) => {
        const result = await SwalAlert({
            timer: 0,
            toast: false,
            position: 'center',
            title: _state.lang.admin.equipment.equipment.delete.question,
            showConfirmButton: true,
            confirmButtonText: _state.lang.admin.equipment.equipment.delete.yes,
            showCancelButton: true,
            cancelButtonText: _state.lang.admin.equipment.equipment.delete.no
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
            title: _state.lang.admin.equipment.equipment.deleteSuccess,
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

{#if typeEditing !== null || equipmentEditing !== null}
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen bg-black/80">
        <ClickOutside
            clickoutside={() => {
                typeEditing = null;
                equipmentEditing = null;
            }}
            class="border-primary m-auto flex flex-col gap-2 rounded-md border-2 bg-black/80 p-4"
        >
            {#if typeEditing !== null}
                {@render title(replacePlaceholders(_state.lang.admin.equipment.types.edit.title, typeEditing.id.toString()))}
                <form class="flex flex-col items-center justify-center" method="POST" action="?/typeEdit" use:enhance={typeEdit}>
                    <input type="hidden" name="id" value={typeEditing.id} />
                    <FormItem for="key" label={_state.lang.admin.equipment.types.translateKey}>
                        <Input id="key" name="lang_key" type="text" placeholder={_state.lang.admin.equipment.types.translateKey} value={typeEditing.lang_key} required />
                    </FormItem>
                    <Button type="submit">{_state.lang.admin.equipment.types.edit.button}</Button>
                </form>
            {:else if equipmentEditing !== null}
                {@render title(replacePlaceholders(_state.lang.admin.equipment.equipment.edit.title, equipmentEditing.id.toString()))}
                <form class="flex flex-col items-center justify-center" method="POST" action="?/equipmentEdit" use:enhance={equipmentEdit}>
                    <input type="hidden" name="id" value={equipmentEditing.id} />
                    <FormItem for="name" label={_state.lang.admin.equipment.equipment.name}>
                        <Input id="name" name="name" type="text" placeholder={_state.lang.admin.equipment.equipment.name} value={equipmentEditing.name} required />
                    </FormItem>
                    <FormItem for="type" label={_state.lang.admin.equipment.equipment.type}>
                        <Select id="type" name="type" value={equipmentEditing.type_id} required>
                            {#each data.types as type (type.id.toString())}
                                <option value={type.id} selected={equipmentEditing.type_id === type.id}>{resolveTranslation(type.lang_key, _state.lang)}</option>
                            {/each}
                        </Select>
                    </FormItem>
                    <FormItem for="link" label={_state.lang.admin.equipment.equipment.link}>
                        <Input id="link" name="link" type="url" placeholder={_state.lang.admin.equipment.equipment.link} value={equipmentEditing.link} required />
                    </FormItem>
                    <Button type="submit">{_state.lang.admin.equipment.equipment.edit.button}</Button>
                </form>
            {/if}
        </ClickOutside>
    </div>
{/if}

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

{#if openTypeAdd}
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen bg-black/80">
        <ClickOutside clickoutside={() => (openTypeAdd = false)} class="border-text m-auto flex flex-col rounded-md border-2 bg-black/80 p-4">
            {@render title(_state.lang.admin.equipment.types.addTitle)}
            <form class="border-text flex flex-col items-center justify-center rounded-md border-2 p-2" method="POST" action="?/typeAdd" use:enhance={typeAdd}>
                <FormItem for="key" label={_state.lang.admin.equipment.types.translateKey}>
                    <Input id="key" name="lang_key" type="text" required />
                </FormItem>
                <Button type="submit">{_state.lang.admin.equipment.types.button}</Button>
            </form>
        </ClickOutside>
    </div>
{/if}

{#if openEquipmentAdd}
    <div class="fixed top-0 left-0 z-10 flex h-screen w-screen bg-black/80">
        <ClickOutside clickoutside={() => (openEquipmentAdd = false)} class="border-text m-auto flex flex-col rounded-md border-2 bg-black/80 p-4">
            {@render title(_state.lang.admin.equipment.equipment.addTitle)}
            <form class="border-text flex flex-col items-center justify-center rounded-md border-2 p-2" method="POST" action="?/equipmentAdd" use:enhance={equipmentAdd}>
                <FormItem for="name" label={_state.lang.admin.equipment.equipment.name}>
                    <Input id="name" name="name" type="text" required />
                </FormItem>
                <FormItem for="type" label={_state.lang.admin.equipment.equipment.type}>
                    <Select id="type" name="type" required>
                        <option value={null} disabled selected></option>
                        {#each data.types as type (type.id.toString())}
                            <option value={type.id}>{resolveTranslation(type.lang_key, _state.lang)}</option>
                        {/each}
                    </Select>
                </FormItem>
                <FormItem for="link" label={_state.lang.admin.equipment.equipment.link}>
                    <Input id="link" name="link" type="url" required />
                </FormItem>
                <Button type="submit">{_state.lang.admin.equipment.equipment.button}</Button>
            </form>
        </ClickOutside>
    </div>
{/if}

<section class="mx-auto flex w-full flex-1 flex-col gap-4 p-4 lg:w-[90%] xl:w-[80%]">
    <div class="text-text-inverse flex w-max gap-1 rounded-md bg-gray-600 p-1 font-bold">
        {@render _switch(_state.lang.admin.equipment.types.title, 'types')}
        {@render _switch(_state.lang.admin.equipment.equipment.title, 'equipment')}
    </div>

    {#if section === 'types'}
        <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
            <div class="flex w-full items-center justify-between">
                {@render title(_state.lang.admin.equipment.types.title)}
                <Button onclick={() => (openTypeAdd = true)}>{_state.lang.admin.equipment.types.addTitle}</Button>
            </div>
            {#if data.types.length === 0}
                {@render info(_state.lang.admin.equipment.types.empty)}
            {:else}
                <div class="border-text w-full rounded-md border-2">
                    <table class="[&_tr]:border-b-text w-full table-auto border-collapse text-xl lg:text-2xl [&_tr]:border-b-2">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>{_state.lang.admin.equipment.types.translateKey}</th>
                                <th>{_state.lang.admin.equipment.actions}</th>
                            </tr>
                        </thead>
                        <tbody class="[&_tr:last-child]:border-b-0">
                            {#each data.types as type (type.id.toString())}
                                <tr>
                                    <td class="font-bold">{type.id} </td>
                                    <td>{type.lang_key}</td>
                                    <td class="flex justify-center gap-2">
                                        <Icon
                                            onclick={() =>
                                                (typeEditing = {
                                                    id: type.id,
                                                    lang_key: type.lang_key || ''
                                                })}
                                            name="bi-pencil-fill"
                                            class="cursor-pointer"
                                        />

                                        <Icon onclick={() => typeDelete(type.id)} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    {:else}
        <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
            <div class="flex w-full items-center justify-between">
                {@render title(_state.lang.admin.equipment.equipment.title)}
                <Button onclick={() => (openEquipmentAdd = true)}>{_state.lang.admin.equipment.equipment.addTitle}</Button>
            </div>
            {#if data.equipment.length === 0}
                {@render info(_state.lang.admin.equipment.equipment.empty)}
            {:else}
                <div class="border-text w-full rounded-md border-2">
                    <table class="[&_tr]:border-b-text w-full table-auto border-collapse text-xl lg:text-2xl [&_tr]:border-b-2">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>{_state.lang.admin.equipment.equipment.name}</th>
                                <th>{_state.lang.admin.equipment.equipment.type}</th>
                                <th>{_state.lang.admin.equipment.equipment.link}</th>
                                <th>{_state.lang.admin.equipment.actions}</th>
                            </tr>
                        </thead>
                        <tbody class="[&_tr:last-child]:border-b-0">
                            {#each data.equipment as equipment (equipment.id.toString())}
                                <tr>
                                    <td class="font-bold">{equipment.id} </td>
                                    <td>{equipment.name}</td>
                                    <td>{resolveTranslation(data.types.find((type) => type.id === equipment.type_id)!.lang_key, _state.lang)}</td>
                                    <td>{equipment.link}</td>
                                    <td class="flex justify-center gap-2">
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
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    {/if}
</section>
