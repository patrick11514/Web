<script lang="ts">
    import { marked } from 'marked';

    const { content }: { content: string } = $props();
</script>

<div class="prose prose-theme prose-lg lg:prose-xl font-medium">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html marked(content)}
</div>
