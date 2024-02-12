<script lang="ts">
    export let id = '';
    export let value: string | number = '';
    export let type: 'text' | 'password' | 'email' | 'number';
</script>

<input
    class="my-2 origin-bottom-left border-b-4 border-b-primary border-b-transparent bg-transparent text-xl outline-none"
    {id}
    {type}
    {value}
    on:input={(ev) => (value = ev.currentTarget.value)}
/>
