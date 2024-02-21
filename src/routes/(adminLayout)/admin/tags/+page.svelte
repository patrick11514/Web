<script lang="ts">
    import Icon from '$/components/Icon.svelte';
    import Message from '$/components/admin/message.svelte';
    import CreateTag from '$/components/admin/tagCreate.svelte';
    import Button from '$/components/button.svelte';
    import Group from '$/components/group.svelte';
    import Tag from '$/components/tag.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { Tag as TagType } from '$/types/types';
    import { onMount } from 'svelte';

    let creating = false;

    let tags: TagType[] | undefined = undefined;

    const getTags = async () => {
        const result = await API.tag.GET();

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        tags = result.data;
    };

    onMount(() => {
        getTags();
    });

    const remove = async (id: number) => {
        const confirm = await SwalAlert({
            toast: false,
            timer: 0,
            position: 'center',
            title: 'Opravdu chceš smazat tento tag?',
            showConfirmButton: true,
            confirmButtonText: 'Ano',
            showCancelButton: true,
            cancelButtonText: 'Ne'
        });

        if (!confirm.isConfirmed) return;

        const result = await API.tag.DELETE({
            id
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        getTags();
    };
</script>

<div class="flex w-full flex-col gap-1 p-4 xsm:mx-auto xsm:w-[80%] sm:w-[70%] md:w-[60%] lg:max-w-112">
    {#if !creating}
        <Button on:click={() => (creating = true)} class="mx-auto">Vytvořit Tag</Button>

        {#if !tags}
            <Message>Načítání...</Message>
        {:else if tags.length === 0}
            <Message>Žádné tagy nebyly nalezeny.</Message>
        {:else}
            {#each tags as tag}
                <Group class="flex-row gap-1">
                    <a class="flex w-full" href="/admin/tags/{tag.id}">
                        <Tag class="w-full py-2 text-center" color={tag.color}>{tag.name}</Tag>
                    </a>
                    <button on:click={() => remove(tag.id)} class="text-xl text-red-500"><Icon name="bi-trash-fill" /></button>
                </Group>
            {/each}
        {/if}
    {:else}
        <CreateTag
            handleCancel={() => (creating = false)}
            handleRefresh={() => {
                getTags();
                creating = false;
            }}
        />
    {/if}
</div>
