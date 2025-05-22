import { browser } from '$app/environment';
import Swal, { type SweetAlertOptions } from 'sweetalert2';

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const SwalAlert = <$Type = unknown>(data: SweetAlertOptions) => {
    if (!browser) {
        return {
            isConfirmed: false
        } as const;
    }

    return Swal.fire<$Type>({
        toast: true,
        position: 'top-end',
        timer: 2000,
        timerProgressBar: true,
        showCancelButton: false,
        showConfirmButton: false,
        ...data
    });
};

export const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const locale = navigator.language || 'cs-CZ';

    return new Intl.DateTimeFormat(locale, options).format(date);
};
