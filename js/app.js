// Shared behavior used by all five pages. No build step is needed.
const isEnglish = document.documentElement.lang === 'en';
const favoriteKey = 'cinepick-favorites';
let favoriteIds = [];

function t(kk, en) { return isEnglish ? en : kk; }
function pageUrl(name) { return name + (isEnglish ? '-en' : '') + '.html'; }

// Storage can be disabled in private mode. The page still works in memory.
try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || '[]');
    if (Array.isArray(saved)) {
        favoriteIds = [...new Set(saved.filter(id => movies.some(movie => movie.id === id)))];
    }
} catch (error) {
    favoriteIds = [];
}

function getFavorites() { return [...favoriteIds]; }
function isFavorite(id) { return favoriteIds.includes(id); }

function updateFavoriteButtons() {
    document.querySelectorAll('[data-favorite]').forEach(button => {
        const saved = isFavorite(button.dataset.favorite);
        const movie = movies.find(item => item.id === button.dataset.favorite);
        const title = movie ? getMovieTitle(movie) : '';
        const label = saved ? t('Тізімнен алып тастау', 'Remove from watchlist') : t('Тізімге қосу', 'Add to watchlist');
        button.classList.toggle('is-saved', saved);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', label + ': ' + title);
        button.title = label;
        const heart = button.querySelector('[data-heart]');
        const text = button.querySelector('[data-favorite-label]');
        if (heart) heart.textContent = saved ? '♥' : '♡';
        if (text) text.textContent = saved ? t('Сақталды', 'Saved') : t('Сақтау', 'Save');
    });
    document.querySelectorAll('[data-favorite-count]').forEach(counter => {
        counter.textContent = favoriteIds.length;
    });
}

function toggleFavorite(id) {
    if (!movies.some(movie => movie.id === id)) return;
    if (isFavorite(id)) favoriteIds = favoriteIds.filter(savedId => savedId !== id);
    else favoriteIds.push(id);
    let stored = true;
    try { localStorage.setItem(favoriteKey, JSON.stringify(favoriteIds)); }
    catch (error) { stored = false; }
    updateFavoriteButtons();
    document.dispatchEvent(new CustomEvent('favoritesChanged'));
    showToast(stored
        ? (isFavorite(id) ? t('Фильм тізімге қосылды', 'Added to your watchlist') : t('Фильм тізімнен алынды', 'Removed from your watchlist'))
        : t('Таңдау осы бетте ғана сақталады: браузер сақтау мүмкіндігін бұғаттады.', 'Saved for this page only: browser storage is unavailable.'));
}

function showToast(message) {
    const area = document.querySelector('.toast-area');
    if (!area) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    area.replaceChildren(toast);
    // The temporary feedback element is removed from the DOM after reading time.
    window.setTimeout(() => toast.remove(), 4200);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const dark = theme === 'dark';
    button.textContent = dark ? '☀' : '☾';
    button.setAttribute('aria-label', dark ? t('Ашық тақырыпқа ауысу', 'Switch to light theme') : t('Қараңғы тақырыпқа ауысу', 'Switch to dark theme'));
    button.title = button.getAttribute('aria-label');
    button.setAttribute('aria-pressed', String(!dark));
}

document.addEventListener('DOMContentLoaded', () => {
    let theme = 'dark';
    try { if (localStorage.getItem('cinepick-theme') === 'light') theme = 'light'; }
    catch (error) { /* Use the original dark theme when storage is unavailable. */ }
    applyTheme(theme);
    updateFavoriteButtons();

    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.dataset.bsTheme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('cinepick-theme', next); }
        catch (error) { showToast(t('Тақырып осы бетте ғана өзгертілді.', 'Theme changed for this page only.')); }
    });

    const menu = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('#main-nav');
    menu.addEventListener('click', () => {
        const open = navigation.classList.toggle('is-open');
        menu.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
            navigation.classList.remove('is-open');
            menu.setAttribute('aria-expanded', 'false');
            menu.focus();
        }
    });
    // Delegation also handles buttons created later by the catalogue renderer.
    document.addEventListener('click', event => {
        const button = event.target.closest('[data-favorite]');
        if (button) toggleFavorite(button.dataset.favorite);
    });
    window.addEventListener('storage', event => {
        if (event.key !== favoriteKey) return;
        try {
            const saved = JSON.parse(event.newValue || '[]');
            favoriteIds = Array.isArray(saved) ? [...new Set(saved.filter(id => movies.some(movie => movie.id === id)))] : [];
        } catch (error) { favoriteIds = []; }
        updateFavoriteButtons();
        document.dispatchEvent(new CustomEvent('favoritesChanged'));
    });
});
