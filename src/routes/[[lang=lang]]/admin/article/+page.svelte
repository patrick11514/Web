<script lang="ts">
    import Button from '$/components/form/Button.svelte';
    import Icon from '$/components/utility/Icon.svelte';
    import Image from '$/components/utility/Image.svelte';
    import { formatDate } from '$/lib/functions';
    import { getState } from '$/lib/state.svelte';
    import { goto } from '$app/navigation';
    import type { PageProps } from './$types';

    const { data }: PageProps = $props();

    const _state = getState();
    const _lang = $derived(_state.lang.admin.article);
</script>

<section class="mx-auto flex w-full flex-1 p-4 lg:w-[90%] xl:w-[80%]">
    <div class="border-text flex w-full flex-col items-start rounded-md border-2 p-4">
        <div class="flex w-full items-center justify-between">
            <h1 class="border-b-text mb-4 w-max border-b-2 text-center text-3xl font-bold lg:text-4xl">{_lang.title}</h1>
            <Button onclick={() => goto(`/${_state.selectedLang}/admin/article/new`)}>{_lang.create}</Button>
        </div>
        {#if data.articles.length === 0}
            <span class="font-poppins m-auto text-2xl font-bold lg:text-3xl"><Icon name="bi-ban-fill" class="text-red-500" /> {_lang.empty}</span>
        {:else}
            <div class="border-text w-full rounded-md border-2">
                <table class="[&_tr]:border-b-text w-full table-auto border-collapse text-xl lg:text-2xl [&_tr]:border-b-2">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>{_lang.image}</th>
                            <th>{_lang.articleTitle}</th>
                            <th>{_lang.published}</th>
                            <th>{_lang.lastEdit}</th>
                            <th>{_lang.actions}</th>
                        </tr>
                    </thead>
                    <tbody class="[&_tr:last-child]:border-b-0">
                        {#each data.articles as article (article.id.toString())}
                            <tr>
                                <td class="font-bold">{article.id}</td>
                                <td>
                                    {#if article.preview}
                                        <Image name={article.preview.name} alt={article.preview.alt_text} />
                                    {/if}
                                </td>
                                <th>{article.title}</th>
                                <th>{formatDate(article.created_at)}</th>
                                <th>{formatDate(article.updated_at)}</th>
                                <td class="flex justify-center gap-2">
                                    <Icon onclick={() => {}} name="bi-pencil-fill" class="cursor-pointer" />

                                    <Icon onclick={() => {}} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</section>
