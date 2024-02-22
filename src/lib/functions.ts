import { sessionData } from '$/components/store.svelte';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import DOMPurify from 'dompurify';
import Swal, { type SweetAlertOptions } from 'sweetalert2';
import { API } from './api';

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const SwalAlert = async (data: SweetAlertOptions) => {
    if (!browser) {
        return {
            isConfirmed: false
        };
    }

    return Swal.fire({
        toast: true,
        position: 'top-end',
        timer: 2000,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
        ...data
    });
};

export const createSimpleMarkDown = (data: string | undefined) => {
    if (!data || !browser) return '';
    let result = data.replaceAll(/\[(.*)\]\((.*)\)/g, '<a class="text-primary" target="_blank" href="$2" >$1</a>');
    result = result.replaceAll(/\*\*(.*)\*\*/g, '<span class="font-bold">$1</span>');

    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener');
        }
    });

    return DOMPurify.sanitize(result);
};

export const logout = async () => {
    const result = await API.auth.logout();

    if (result.status === false) {
        SwalAlert({
            icon: 'error',
            title: result.message
        });
        return;
    }

    sessionData.set({
        logged: false
    });

    goto('/admin');
};

export const getFiles = (files: (File | null)[]) => {
    if (files.length == 0) {
        SwalAlert({
            icon: 'error',
            title: 'Nenahrál jsi žádný soubor'
        });
        return [];
    }

    const onlyFiles = files.filter((file) => file !== null) as File[];

    if (onlyFiles.length == 0) {
        SwalAlert({
            icon: 'error',
            title: 'Nenahrál jsi žádný soubor'
        });
        return [];
    }

    return onlyFiles;
};

export const getDate = (date: string | Date) => {
    const d = new Date(date);

    const month = d.getMonth() + 1;

    return `${d.getFullYear()}-${month < 10 ? `0${month}` : month}-${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}`;
};

export const uploadImage = async (file: File) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<string>(async (resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const result = await API.upload.POST(formData);

        if (!result.status) {
            return reject(result.message);
        }

        return resolve(result.data);
    });
};
