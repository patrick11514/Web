<script lang="ts" generics="TData extends Record<string, unknown>">
  import { Icon } from '$/components/utility';
  import { API } from '$/lib/api';
  import { SwalAlert } from '$/lib/functions';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';
  import TextArea from './TextArea.svelte';

  type Props = {
    data: TData;
    sysPrompt: string;
    name: string;
    label: string;
    disabled?: boolean;
    placeholder?: string;
    variant?: 'small' | 'normal';
  } & SvelteHTMLElements['textarea'];

  let { data, sysPrompt, disabled, value = $bindable(), ...props }: Props = $props();

  let loading = $state(false);

  async function generate() {
    if (loading) return;
    loading = true;
    try {
      let prompt = sysPrompt;
      for (const [key, value] of Object.entries(data)) {
        prompt = prompt.replaceAll(`{{${String(key)}}}`, String(value || ''));
      }

      const result = await API.ai.generate({ prompt });

      if ('status' in result && !result.status) {
        throw new Error(result.message);
      }

      // Update the value directly, bound TextArea will handle context sync
      if ('text' in result) {
        value = result.text;
      }
    } catch {
      SwalAlert({
        icon: 'error',
        title: 'Failed to generate content'
      });
    } finally {
      loading = false;
    }
  }
</script>

<TextArea {...props} {disabled} bind:value>
  {#snippet right()}
    <button
      type="button"
      onclick={generate}
      {disabled}
      class={twMerge(
        'bg-secondary text-surface mr-auto ml-2 rounded-sm px-2.5 py-1 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
        loading && 'animate-pulse'
      )}
      title="Generate with AI"
    >
      {#if loading}
        <Icon name="bi-hourglass-split" class="animate-spin" />
      {:else}
        <Icon name="bi-stars" />
      {/if}
    </button>
  {/snippet}
</TextArea>
