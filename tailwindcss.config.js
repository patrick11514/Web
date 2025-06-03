/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            typography: () => ({
                theme: {
                    css: {
                        '--tw-prose-body': 'var(--color-text)',
                        '--tw-prose-headings': 'var(--color-text-strong)',
                        '--tw-prose-lead': 'var(--color-text-muted)',
                        '--tw-prose-links': 'var(--color-primary)',
                        '--tw-prose-bold': 'var(--color-text-strong)',
                        '--tw-prose-counters': 'var(--color-text-muted)',
                        '--tw-prose-bullets': 'var(--color-text-muted)',
                        '--tw-prose-hr': 'var(--color-divider)',
                        '--tw-prose-quotes': 'var(--color-text-muted)',
                        '--tw-prose-quote-borders': 'var(--color-border)',
                        '--tw-prose-captions': 'var(--color-text-muted)',
                        '--tw-prose-code': 'var(--color-primary-text)',
                        '--tw-prose-pre-code': 'var(--color-secondary-text)',
                        '--tw-prose-pre-bg': 'var(--color-surface)',
                        '--tw-prose-th-borders': 'var(--color-divider)',
                        '--tw-prose-td-borders': 'var(--color-border)',
                        '--tw-prose-invert-body': 'var(--color-text-inverse)',
                        '--tw-prose-invert-headings': 'var(--color-text-strong)',
                        '--tw-prose-invert-lead': 'var(--color-text-muted)',
                        '--tw-prose-invert-links': 'var(--color-primary-text)',
                        '--tw-prose-invert-bold': 'var(--color-text)',
                        '--tw-prose-invert-counters': 'var(--color-gray-600)',
                        '--tw-prose-invert-bullets': 'var(--color-gray-600)',
                        '--tw-prose-invert-hr': 'var(--color-border)',
                        '--tw-prose-invert-quotes': 'var(--color-text-muted)',
                        '--tw-prose-invert-quote-borders': 'var(--color-divider)',
                        '--tw-prose-invert-captions': 'var(--color-text-muted)',
                        '--tw-prose-invert-code': 'var(--color-primary-text)',
                        '--tw-prose-invert-pre-code': 'var(--color-text-inverse)',
                        '--tw-prose-invert-pre-bg': 'oklch(0.05 0.003 260)',
                        '--tw-prose-invert-th-borders': 'var(--color-divider)',
                        '--tw-prose-invert-td-borders': 'var(--color-border)'
                    }
                }
            })
        }
    }
};
