<script lang="ts" generics="$Type extends object">
  import { resolveObject } from '$/lib/functions';
  import { languages } from '$/lib/lang';
  import type { Path } from '$/types/types';
  import { validate } from 'uuid';
  import Icon from './Icon.svelte';

  type TranslationAvailabilityProps<$Type extends object> = {
    object: Record<string, $Type>;
    path: Path<$Type>;
  };

  const { object, path }: TranslationAvailabilityProps<$Type> = $props();

  const _languages = Object.entries(languages);
</script>

<div class="flex items-center justify-center gap-2 pb-2">
  {#each _languages as [lang, data] (lang)}
    {@const translations = object[lang]}
    {@const resolved = resolveObject(path, translations)}
    {@const isValid = !validate(resolved) || resolved === ''}
    <div class="border-text rounded-full border-2 px-2 py-1">
      <Icon
        name={isValid ? 'bi-check' : 'bi-x'}
        class={isValid ? 'text-green-500' : 'text-red-500'}
      />
      {data.flag}
    </div>
  {/each}
</div>
