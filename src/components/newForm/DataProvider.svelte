<script lang="ts" generics="T = unknown">
  import { getFormContext, getValue, setValue } from './Form.svelte';

  type DataProviderProps = {
    name: string;
    value?: T;
  };

  let { name, value = $bindable(undefined as T) }: DataProviderProps = $props();

  const context = getFormContext();

  // Sync from context -> external binding
  $effect(() => {
    const ctxVal = getValue(context, name) as T;
    if (!Object.is(ctxVal, value)) value = ctxVal;
  });

  // Sync from external binding -> context
  $effect(() => {
    const ctxVal = getValue(context, name);
    if (!Object.is(ctxVal, value)) setValue(context, name, value);
  });
</script>
