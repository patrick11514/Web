<script lang="ts">
  import { languages } from '$/lib/lang';
  import Icon from '../utility/Icon.svelte';
  import type { MultiLangFormContext } from './Form.svelte';

  type TranslationAvailabilityProps = {
    context: MultiLangFormContext;
    path: string;
  };

  const { context, path }: TranslationAvailabilityProps = $props();

  const _languages = Object.entries(languages);
  const errors = $derived(context.errors());
  const data = $derived(context.data);
  const defaultValue = context.defaultData;
</script>

<div class="flex items-center justify-center gap-2 pb-2">
  {#each _languages as [lang, langData] (lang)}
    {@const error = errors[lang][path]}
    {@const value = data[lang][path]}
    {@const isDefaultValue = defaultValue[path] === '' || defaultValue[path] === null}
    {@const isValid =
      error === undefined && (isDefaultValue ? value !== defaultValue[path] : true)}
    <div class="border-text rounded-full border-2 px-2 py-1">
      <Icon
        name={isValid ? 'bi-check' : 'bi-x'}
        class={isValid ? 'text-green-500' : 'text-red-500'}
      />
      {langData.flag}
    </div>
  {/each}
</div>
