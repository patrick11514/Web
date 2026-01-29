<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  type Props = {
    type?: 'sun' | 'planet';
    size?: number; // in pixels
    color: string;
    distance?: number; // 0 for sun
    angle?: number; // degrees
    label?: string;
    onClick?: () => void;
    class?: string;
  };

  const {
    type = 'planet',
    size = 20,
    color,
    distance = 0,
    angle = 0,
    label,
    onClick,
    class: cls = ''
  }: Props = $props();
</script>

<button
  class={twMerge(
    'absolute flex cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-125 focus:scale-125 focus:outline-hidden',
    type === 'sun'
      ? 'z-10 shadow-[0_0_50px_rgba(255,200,0,0.5)] hover:shadow-[0_0_80px_rgba(255,200,0,0.8)]'
      : 'z-20 shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]',
    cls
  )}
  style:width="{size}px"
  style:height="{size}px"
  style:background-color={color}
  style:transform="rotate({angle}deg) translate({distance}px) rotate(-{angle}deg)"
  onclick={onClick}
  aria-label={label || type}
  title={label}
>
  <!-- We can add texture or icon here later -->
</button>
