<script lang="ts">
    import FormItem from '$/components/form/FormItem.svelte';
    import Input from '$/components/form/Input.svelte';
    import TextArea from '$/components/form/TextArea.svelte';
    import Card from '$/components/utility/Card.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import { getState } from '$/lib/state.svelte';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const editing = $derived(data.article !== undefined);

    const _state = getState();
    const _lang = $derived(_state.lang.admin.article.form);

    let showPreview = $state(false);
</script>

{#snippet subTitle(text: string)}
    <h2 class="text-2xl font-bold lg:text-3xl">{text}</h2>
{/snippet}

<section class="mx-auto flex w-full flex-1 p-4 lg:w-[90%] xl:w-[80%]">
    <form class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
        <a href="/{_state.selectedLang}/admin/article">
            <Icon name="bi-chevron-left" />
            {_lang.back}
        </a>

        <h1 class="border-b-text mb-4 w-max border-b-2 text-center text-3xl font-bold lg:text-4xl">{editing ? _lang.editTitle : _lang.createTitle}</h1>
        <Card>
            {@render subTitle(_lang.details.title)}
            <FormItem for="title" label={_lang.details.titleInput} variant="small">
                <Input id="title" name="title" placeholder={_lang.details.titlePlaceholder} />
            </FormItem>
            <FormItem for="content" label={_lang.details.content} variant="small">
                {#snippet right()}
                    <div><input type="checkbox" bind:checked={showPreview} /> {showPreview ? _lang.details.previewContent : _lang.details.editContent}</div>
                {/snippet}
                <TextArea id="content" name="content" placeholder={_lang.details.contentPlaceholder} />
            </FormItem>
        </Card>
    </form>
</section>
