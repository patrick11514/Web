<script lang="ts" context="module">
    import type { LoginData, ProjectData } from '$/types/types';
    import { writable } from 'svelte/store';

    export const sessionData = writable<LoginData>({
        logged: false
    });

    export const projectData = writable<Partial<ProjectData>>({
        filePath: undefined,
        name: '',
        description: '',
        images: []
    });
</script>
