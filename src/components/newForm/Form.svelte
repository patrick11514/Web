<script module>
  type FormContext = {
    errors: () => Record<string, string | undefined>;
    defaultData: Record<string, unknown>;
    data: Record<string, unknown>;
    onSubmitHandler: () => void;
  };

  export const getFormContext = () => {
    const context = getContext<FormContext>('formContext');
    if (!context) {
      throw new Error(
        'Form context not found. Make sure to use Form.svelte as a parent component.'
      );
    }
    return context;
  };
</script>

<script lang="ts" generics="$DataType extends Record<string, unknown>">
  import { getContext, setContext, untrack, type Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { type ZodSchema } from 'zod';

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
    data: DefaultValue<$DataType>;
    onSubmit: (data: $DataType) => void;
    children?: Snippet;
  };

  let {
    class: cls = '',
    schema,
    children,
    isValid = $bindable(false),
    data: defaultData = $bindable(),
    onSubmit
  }: FormProps = $props();

  let data = $state<DefaultValue<$DataType>>(defaultData);

  let errors = $state<ReturnType<FormContext['errors']>>(
    Object.fromEntries(Object.entries(defaultData).map(([key]) => [key, undefined]))
  );

  // Check data validity against the schema
  $effect(() => {
    const result = schema.safeParse(data);

    untrack(() => {
      isValid = result.success;
      // Reset errors
      errors = Object.fromEntries(Object.entries(data).map(([key]) => [key, undefined]));
    });

    if (untrack(() => !isValid)) {
      if (result.error) {
        const zodErrors = result.error.errors.filter((e) => e.code !== 'invalid_type');
        for (const error of zodErrors) {
          untrack(() => (errors[error.path[0] as string] = error.message));
        }
      }
    }
  });

  const onSubmitHandler = () => {
    onSubmit(data as $DataType);
  };

  setContext('formContext', {
    //here functions will provide the reactivity
    errors: () => errors,
    defaultData,
    data,
    onSubmitHandler
  });
</script>

<form class={twMerge('w-full', cls)}>
  {@render children?.()}
</form>
