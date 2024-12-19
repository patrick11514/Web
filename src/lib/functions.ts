import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import DOMPurify from 'dompurify';
import Swal, { type SweetAlertOptions } from 'sweetalert2';
import { API } from './api';
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { LoginData } from '$/types/types';

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

    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
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

    getContext<Writable<LoginData>>('userState').set({
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

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
};

export const formatDate = (date: string | Date, withTime = true) => {
    const d = new Date(date);

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    if (withTime) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds} ${day}.${month}.${year}`;
    }
    return `${day}.${month}.${year}`;
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

export const extractDate = (date: Date, withSeconds = false) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (withSeconds) {
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return [`${year}-${month}-${day}`, `${hours}:${minutes}:${seconds}`];
    }
    return [`${year}-${month}-${day}`, `${hours}:${minutes}`];
};
