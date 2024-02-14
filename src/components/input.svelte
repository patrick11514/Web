<script lang="ts">
    export let id = '';
    export let value: string | number = '';
    export let type: 'text' | 'password' | 'email' | 'number' | 'date' | 'datetime';
</script>

<input
    class="my-2 origin-bottom-left rounded-md border-b-4 border-b-primary border-b-transparent bg-accent px-2 py-1 text-xl text-text outline-none 3xl:text-2xl"
    {id}
    {type}
    {value}
    on:input={(ev) => (value = ev.currentTarget.value)}
/>
