<script lang="ts">
    import Button from '$/components/form/Button.svelte';
    import FormItem from '$/components/form/FormItem.svelte';
    import Input from '$/components/form/Input.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import { enhance } from '$app/forms';
    import type { PageProps, SubmitFunction } from './$types';
    import { SwalAlert } from '$/lib/functions';
    import { getState } from '$/lib/state.svelte';
    import { resolveError, replacePlaceholders } from '$/lib/lang';
    import { API } from '$/lib/api';
    import { invalidateAll } from '$app/navigation';
    import ClickOutside from '$/components/utility/clickOutside.svelte';

    const _state = getState();

    const { data }: PageProps = $props();

    const typeAdd = (() => {
        return async ({ update, result }) => {
            if (result.type === 'success') {
                SwalAlert({
                    title: _state.lang.admin.equipment.types.success,
                    icon: 'success'
                });
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;

    let editing = $state<null | {
        id: number;
        lang_key: string;
    }>(null);

    const deleteType = async (id: number) => {
        const result = await SwalAlert({
            timer: 0,
            toast: false,
            position: 'center',
            title: 'Opravdu chceš smazat tento typ?',
            showConfirmButton: true,
            confirmButtonText: 'Ano',
            showCancelButton: true,
            cancelButtonText: 'Ne'
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

                editing = null;
            } else if (result.type === 'failure' && result.data) {
                SwalAlert({
                    title: resolveError(result.data.message, _state.lang),
                    icon: 'error'
                });
            }

            update();
        };
    }) satisfies SubmitFunction;
</script>

{#snippet title(text: string)}
    <h1 class="border-b-text mb-4 w-max border-b-2 text-center text-3xl font-bold lg:text-4xl">{text}</h1>
{/snippet}

{#snippet info(text: string)}
    <span class="font-poppins m-auto text-2xl font-bold lg:text-3xl"><Icon name="bi-ban-fill" class="text-red-500" /> {text}</span>
{/snippet}

{#if editing !== null}
    <div class="absolute top-0 left-0 z-10 flex h-screen w-screen bg-black/80">
        <ClickOutside clickoutside={() => (editing = null)} class="border-primary m-auto flex flex-col gap-2 rounded-md border-2 bg-black/80 p-4">
            {@render title(replacePlaceholders(_state.lang.admin.equipment.types.edit.title, editing.id.toString()))}
            <form class="flex flex-col items-center justify-center" method="POST" action="?/typeEdit" use:enhance={typeEdit}>
                <input type="hidden" name="id" value={editing.id} />
                <FormItem for="key" label={_state.lang.admin.equipment.types.translateKey}>
                    <Input id="key" name="lang_key" type="text" placeholder={_state.lang.admin.equipment.types.translateKey} value={editing.lang_key} required />
                </FormItem>
                <Button type="submit">{_state.lang.admin.equipment.types.edit.button}</Button>
            </form>
        </ClickOutside>
    </div>
{/if}

<section class="flex w-full flex-1 flex-col p-4">
    <div class="flex flex-col">
        {@render title(_state.lang.admin.equipment.types.title)}
        <div class="flex flex-col justify-between gap-2 md:flex-row">
            <div class="min-w-full md:min-w-1/2">
                {#if data.types.length === 0}
                    {@render info(_state.lang.admin.equipment.types.empty)}
                {:else}
                    <table class="border-text w-full table-auto border-collapse rounded-md border-2 text-xl lg:text-2xl">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>{_state.lang.admin.equipment.types.translateKey}</th>
                                <th>{_state.lang.admin.equipment.types.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each data.types as type (type.id.toString())}
                                <tr class="border-text border-2">
                                    <td class="font-bold">{type.id} </td>
                                    <td>{type.lang_key}</td>
                                    <td class="flex justify-center gap-2">
                                        <Icon
                                            onclick={() =>
                                                (editing = {
                                                    id: type.id,
                                                    lang_key: type.lang_key || ''
                                                })}
                                            name="bi-pencil-fill"
                                            class="cursor-pointer"
                                        />

                                        <Icon onclick={() => deleteType(type.id)} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {/if}
            </div>
            <form class="border-text flex flex-col items-center justify-center rounded-md border-2 p-2" method="POST" action="?/typeAdd" use:enhance={typeAdd}>
                <FormItem for="key" label={_state.lang.admin.equipment.types.translateKey}>
                    <Input id="key" name="lang_key" type="text" placeholder={_state.lang.admin.equipment.types.translateKey} required />
                </FormItem>
                <Button type="submit">{_state.lang.admin.equipment.types.button}</Button>
            </form>
        </div>
    </div>
    <div class="flex flex-col items-center">
        {@render title('Equipment')}
        <p class="mt-4">You can contact me at</p>
    </div>
</section>
