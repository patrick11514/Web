<script lang="ts">
  import Button from '$/components/form/Button.svelte';
  import FormItem from '$/components/form/FormItem.svelte';
  import Input from '$/components/form/Input.svelte';
  import H1 from '$/components/headers/H1.svelte';
  import { compareErrors, resolveError } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from './$types';

  const _state = getState();

  let usernameError = $state<string | undefined>(undefined);
  let passwordError = $state<string | undefined>(undefined);

  const login = (() => {
    return async ({ result, update }) => {
      if (result.type === 'failure') {
        usernameError = undefined;
        passwordError = undefined;
        const message = result.data!.message;
        if (compareErrors(message, 'login.form')) {
          usernameError = resolveError(message, _state.lang);
          passwordError = resolveError(message, _state.lang);
        } else if (compareErrors(message, 'login.username')) {
          usernameError = resolveError(message, _state.lang);
        } else if (compareErrors(message, 'login.password')) {
          passwordError = resolveError(message, _state.lang);
        }
      }

      update();
    };
  }) satisfies SubmitFunction;
</script>

<form method="POST" use:enhance={login} class="m-auto flex w-[70%] max-w-2xl flex-col md:w-[60%] lg:w-[50%]">
  <H1 class="mx-auto">{_state.lang.admin.login.title}</H1>
  <FormItem for="username" label={_state.lang.admin.login.username} error={usernameError}>
    <Input id="username" placeholder={_state.lang.admin.login.username} name="username" error={usernameError} />
  </FormItem>
  <FormItem for="password" label={_state.lang.admin.login.password} error={passwordError}>
    <Input id="password" type="password" placeholder={_state.lang.admin.login.password} name="password" error={passwordError} />
  </FormItem>
  <Button class="mx-auto" type="submit">{_state.lang.admin.login.submit}</Button>
</form>
