<script lang="ts">
    const {
        name,
        date,
        image,
        uuid = undefined
    }: {
        name: string;
        date: Date;
        image: string;
        uuid?: string;
    } = $props();
</script>

<a href={uuid ? `/admin/projects/${uuid}` : undefined} class="m-2 mx-auto w-[80%]">
    <div class="flex flex-row items-center bg-primary">
        <img class="max-w-[35%]" src={uuid ? `/customImages/${uuid}/${image}` : image} alt={name} />
        <div class="ml-2 flex flex-col">
            <h1 class="break-all font-ubuntu text-2xl font-bold drop-shadow-md">{name}</h1>
            <p class="drop-shadow-md">
                {date.toLocaleDateString('cs-CZ')}
            </p>
        </div>
    </div>
</a>
