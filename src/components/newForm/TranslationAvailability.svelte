<script lang="ts">
  import { languages } from '$/lib/lang';
  import Icon from '../utility/Icon.svelte';
  import type { MultiLangFormContext } from './Form.svelte';

  type TranslationAvailabilityProps = {
    context: MultiLangFormContext;
    path: string;
  };

  const { context, path }: TranslationAvailabilityProps = $props();

  const errors = $derived(context.errors());
  const data = $derived(context.data);
  const defaultValue = context.defaultData;
</script>

<div class="flex items-center justify-center gap-2 pb-2">
  {#each Object.entries(languages) as [lang, langData] (lang)}
    {@const langErrors = (errors as unknown as Record<string, Record<string, string>>)[
      lang
    ]}
    {@const error = langErrors?.[path]}
    {@const langData_ = (data as Record<string, Record<string, unknown>>)[lang]}
    {@const value = langData_?.[path]}
    {@const langDefault = (defaultValue as Record<string, Record<string, unknown>>)[lang]}
    {@const defaultVal = langDefault?.[path]}
    {@const isDefaultValue = defaultVal === '' || defaultVal === null}
    {@const isValid =
      error === undefined && (isDefaultValue ? value !== defaultVal : true)}
    <div class="border-text rounded-full border-2 px-2 py-1">
      <Icon
        name={isValid ? 'bi-check' : 'bi-x'}
        class={isValid ? 'text-green-500' : 'text-red-500'}
      />
      {langData.flag}
    </div>
  {/each}
</div>
