// One data array powers search, filters, sorting and the watchlist.
let savedOnly = new URLSearchParams(window.location.search).get('view') === 'saved';
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('movie-search');
const genreSelect = document.getElementById('movie-genre');
const ratingSelect = document.getElementById('movie-rating');
const sortSelect = document.getElementById('movie-sort');

function createMovieCard(movie) {
    const card = document.createElement('article');
    const saved = isFavorite(movie.id);
    card.className = 'movie-card';
    card.id = 'film-' + movie.id;
    // This template contains only the trusted film data from data.js.
    card.innerHTML = `
        <div class="card-poster">
            <a class="poster-link" href="#film-${movie.id}" aria-label="${getMovieTitle(movie)}">
                <img src="assets/posters/${movie.id}.jpg" alt="${getMovieTitle(movie)}" width="400" height="600" loading="lazy">
                <span class="poster-year">${movie.year}</span>
            </a>
            <button type="button" class="favorite-button ${saved ? 'is-saved' : ''}" data-favorite="${movie.id}" aria-pressed="${saved}" aria-label="${t('Таңдаулылар', 'Watchlist')}: ${getMovieTitle(movie)}"><span data-heart aria-hidden="true">${saved ? '♥' : '♡'}</span></button>
        </div>
        <div class="card-body">
            <p class="movie-genre">${getMovieGenres(movie)}</p>
            <h3>${getMovieTitle(movie)}</h3>
            <div class="card-ratings">
                <a href="https://www.imdb.com/title/${movie.id}/" target="_blank" rel="noopener noreferrer"><b class="imdb-word">IMDb</b> ${movie.imdb.toFixed(1)}</a>
                <a href="https://www.kinopoisk.ru/film/${movie.kpId}/" target="_blank" rel="noopener noreferrer"><b class="kp-word">КП</b> ${movie.kp.toFixed(1)}</a>
            </div>
            <details class="movie-description"><summary>${t('Фильм туралы', 'About this film')}</summary><p>${movie.plot[isEnglish ? 'en' : 'kk']}</p><p>${t('Режиссер', 'Director')}: ${movie.director}<br>${movie.runtime} ${t('мин', 'min')}</p></details>
        </div>`;
    return card;
}

function getFilteredMovies() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let result = movies.filter(function (movie) {
        const searchable = (movie.title.kk + ' ' + movie.title.en + ' ' + movie.director).toLocaleLowerCase();
        return searchable.includes(query)
            && (genreSelect.value === 'all' || movie.genres.includes(genreSelect.value))
            && movie.imdb >= Number(ratingSelect.value)
            && (!savedOnly || isFavorite(movie.id));
    });
    if (sortSelect.value === 'rating') result.sort(function (a, b) { return b.imdb - a.imdb; });
    if (sortSelect.value === 'newest') result.sort(function (a, b) { return b.year - a.year; });
    if (sortSelect.value === 'title') result.sort(function (a, b) { return getMovieTitle(a).localeCompare(getMovieTitle(b)); });
    return result;
}

function renderMovies() {
    const result = getFilteredMovies();
    // replaceChildren removes the previous cards before appending the new results.
    movieGrid.replaceChildren();
    result.forEach(function (movie) { movieGrid.appendChild(createMovieCard(movie)); });
    document.getElementById('movie-count').textContent = t('Табылған фильмдер: ', 'Films found: ') + result.length;
    if (result.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = `<span class="empty-symbol" aria-hidden="true">${savedOnly ? '♡' : '⌕'}</span><h2>${savedOnly && getFavorites().length === 0 ? t('Таңдаулылар әлі бос', 'Your watchlist is empty') : t('Фильм табылмады', 'No films found')}</h2><p>${savedOnly && getFavorites().length === 0 ? t('Барлық фильмдерден жүрек белгісін басып, фильм сақта.', 'Open All films and tap a heart to save a film here.') : t('Іздеу сөзін немесе сүзгілерді өзгертіп көр.', 'Try another search or reset the filters.')}</p>`;
        movieGrid.appendChild(empty);
    }
}

function setCollection(showSaved) {
    savedOnly = showSaved;
    const allTab = document.getElementById('tab-all');
    const savedTab = document.getElementById('tab-saved');
    allTab.classList.toggle('is-active', !showSaved);
    savedTab.classList.toggle('is-active', showSaved);
    allTab.setAttribute('aria-pressed', String(!showSaved));
    savedTab.setAttribute('aria-pressed', String(showSaved));
    renderMovies();
}

searchInput.addEventListener('input', renderMovies);
for (const select of [genreSelect, ratingSelect, sortSelect]) {
    select.addEventListener('change', renderMovies);
}
document.getElementById('catalog-form').addEventListener('submit', function (event) { event.preventDefault(); });
document.getElementById('tab-all').addEventListener('click', function () { setCollection(false); });
document.getElementById('tab-saved').addEventListener('click', function () { setCollection(true); });
document.getElementById('reset-filters').addEventListener('click', function () {
    document.getElementById('catalog-form').reset();
    renderMovies();
    searchInput.focus();
});
document.addEventListener('favoritesChanged', function () {
    if (savedOnly) {
        const activeId = document.activeElement.dataset.favorite;
        renderMovies();
        if (activeId) {
            const nextButton = movieGrid.querySelector('[data-favorite]') || document.getElementById('tab-saved');
            nextButton.focus();
        }
    }
});
setCollection(savedOnly);
// The rows are created by JavaScript, so resolve an incoming movie anchor after rendering.
if (window.location.hash.startsWith('#film-')) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ block: 'start' });
}
