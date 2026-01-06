<script lang="ts">
  import Button from '$/components/form/Button.svelte';
  import H1 from '$/components/headers/H1.svelte';
  import Form, { type FormAction } from '$/components/newForm/Form.svelte';
  import Input from '$/components/newForm/Input.svelte';
  import { compareErrors, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import { z } from 'zod';
  import type { SubmitFunction } from './$types';

  const _state = getState();

  const schema = z.object({
    username: z.string(),
    password: z.string()
  });

  const enhance = (({ result, update }) => {
    if (result.type === 'failure') {
      const message = result.data!.message;
      if (compareErrors(message, 'login.form')) {
        return {
          username: resolveError(message, _state.lang),
          password: resolveError(message, _state.lang)
        };
      } else if (compareErrors(message, 'login.username')) {
        return {
          username: resolveError(message, _state.lang)
        };
      } else if (compareErrors(message, 'login.password')) {
        return {
          password: resolveError(message, _state.lang)
        };
      }
    }

    update();
  }) satisfies FormAction<SubmitFunction, typeof schema, false>;
</script>

<Form
  {schema}
  data={{ username: '', password: '' }}
  class="m-auto flex w-[70%] max-w-2xl flex-col md:w-[60%] lg:w-[50%]"
  onAction={enhance}
>
  <H1 class="mx-auto">{_state.lang.admin.login.title}</H1>
  <Input label={_state.lang.admin.login.username} name="username" />
  <Input label={_state.lang.admin.login.password} name="password" type="password" />

  <Button class="mx-auto" type="submit">{_state.lang.admin.login.submit}</Button>
</Form>
