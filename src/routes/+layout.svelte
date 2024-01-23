<script>
    import 'bootstrap-icons/font/bootstrap-icons.min.css'
    import '../app.css'
    import Navigation from '../components/navigation.svelte'
</script>

<section class="min-w-screen flex h-full min-h-screen w-full flex-col overflow-scroll bg-background text-text">
    <Navigation />
    <slot />
    <footer class="mx-auto mt-auto font-ubuntu font-bold">&copy; Patrik Mintěl 2021 - {new Date().getFullYear()}</footer>
</section>
