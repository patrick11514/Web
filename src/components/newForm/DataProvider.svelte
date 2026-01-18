<script lang="ts" generics="T = unknown">
  import { untrack } from 'svelte';
  import { getFormContext, getValue, setValue } from './Form.svelte';

  type DataProviderProps = {
    name: string;
    value?: T;
  };

  let { name, value = $bindable(undefined as T) }: DataProviderProps = $props();

  const context = getFormContext();

  // 1. Sync: External (Parent) -> Internal (Context)
  $effect(() => {
    // We want this to run when 'value' changes
    const v = value;

    // Use untrack on the read of context to ensure this effect ONLY runs
    // when 'value' changes, not when context changes (prevents echo).
    untrack(() => {
      const currentCtxVal = getValue(context, name);
      if (!Object.is(currentCtxVal, v)) {
        setValue(context, name, v);
      }
    });
  });

  // 2. Sync: Internal (Context) -> External (Parent)
  $effect(() => {
    // We want this to run when context value changes
    const ctxVal = getValue(context, name) as T;

    // Use untrack for 'value' to ensure this effect ONLY runs
    // when context changes, not when 'value' changes.
    untrack(() => {
      // FIX: Don't overwrite a defined local value with undefined context
      if (ctxVal === undefined && value !== undefined) return;

      if (!Object.is(ctxVal, value)) {
        value = ctxVal;
      }
    });
  });
</script>
