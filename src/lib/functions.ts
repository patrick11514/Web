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

export const formatDate = (date: Date | string, time = true) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(time && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  const locale = navigator.language || 'cs-CZ';

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const sToHHMM = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
};

export const resolveObject = (path: string, _path: object) => {
  const parts = path.split('.');

  for (const part of parts) {
    if (_path[part as keyof typeof _path] !== undefined) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      _path = _path[part as keyof typeof _path] as any;
    } else {
      // If the path does not exist, return the original error string
      return path;
    }
  }

  return _path as unknown as string;
};
