<script lang="ts">
  let { count, index = $bindable() }: { count: number; index: number } = $props();
</script>

<div class="flex items-center justify-center gap-2 text-4xl">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars !-->
  {#each Array.from({ length: count }) as _, i (i)}
    <button
      onclick={() => (index = i)}
      aria-label="Button changing image"
      class={{
        'h-2 w-2 cursor-pointer rounded-full': true,
        'bg-text': i === index,
        'bg-text-muted': i !== index
      }}
    ></button>
  {/each}
</div>
