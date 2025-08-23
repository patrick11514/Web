<script lang="ts" generics="$Value = unknown">
  import { getFormContext, getValue, setValue } from './Form.svelte';

  // Bridges an external bound value with an internal form field (multi-lang aware)
  type DataProviderProps<$Value> = {
    name: string;
    value?: $Value;
  };

  let {
    name,
    value = $bindable(undefined as unknown as $Value)
  }: DataProviderProps<$Value> = $props();

  const context = getFormContext();

  // Sync from context -> external binding
  $effect(() => {
    const ctxVal = getValue(context, name) as $Value;
    if (!Object.is(ctxVal, value)) value = ctxVal;
  });

  // Sync from external binding -> context
  $effect(() => {
    const ctxVal = getValue(context, name);
    if (!Object.is(ctxVal, value)) setValue(context, name, value);
  });
</script>
