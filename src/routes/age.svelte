<script lang="ts">
    import { onMount } from 'svelte'

    let birth = 1051765200000

    async function loop() {
        let now = new Date().getTime()
        let age = ((now - birth) / 1000 / 60 / 60 / 24 / 365.25).toFixed(12)

        let elem = document.getElementById('age')
        if (elem) elem.innerText = age.toString()

        setTimeout(loop, 25)
    }

    onMount(async () => {
        loop()
    })
</script>

<div class="mb-3 font-bold text-2xl" title="1.5.2003">Věk: <span id="age">Načítání</span></div>
