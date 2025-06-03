<script lang="ts">
    import type { ImageExtension } from '$/types/types';
    import type { ClassValue } from 'svelte/elements';

    const { class: cls, alt, name, quality = 75, format = 'jpg' }: { class?: ClassValue; alt: string; name: string; quality?: number; format?: ImageExtension } = $props();

    let src = $derived(name.includes('/') ? name : `/image/${name}?format=${format}&quality=${quality}`);
</script>

<picture>
    <!--mobile!-->
    <source srcset="{src}&scale=50" type="image/{format}" sizes="(max-width: 640px)" />
    <!--tablet!-->
    <source srcset="{src}&scale=75" type="image/{format}" sizes="(max-width: 1024px)" />
    <!--desktop!-->
    <source srcset={src} type="image/{format}" />
    <!--fallback!-->
    <img class={cls} {alt} {src} loading="lazy" decoding="async" />
</picture>
