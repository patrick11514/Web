<script lang="ts">
    import clsx from 'clsx';
    import type { ClassValue } from 'clsx';
    import { marked } from 'marked';
    import { twMerge } from 'tailwind-merge';

    const { content, class: cls = '' }: { content: string; class?: ClassValue } = $props();
</script>

<div class={twMerge('prose prose-theme prose-lg lg:prose-xl font-medium', clsx(cls))}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html marked(content)}
</div>
