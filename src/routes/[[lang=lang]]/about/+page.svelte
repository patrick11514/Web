<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';

  const _state = getState();
  const lang = $derived(_state.lang.about);
</script>

<section class="flex h-full w-full flex-1 flex-col items-center gap-4">
  <H1>{lang.title}</H1>
</section>
