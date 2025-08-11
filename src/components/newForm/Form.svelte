<script module>
  import { languages } from '../../lib/lang/index';

  type Language = keyof typeof languages;

  type Errors = Record<string, string | undefined>;

  type BaseFormContext = {
    defaultData: Record<string, unknown>;
    onSubmitHandler: () => void;
  };

  export type MultiLangFormContext = BaseFormContext & {
    data: Record<Language, Record<string, unknown>>;
    multiLang: true;
    lang: {
      selectedLanguage: Language;
    };
    errors: () => Record<Language, Errors>;
  };

  export type NonMultiLangFormContext = BaseFormContext & {
    data: Record<string, unknown>;
    multiLang: false;
    lang: {
      selectedLanguage: Language;
    };
    errors: () => Errors;
  };

  type FormContext = MultiLangFormContext | NonMultiLangFormContext;

  export const getFormContext = (fail = true) => {
    const context = getContext<FormContext>('formContext');
    if (!context && fail) {
      throw new Error(
        'Form context not found. Make sure to use Form.svelte as a parent component.'
      );
    }
    return context;
  };

  export const getError = (context: FormContext, name: string) => {
    if (context.multiLang) {
      return context.errors()[context.lang.selectedLanguage][name];
    } else {
      return context.errors()[name];
    }
  };

  export const setValue = (context: FormContext, name: string, value: unknown) => {
    if (context.multiLang) {
      context.data[context.lang.selectedLanguage][name] = value;
    } else {
      context.data[name] = value;
    }
  };

  export const getValue = (context: FormContext, name: string) => {
    if (context.multiLang) {
      return context.data[context.lang.selectedLanguage][name];
    } else {
      return context.data[name];
    }
  };

  type ObjectToErrorObject<
    $Object extends Record<string, unknown>,
    $MultiLang extends boolean
  > = $MultiLang extends true
    ? {
        [$LangKey in keyof typeof languages]: {
          [$Key in keyof $Object]?: string | undefined;
        };
      }
    : {
        [$Key in keyof $Object]?: string | undefined;
      };

  export type FormFunction<
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    $Type extends SubmitFunction<any, any>,
    $ZodSchema extends ZodSchema,
    $MultiLang extends boolean
  > =
    $Type extends SubmitFunction<infer $Success, infer $Error>
      ? (opts: {
          result: ActionResult<$Success, $Error>;
          /**
           * Call this to get the default behavior of a form submission response.
           * @param options Set `reset: false` if you don't want the `<form>` values to be reset after a successful submission.
           * @param invalidateAll Set `invalidateAll: false` if you don't want the action to call `invalidateAll` after submission.
           */
          update: (options?: {
            reset?: boolean;
            invalidateAll?: boolean;
          }) => Promise<void>;
        }) => Awaitable<void | Partial<
          ObjectToErrorObject<z.infer<$ZodSchema>, $MultiLang>
        >>
      : never;
</script>

<script
  lang="ts"
  generics="$DataType extends Record<string, unknown>, $MultiLang extends boolean = false"
>
  import { getState } from '$/lib/state.svelte';
  import { enhance } from '$app/forms';
  import type { Awaitable } from '@patrick115/sveltekitapi';
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
  import { getContext, setContext, untrack, type Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { z, type SafeParseReturnType, type ZodSchema } from 'zod';

  /**
   * The form will get the default data values
   * For strings it can be empty string
   * For numbers it can be null, because in NumberInput we don't want any default value (empty input)
   * For booleans it can be either true or false
   */
  type DefaultValue<$T> = {
    [$Key in keyof $T]: $T[$Key] extends number ? number | null : $T[$Key];
  };

  type FormProps = {
    class?: string;
    schema: ZodSchema<$DataType>;
    isValid?: boolean;
    isDirty?: boolean;
    data: DefaultValue<$DataType>;
    onSubmit?: (data: $DataType) => void;
    children?: Snippet;
    multiLang?: $MultiLang;
    reset?: () => void;
    method?: 'post' | 'get';
    action?: string;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction?: FormFunction<SubmitFunction<any, any>, typeof schema, $MultiLang>;
  };

  const reset = () => {
    //reset the form
    isValid = false;
    isDirty = false;
    data = multiLang
      ? Object.fromEntries(
          Object.keys(languages).map((lang) => [lang, { ...defaultData }])
        )
      : { ...defaultData };
  };

  let {
    class: cls = '',
    schema,
    children,
    isValid = $bindable(false),
    data: defaultData = $bindable(),
    onSubmit,
    isDirty = $bindable(false),
    multiLang = false as $MultiLang,
    //we only provide the reset function to outside
    reset: _ = $bindable(reset),
    onAction,
    method = 'post',
    action
  }: FormProps = $props();

  type DataValue = DefaultValue<$DataType>;
  let data = $state<DataValue | Record<Language, DataValue>>(
    multiLang
      ? Object.fromEntries(
          Object.keys(languages).map((lang) => [lang, { ...defaultData }])
        )
      : { ...defaultData }
  );

  let submited = $state(false);

  let errors = $state<Errors | Record<Language, Errors>>(
    multiLang
      ? Object.fromEntries(
          Object.keys(languages).map((lang) => [
            lang,
            Object.fromEntries(
              Object.entries(defaultData).map(([key]) => [key, undefined])
            )
          ])
        )
      : Object.fromEntries(Object.entries(defaultData).map(([key]) => [key, undefined]))
  );

  const _state = getState();
  // We need to wrap selectedLanguage in object, to ensure reactivity, when transporting in context
  let lang = $state({
    selectedLanguage: _state.selectedLang as Language
  });
  // On data change
  $effect(() => {
    const result = schema.safeParse(multiLang ? data[lang.selectedLanguage] : data);
    untrack(() => {
      processErrors(result);
    });
    untrack(() => {
      isDirty = Object.entries(data).some(([key, value]) => defaultData[key] !== value); // Mark the form as dirty when data changes
    });
  });

  const getValue = (key: keyof $DataType) => {
    if (multiLang) {
      return (data as Record<Language, DefaultValue<$DataType>>)[lang.selectedLanguage][
        key
      ];
    } else {
      return (data as DefaultValue<$DataType>)[key];
    }
  };

  const resetErrors = () => {
    if (multiLang) {
      errors[lang.selectedLanguage] = Object.fromEntries(
        Object.entries((data as Record<Language, DataValue>)[lang.selectedLanguage]).map(
          ([key]) => [key, undefined]
        )
      );
    } else {
      errors = Object.fromEntries(Object.entries(data).map(([key]) => [key, undefined]));
    }
  };

  const processErrors = (
    result: SafeParseReturnType<$DataType, $DataType>,
    forLanguage?: Language,
    allErrors = false
  ) => {
    let count = 0;

    isValid = result.success;
    // Reset errors only if we are not collecting all errors
    if (!allErrors) resetErrors();

    if (result.error) {
      const zodErrors = result.error.errors;
      for (const error of zodErrors) {
        const path = error.path[0] as string;
        const isDefaultValue = defaultData[path] === '' || defaultData[path] === null;
        if (
          (isDefaultValue ? getValue(path) === defaultData[path] : false) &&
          allErrors === false &&
          !submited
        ) {
          // If the data is the same as the default, we don't want to show the error
          continue;
        }
        const message = error.code === 'invalid_type' ? 'TODO' : error.message;
        if (multiLang) {
          (errors as Record<Language, Errors>)[forLanguage ?? lang.selectedLanguage][
            path
          ] = message;
        } else {
          (errors as Errors)[path] = message;
        }
        ++count;
      }
    }
    return count;
  };

  const collectErrors = (reportError = false) => {
    const langs = Object.keys(languages);

    let totalErrors = 0;
    if (multiLang) {
      totalErrors = langs
        .map((lang) => data[lang]) //Select data
        .map((data) => schema.safeParse(data)) //Parse data
        .map((result, index) => processErrors(result, langs[index], reportError))
        .reduce((acc, count) => acc + count, 0);
    } else {
      totalErrors = processErrors(schema.safeParse(data));
    }
    return totalErrors;
  };

  const onSubmitHandler = () => {
    if (collectErrors() === 0 && onSubmit) {
      submited = true;
      onSubmit({ ...(data as $DataType) });
    }
  };

  setContext('formContext', {
    //here functions will provide the reactivity
    errors: () => errors,
    defaultData,
    // eslint-disable-next-line svelte/no-unused-svelte-ignore
    // svelte-ignore state_referenced_locally
    data,
    onSubmitHandler,
    lang,
    multiLang
  });

  const enhanceFunction = (({ formData, cancel }) => {
    if (collectErrors(true) !== 0) {
      cancel();
      return;
    }

    submited = true;

    //reset formData
    //Note: we need to call Array.from(), because the iterator is not stable
    //so since we removed the data, we skipped some keys
    Array.from(formData.keys()).forEach((key) => {
      formData.delete(key);
    });

    //not put my data into formData
    //for multilang, the data will be LANG:FIELD + VALUE
    if (multiLang) {
      for (const langKey in data) {
        const langData = (data as Record<Language, DefaultValue<$DataType>>)[
          langKey as Language
        ];
        for (const key in langData) {
          formData.append(`${langKey}:${key}`, String(langData[key]));
        }
      }
    } else {
      for (const key in data) {
        formData.append(key, String((data as DefaultValue<$DataType>)[key]));
      }
    }

    return async ({ result, update }) => {
      if (!onAction) return;
      const customResult = await onAction({
        result,
        update
      });
      if (!customResult) {
        resetErrors();
        return;
      }

      if (multiLang) {
        for (const _lang in languages) {
          const lang = _lang as Language;
          if (!(lang in customResult)) continue;
          for (const key in customResult[lang]) {
            // @ts-expect-error Here we know that we assign string or undefined
            errors[lang][key] = customResult[lang][key];
          }
        }
        return;
      }

      for (const key in customResult) {
        // @ts-expect-error Here we know that we assign string or undefined
        errors[key] = customResult[key];
      }
    };
  }) satisfies SubmitFunction;
</script>

<form
  class={twMerge('w-full', cls)}
  onsubmit={(ev) => ev.preventDefault()}
  use:enhance={enhanceFunction}
  {method}
  {action}
>
  {@render children?.()}
</form>
