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
      const errors = context.errors() as Record<Language, Errors> | Errors;
      if (context.multiLangKeys.includes(name)) {
        return (errors as Record<Language, Errors>)[context.lang.selectedLanguage][name];
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
    T extends Record<string, unknown>,
    IsMultiLang extends boolean
  > = IsMultiLang extends true
    ? {
        [LangKey in keyof typeof languages]: {
          [Key in keyof T]?: string | undefined;
        };
      }
    : {
        [Key in keyof T]?: string | undefined;
      };

  export type FormAction<
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    TSubmitFunction extends SubmitFunction<any, any>,
    ZodSchema extends z.ZodType<Record<string, unknown>>,
    IsMultiLang extends boolean
  > =
    TSubmitFunction extends SubmitFunction<infer Success, infer Error>
      ? (opts: {
          result: ActionResult<Success, Error>;
          update: (options?: {
            reset?: boolean;
            invalidateAll?: boolean;
          }) => Promise<void>;
        }) => Awaitable<void | Partial<
          ObjectToErrorObject<z.infer<ZodSchema>, IsMultiLang>
        >>
      : never;
</script>

<script
  lang="ts"
  generics="FormDataType extends Record<string, unknown>, IsMultiLang extends boolean = false, MultiLangKeys extends IsMultiLang extends true ? keyof FormDataType : never = never"
>
  import { SwalAlert } from '$/lib/functions';
  import { resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import { enhance } from '$app/forms';
  import type { Awaitable } from '@patrick115/sveltekitapi';
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
  import { getContext, setContext, untrack, type Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { z } from 'zod';

  type DefaultValue<T> = {
    [Key in keyof T]: T[Key] extends number ? number | null : T[Key];
  };

  type DataType<
    Data,
    Keys extends keyof Data,
    IsMultiLang extends boolean
  > = IsMultiLang extends true
    ? Omit<DefaultValue<Data>, Keys> & Record<Language, Pick<DefaultValue<Data>, Keys>>
    : DefaultValue<Data>;

  type FormProps = {
    class?: string;
    schema: z.ZodType<FormDataType>;
    isValid?: boolean;
    isDirty?: boolean;
    data: DataType<FormDataType, MultiLangKeys, IsMultiLang>;
    onSubmit?: (data: FormDataType) => void;
    multiLang?: IsMultiLang;
    multiLangKeys?: MultiLangKeys[];
    reset?: () => void;
    method?: 'post' | 'get';
    action?: string;
    onAction?: FormAction<
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      SubmitFunction<any, any>,
      typeof schema,
      IsMultiLang
    >;
    children?: Snippet;
  };

  const reset = () => {
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
    multiLang = false as IsMultiLang,
    multiLangKeys = [] as MultiLangKeys[],
    reset: _ = $bindable(reset),
    onAction,
    method = 'post',
    action
  }: FormProps = $props();

  if (multiLang && multiLangKeys.length === 0) {
    throw new Error('multiLangKeys must be provided when multiLang is true');
  }

  type DataValue = DefaultValue<FormDataType>;
  let data = $state<DataType<FormDataType, MultiLangKeys, IsMultiLang>>({
    ...defaultData
  });
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

  const getValue = (key: keyof FormDataType, forLanguage?: Language) => {
    if (multiLang) {
      return (data as Record<Language, DefaultValue<FormDataType>>)[
        forLanguage ?? lang.selectedLanguage
      ][key];
    } else {
      return (data as DefaultValue<FormDataType>)[key];
    }
  };

  const getDefaultValue = (key: keyof FormDataType, forLanguage?: Language) => {
    if (multiLang) {
      return (defaultData as Record<Language, DefaultValue<FormDataType>>)[
        forLanguage ?? lang.selectedLanguage
      ][key];
    } else {
      return (defaultData as DefaultValue<FormDataType>)[key];
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
    result: z.ZodSafeParseResult<FormDataType>,
    forLanguage?: Language,
    reportError = false
  ) => {
    let count = 0;

    isValid = result.success;
    if (!reportError) resetErrors();

    if (result.error) {
      const zodErrors = result.error.issues;

      let errorShown = false;
      for (const error of zodErrors) {
        const path = error.path[0] as string;
        const isDefaultValue =
          getDefaultValue(path, forLanguage) === '' ||
          getDefaultValue(path, forLanguage) === null;
        if (
          (isDefaultValue
            ? getValue(path, forLanguage) === getDefaultValue(path, forLanguage)
            : false) &&
          reportError === false &&
          !submited
        ) {
          continue;
        }
        const message =
          error.code === 'invalid_type'
            ? _lang
            : resolveError(error.message, _state.lang);

        let finalMessage = message;
        let isMultiLangError = false;

        if (multiLang) {
          if (multiLangKeys.includes(path as MultiLangKeys)) {
            isMultiLangError = true;
            // Include Language context in the error message
            const langPrefix = languages[forLanguage ?? lang.selectedLanguage].name;
            finalMessage = `${langPrefix}: ${message}`;

            (errors as Record<Language, Errors>)[forLanguage ?? lang.selectedLanguage][
              path
            ] = message;
          }
        }

        if (!isMultiLangError) {
          (errors as Errors)[path] = message;
        }

        if (!errorShown && reportError === true) {
          SwalAlert({
            title: finalMessage,
            icon: 'error'
          });
          errorShown = true;
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
        .map((lang) => {
          const merged = { ...(data as object) };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const langData = (data as any)[lang];

          for (const l of langs) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (merged as any)[l];
          }

          return { ...merged, ...langData };
        })
        .map((data) => {
          // merge additional non-lang data back
          // because deep merge or specific handling of arrays might be needed if they are not in multiLangKeys
          // but for now, we just ensure simple properties are present
          return data;
        })
        .map((data) => schema.safeParse(data))
        .map((result, index) => processErrors(result, langs[index], reportError))
        .reduce((acc, count) => acc + count, 0);
    } else {
      totalErrors = processErrors(schema.safeParse(data), undefined, reportError);
    }
    return totalErrors;
  };

  const onSubmitHandler = () => {
    if (collectErrors() === 0 && onSubmit) {
      submited = true;
      onSubmit({ ...(data as FormDataType) });
    }
  };

  setContext('formContext', {
    errors: () => errors,
    defaultData,
    get data() {
      return data;
    },
    onSubmitHandler,
    lang,
    multiLang,
    multiLangKeys
  });

  const enhanceFunction = (({ formData, cancel }) => {
    const errorsCount = collectErrors(true);
    if (errorsCount !== 0) {
      cancel();
      return;
    }

    submited = true;

    Array.from(formData.keys()).forEach((key) => {
      formData.delete(key);
    });

    const sanitizeData = (value: unknown) =>
      typeof value === 'object' ? JSON.stringify(value) : (value as string);

    if (multiLang) {
      for (const langOrKey in data) {
        if (langOrKey in languages) {
          const langData = (data as Record<Language, DefaultValue<FormDataType>>)[
            langOrKey as Language
          ];
          for (const key in langData) {
            const value = langData[key];
            formData.append(`${langOrKey}:${key}`, sanitizeData(value));
          }
        } else {
          const value = (data as DefaultValue<FormDataType>)[langOrKey];
          formData.append(langOrKey, sanitizeData(value));
        }
      }
    } else {
      for (const key in data) {
        const value = (data as DefaultValue<FormDataType>)[key];
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
        const multiLangResult = customResult as Record<Language, Record<string, string>>;
        for (const _lang in languages) {
          const lang = _lang as Language;
          if (!(lang in multiLangResult)) continue;
          for (const key in multiLangResult[lang]) {
            (errors as Record<Language, Errors>)[lang][key] = multiLangResult[lang][key];
          }
        }
        return;
      }

      const singleLangResult = customResult as Record<string, string>;
      for (const key in singleLangResult) {
        (errors as Errors)[key] = singleLangResult[key];
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
