<script lang="ts">
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import Button from '../button.svelte';
    import Group from '../group.svelte';
    import Input from '../input.svelte';
    import Label from '../label.svelte';
    import Select from '../select.svelte';
    import Tag from '../tag.svelte';

    const colors = [
        'bg-slate-500',
        'bg-gray-500',
        'bg-zinc-500',
        'bg-neutral-500',
        'bg-stone-500',
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
        'bg-rose-500'
    ];

    const addTag = async () => {
        if (color === 'default') return;

        const result = await API.tag.PUT({
            text: tagText,
            color: color === 'custom' ? customColor : color
        });

        if (!result.status) {
            SwalAlert({
                icon: 'error',
                title: result.message
            });
            return;
        }

        SwalAlert({
            icon: 'success',
            title: 'Tag byl úspěšně vytvořen'
        });

        handleRefresh();
    };

    let {
        handleCancel,
        handleRefresh,
        buttonName = 'Přidat tag',
        cancelName = 'Zrušit',
        tagText = $bindable(''),
        color = $bindable('default'),
        customColor = $bindable('#00000'),
        handleButton = addTag
    }: {
        handleCancel: () => void;
        handleRefresh: () => void;
        buttonName?: string;
        cancelName?: string;
        tagText?: string;
        color?: string;
        customColor?: string;
        handleButton?: () => void;
    } = $props();
</script>

<Group>
    <Label for="name">Název tagu</Label>
    <Input id="name" type="text" bind:value={tagText} />
</Group>
<Group>
    <Label for="color">Barva</Label>

    <Select id="color" bind:value={color}>
        <option value="default" selected disabled>Vyber barvu</option>
        <option value="custom">Vlastní</option>
        {#each colors.toSorted() as c}
            <option value={c}>
                {c
                    .split('-')[1]
                    .split('')
                    .map((v, i) => (i == 0 ? v.toUpperCase() : v))
                    .join('')}
            </option>
        {/each}
    </Select>
    {#if color === 'custom'}
        <Input type="color" bind:value={customColor} />
    {/if}
</Group>

<Group>
    <Label>Ukázka tagu:</Label>
    <Tag class="mx-auto" color={color === 'custom' ? customColor : (color ?? '')}>{tagText ?? 'Nějaký text'}</Tag>
</Group>

<Group class="mx-auto flex-row">
    <Button onclick={handleButton}>{buttonName}</Button>
    <Button onclick={handleCancel} class="bg-red-600 hover:bg-red-500">{cancelName}</Button>
</Group>
