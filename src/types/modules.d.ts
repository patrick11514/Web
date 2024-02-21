declare module 'dompurify' {
    function sanitize(data: string): string;
    function addHook(name: string, callback: (node: HTMLElement) => void): void;
}
