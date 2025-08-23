<script lang="ts">
  import { languages } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import H3 from '../headers/H3.svelte';
  import Icon from '../utility/Icon.svelte';
  import Button from './Button.svelte';
  import { getFormContext } from './Form.svelte';

  const context = getFormContext();
</script>

<div class="flex items-center gap-2">
  <H3 class="text-text-muted">
    <Icon name="bi-translate" />
    {getState().lang.language}:
  </H3>
  {#each Object.entries(languages) as [lang, data] (lang)}
    <Button
      type="button"
      class={{
        'bg-primary-600': context.lang.selectedLanguage === lang
      }}
      onclick={() => (context.lang.selectedLanguage = lang)}
    >
      {data.flag}
      {data.name}
    </Button>
  {/each}
</div>
