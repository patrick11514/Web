<script module>
  import { languages } from '../../lib/lang/index';

  type Language = keyof typeof languages;

  type Errors = Record<string, string | undefined>;

  type BaseFormContext = {
    onSubmitHandler: () => void;
    multiLangKeys: string[];
    data: Record<string, unknown>;
    defaultData: Record<string, unknown>;
    errors: () => Errors;
  };

  export type MultiLangFormContext = BaseFormContext & {
    multiLang: true;
    lang: {
      selectedLanguage: Language;
    };
  };

  export type NonMultiLangFormContext = BaseFormContext & {
    multiLang: false;
    lang: {
      selectedLanguage: Language;
    };
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
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors = context.errors() as any;
      if (context.multiLangKeys.includes(name)) {
        return (errors[context.lang.selectedLanguage] as Errors)[name];
      }
    }
    return context.errors()[name];
  };

  export const setValue = (context: FormContext, name: string, value: unknown) => {
    if (context.multiLang) {
      if (context.multiLangKeys.includes(name)) {
        (context.data[context.lang.selectedLanguage] as Record<string, unknown>)[name] =
          value;
        return;
      }
    }
    context.data[name] = value;
  };

  export const getValue = (context: FormContext, name: string) => {
    if (context.multiLang) {
      if (context.multiLangKeys.includes(name)) {
        return (context.data[context.lang.selectedLanguage] as Record<string, unknown>)[
          name
        ];
      }
    }
    return context.data[name];
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

  export type FormAction<
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    $Type extends SubmitFunction<any, any>,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    $ZodSchema extends z.ZodType<any>,
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
  generics="$DataType extends Record<string, unknown>, $MultiLang extends boolean = false, $MultiLangKeys extends $MultiLang extends true ? keyof $DataType : never = never"
>
  import { getState } from '$/lib/state.svelte';
  import { enhance } from '$app/forms';
  import type { Awaitable } from '@patrick115/sveltekitapi';
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
  import { getContext, setContext, untrack, type Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { z } from 'zod';

  /**
   * The form will get the default data values
   * For strings it can be empty string
   * For numbers it can be null, because in NumberInput we don't want any default value (empty input)
   * For booleans it can be either true or false
   */
  type DefaultValue<$T> = {
    [$Key in keyof $T]: $T[$Key] extends number ? number | null : $T[$Key];
  };

  type DataType<
    $DataType,
    $Keys extends keyof $DataType,
    $MultiLang extends boolean
  > = $MultiLang extends true
    ? Omit<DefaultValue<$DataType>, $Keys> &
        Record<Language, Pick<DefaultValue<$DataType>, $Keys>>
    : DefaultValue<$DataType>;

  type FormProps = {
    class?: string;
    schema: z.ZodType<$DataType>;
    isValid?: boolean;
    isDirty?: boolean;
    data: DataType<$DataType, $MultiLangKeys, $MultiLang>;
    onSubmit?: (data: $DataType) => void;
    children?: Snippet;
    multiLang?: $MultiLang;
    multiLangKeys?: $MultiLangKeys[];
    reset?: () => void;
    method?: 'post' | 'get';
    action?: string;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction?: FormAction<SubmitFunction<any, any>, typeof schema, $MultiLang>;
  };

  const reset = () => {
    //reset the form
    isValid = false;
    isDirty = false;
    data = { ...defaultData };
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
    multiLangKeys = [] as $MultiLangKeys[],
    //we only provide the reset function to outside
    reset: _ = $bindable(reset),
    onAction,
    method = 'post',
    action
  }: FormProps = $props();

  if (multiLang && multiLangKeys.length === 0) {
    throw new Error('multiLangKeys must be provided when multiLang is true');
  }

  type DataValue = DefaultValue<$DataType>;
  let data = $state<DataType<$DataType, $MultiLangKeys, $MultiLang>>({ ...defaultData });

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
  const _lang = $derived(_state.lang.error.invalid_type_number);

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

  const getValue = (key: keyof $DataType, forLanguage?: Language) => {
    if (multiLang) {
      return (data as Record<Language, DefaultValue<$DataType>>)[
        forLanguage ?? lang.selectedLanguage
      ][key];
    } else {
      return (data as DefaultValue<$DataType>)[key];
    }
  };

  const getDefaultValue = (key: keyof $DataType, forLanguage?: Language) => {
    if (multiLang) {
      return (defaultData as Record<Language, DefaultValue<$DataType>>)[
        forLanguage ?? lang.selectedLanguage
      ][key];
    } else {
      return (defaultData as DefaultValue<$DataType>)[key];
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
    result: z.ZodSafeParseResult<$DataType>,
    forLanguage?: Language,
    allErrors = false
  ) => {
    let count = 0;

    isValid = result.success;
    // Reset errors only if we are not collecting all errors
    if (!allErrors) resetErrors();

    if (result.error) {
      const zodErrors = result.error.issues;
      for (const error of zodErrors) {
        const path = error.path[0] as string;
        const isDefaultValue =
          getDefaultValue(path, forLanguage) === '' ||
          getDefaultValue(path, forLanguage) === null;
        if (
          (isDefaultValue
            ? getValue(path, forLanguage) === getDefaultValue(path, forLanguage)
            : false) &&
          allErrors === false &&
          !submited
        ) {
          // If the data is the same as the default, we don't want to show the error
          continue;
        }
        const message = error.code === 'invalid_type' ? _lang : error.message;
        if (multiLang) {
          if (multiLangKeys.includes(path as $MultiLangKeys)) {
            (errors as Record<Language, Errors>)[forLanguage ?? lang.selectedLanguage][
              path
            ] = message;
            ++count;
            continue;
          }
        }

        (errors as Errors)[path] = message;
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
    multiLang,
    multiLangKeys
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

    const sanitizeData = (value: unknown) =>
      typeof value === 'object' ? JSON.stringify(value) : (value as string);

    //not put my data into formData
    //for multilang, the data will be LANG:FIELD + VALUE
    if (multiLang) {
      for (const langOrKey in data) {
        if (langOrKey in languages) {
          const langData = (data as Record<Language, DefaultValue<$DataType>>)[
            langOrKey as Language
          ];
          for (const key in langData) {
            const value = langData[key];
            formData.append(`${langOrKey}:${key}`, sanitizeData(value));
          }
        } else {
          const value = (data as DefaultValue<$DataType>)[langOrKey];
          formData.append(langOrKey, sanitizeData(value));
        }
      }
    } else {
      for (const key in data) {
        const value = (data as DefaultValue<$DataType>)[key];
        formData.append(key, sanitizeData(value));
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
