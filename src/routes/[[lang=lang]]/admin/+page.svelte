<script lang="ts">
    import Button from '$/components/form/Button.svelte';
    import FormItem from '$/components/form/FormItem.svelte';
    import Input from '$/components/form/Input.svelte';
    import { compareErrors, resolveError } from '$/lib/lang';
    import { getState } from '$/lib/state.svelte';
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';

    const { form }: PageProps = $props();

    const _state = getState();

    let usernameError = $state<string | undefined>(undefined);
    let passwordError = $state<string | undefined>(undefined);

    $effect(() => {
        if (!form) return;

        usernameError = undefined;
        passwordError = undefined;

        if (form.status) return;

        if (compareErrors(form.message, 'login.form')) {
            usernameError = resolveError(form.message, _state.lang);
            passwordError = resolveError(form.message, _state.lang);
        } else if (compareErrors(form.message, 'login.username')) {
            usernameError = resolveError(form.message, _state.lang);
        } else if (compareErrors(form.message, 'login.password')) {
            passwordError = resolveError(form.message, _state.lang);
        }
    });
</script>

<form method="POST" use:enhance class="m-auto flex w-[70%] max-w-2xl flex-col md:w-[60%] lg:w-[50%]">
    <h1 class="font-poppins text-center text-3xl font-bold lg:text-4xl">{_state.lang.admin.login.title}</h1>
    <FormItem for="username" label="Username" error={usernameError}>
        <Input id="username" placeholder="Username" name="username" />
    </FormItem>
    <FormItem for="password" label="Password" error={passwordError}>
        <Input id="password" type="password" placeholder="Password" name="password" />
    </FormItem>
    <Button type="submit">Click me</Button>
</form>
