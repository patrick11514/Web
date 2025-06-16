<script lang="ts">
    import Button from '$/components/form/Button.svelte';
    import Table from '$/components/table/Table.svelte';
    import TBody from '$/components/table/TBody.svelte';
    import Td from '$/components/table/Td.svelte';
    import Th from '$/components/table/Th.svelte';
    import THead from '$/components/table/THead.svelte';
    import Tr from '$/components/table/Tr.svelte';
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
                <Table>
                    <THead>
                        <Tr>
                            <Th>Id</Th>
                            <Th>{_lang.image}</Th>
                            <Th>{_lang.articleTitle}</Th>
                            <Th>{_lang.published}</Th>
                            <Th>{_lang.lastEdit}</Th>
                            <Th>{_lang.actions}</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {#each data.articles as article (article.id.toString())}
                            <Tr>
                                <Td class="font-bold">{article.id}</Td>
                                <Td class="w-1/12">
                                    {#if article.preview}
                                        <Image class="mx-auto" name={article.preview.name} alt={article.preview.alt_text} />
                                    {/if}
                                </Td>
                                <Td>{article.title}</Td>
                                <Td>{formatDate(article.created_at)}</Td>
                                <Td>{formatDate(article.updated_at)}</Td>
                                <Td>
                                    <Icon onclick={() => goto(`/${_state.selectedLang}/admin/article/${article.id}`)} name="bi-pencil-fill" class="cursor-pointer" />

                                    <Icon onclick={() => {}} name="bi-trash-fill" class="cursor-pointer text-red-500" />
                                </Td>
                            </Tr>
                        {/each}
                    </TBody>
                </Table>
            </div>
        {/if}
    </div>
</section>
