<script lang="ts">
    import { twMerge } from 'tailwind-merge'

    export let href: string
    export let external = true
    let cls = ''
    export { cls as class }
</script>

<a class={twMerge('text-primary', cls)} {href} target={external ? '_blank' : '_self'}><slot /></a>
