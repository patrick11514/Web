<script lang="ts">
    import Icon from '$/components/Icon.svelte'
    import Navigation from '$/components/navigation.svelte'
    import { page } from '$app/stores'

    const texts = {
        404: {
            title: 'Tak tady jsi špatně',
            description: 'Tato stránka neexistuje'
        }
    }

    const status = $page.status as keyof typeof texts
</script>

<svelte:head>
    <title>Error {status} | patrick115.eu</title>
    <meta name="description" content="Chybová stránka" />
</svelte:head>

<Navigation />

<div class="flex h-full w-full">
    <div class="m-auto">
        <h1 class="font-fira-sans text-4xl font-bold sm:text-5xl"><Icon name="bi-code-slash" /> {texts[status]?.title ?? 'Něco se pokazilo'}</h1>
        <h2 class="text-2xl font-bold sm:text-3xl">{texts[status]?.description ?? 'Zkus to prosím znovu'}</h2>
    </div>
</div>
