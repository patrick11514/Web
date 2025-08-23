<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  import BaseButton from '../form/Button.svelte';
  import { getFormContext } from './Form.svelte';

  type ButtonProps = SvelteHTMLElements['button'];

  const {
    children,
    class: cls,
    onclick = () => {},
    type,
    ...rest
  }: ButtonProps = $props();

  const context = getFormContext();
</script>

<BaseButton
  {type}
  onclick={type === 'submit' ? context.onSubmitHandler : onclick}
  class={cls}
  {...rest}
>
  {@render children?.()}
</BaseButton>
