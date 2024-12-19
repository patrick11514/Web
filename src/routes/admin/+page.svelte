<script lang="ts">
    import Button from '$/components/button.svelte';
    import Input from '$/components/input.svelte';
    import Label from '$/components/label.svelte';
    import { API } from '$/lib/api';
    import { SwalAlert } from '$/lib/functions';
    import type { LoginData } from '$/types/types';
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

    let username = $state('');
    let password = $state('');

    const userState = getContext<Writable<LoginData>>('userState');

    const login = async () => {
        const data = await API.auth.login({
            username,
            password
        });

        if (!data.status) {
            SwalAlert({
                title: data.message,
                icon: 'error'
            });
            return;
        }

        SwalAlert({
            title: 'Byl jsi úpsěšně přihlášen!',
            icon: 'success'
        });

        userState.set({
            logged: true,
            data: data.data
        });

        goto('/admin/main');
    };
</script>

<h2 class="text-center font-ubuntu text-3xl font-bold">Vítej na <span class="text-secondary underline">TOP</span> secret přihlašovací stránce :)</h2>
<div class="m-auto flex flex-col">
    <Label for="username">Přihlašovací jméno</Label>
    <Input id="username" type="text" bind:value={username} />
    <Label for="password">Heslo</Label>
    <Input id="password" type="password" bind:value={password} />
    <Button onclick={login}>Přihlásit se</Button>
</div>
