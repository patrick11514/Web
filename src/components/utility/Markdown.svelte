<script lang="ts">
  import type { ClassValue } from 'clsx';
  import clsx from 'clsx';
  import { marked } from 'marked';
  import { twMerge } from 'tailwind-merge';

  type MarkdownProps = {
    content: string;
    class?: ClassValue;
  };

  const { content, class: cls = '' }: MarkdownProps = $props();
</script>

<div class={twMerge('prose prose-theme prose-lg lg:prose-xl font-medium', clsx(cls))}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html marked(content)}
</div>
