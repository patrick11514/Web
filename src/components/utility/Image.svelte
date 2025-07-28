<script lang="ts">
  import type { ImageExtension } from '$/types/types';
  import type { ClassValue } from 'svelte/elements';

  type ImageProps = {
    class?: ClassValue;
    alt: string;
    name: string;
    quality?: number;
    format?: ImageExtension;
  };

  const { class: cls, alt, name, quality = 75, format = 'jpg' }: ImageProps = $props();

  let src = $derived(
    name.includes('/') ? name : `/image/${name}?format=${format}&quality=${quality}`
  );
</script>

<picture>
  <!--mobile - screens up to 640px!-->
  <source srcset="{src}&scale=50" type="image/{format}" media="(max-width: 640px)" />
  <!--tablet - screens up to 1024px!-->
  <source srcset="{src}&scale=75" type="image/{format}" media="(max-width: 1024px)" />
  <!--desktop - larger screens!-->
  <source srcset={src} type="image/{format}" />
  <!--fallback!-->
  <img class={cls} {alt} {src} loading="lazy" decoding="async" fetchpriority="low" />
</picture>
