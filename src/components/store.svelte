<script lang="ts" context="module">
    import type { ProjectData } from '$/routes/(adminLayout)/admin/projects/new/+page.svelte';
    import type { LoginData } from '$/types/types';
    import { writable } from 'svelte/store';

    export const sessionData = writable<LoginData>({
        logged: false
    });

    export const projectData = writable<Partial<ProjectData>>({
        filePath: undefined,
        name: '',
        description: ''
    });
</script>
