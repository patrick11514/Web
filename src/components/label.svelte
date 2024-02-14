<script lang="ts">
    let id: string = '';
    export { id as for };
</script>

<label class="font-ubuntu text-2xl font-bold 3xl:text-3xl" for={id}><slot /></label>
