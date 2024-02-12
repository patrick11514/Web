<script lang="ts">
    export let name: string;
    export let date: Date;
    export let image: string;
    export let uuid: string;
</script>

<a href="/admin/projects/{uuid}" class="m-2 mx-auto h-full w-[80%]">
    <div class="flex flex-row items-center bg-primary">
        <img class="max-w-[35%]" src={image} alt={name} />
        <div class="ml-2 flex flex-col">
            <h1 class="font-ubuntu text-2xl font-bold drop-shadow-md">{name}</h1>
            <p class="drop-shadow-md">
                {date.toLocaleDateString('cs-CZ', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}
            </p>
        </div>
    </div>
</a>
