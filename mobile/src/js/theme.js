/**
 * Theme Engine — Dark Mode Support
 * 
 * Manages theme preference (light/dark/system), applies CSS variables
 * via [data-theme] attribute and Tailwind dark class on <html>.
 * Persists user choice in localStorage.
 */

const THEME_KEY = 'theme-preference'; // 'light' | 'dark' | 'system'
const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Get the user's saved theme preference.
 * @returns {'light'|'dark'|'system'}
 */
export function getThemePreference() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

/**
 * Resolve the effective theme based on preference.
 * @param {'light'|'dark'|'system'} preference
 * @returns {'light'|'dark'}
 */
function resolveTheme(preference) {
    if (preference === 'system') {
        return darkMediaQuery.matches ? 'dark' : 'light';
    }
    return preference;
}

/**
 * Apply theme to the DOM.
 * Sets data-theme attribute for CSS variables and 'dark' class for Tailwind.
 * Updates meta theme-color for mobile status bar.
 * @param {'light'|'dark'|'system'} preference
 */
export function applyTheme(preference) {
    localStorage.setItem(THEME_KEY, preference);
    const effective = resolveTheme(preference);
    const root = document.documentElement;

    // Set data-theme for CSS variable overrides
    root.setAttribute('data-theme', effective);

    // Set Tailwind dark class
    if (effective === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    // Update status bar color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', effective === 'dark' ? '#0F1419' : '#f5f8f8');
    }

    // Update apple status bar style
    const metaApple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaApple) {
        metaApple.setAttribute('content', effective === 'dark' ? 'black-translucent' : 'default');
    }

    // Dispatch custom event so other modules can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { preference, effective } }));
}

/**
 * Initialize theme on app load — called as early as possible to prevent FOUC.
 * Also sets up system preference listener.
 */
export function initTheme() {
    const preference = getThemePreference();
    applyTheme(preference);

    // Listen for OS-level theme changes (only matters if user chose 'system')
    darkMediaQuery.addEventListener('change', () => {
        if (getThemePreference() === 'system') {
            applyTheme('system');
        }
    });
}
