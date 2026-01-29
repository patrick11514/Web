<script lang="ts">
  type Props = {
    radius: number; // pixels
  };
  const { radius }: Props = $props();
</script>

<div
  class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
  style:width="{radius * 2}px"
  style:height="{radius * 2}px"
></div>
