let lastPickId = '';
const pickerForm = document.getElementById('picker-form');
const pickerResult = document.getElementById('picker-result');

function findMatchingMovies(genre, maximumRuntime, minimumRating) {
    return movies.filter(function (movie) {
        return (genre === 'all' || movie.genres.includes(genre))
            && movie.runtime <= maximumRuntime
            && movie.imdb >= minimumRating;
    });
}

function chooseRandomMovie(candidates) {
    // Avoid the previous film when there is more than one suitable choice.
    const choices = candidates.length > 1 ? candidates.filter(function (movie) { return movie.id !== lastPickId; }) : candidates;
    return choices[Math.floor(Math.random() * choices.length)];
}

function displayPick(movie, count) {
    const saved = isFavorite(movie.id);
    pickerResult.innerHTML = `<article class="pick-result">
        <div class="result-poster"><img src="assets/posters/${movie.id}.jpg" alt="${getMovieTitle(movie)}" width="400" height="600"></div>
        <div class="result-copy"><p class="eyebrow">${t('БҮГІНГІ ТАҢДАУЫҢ', 'YOUR PICK FOR TONIGHT')}</p>
            <h2>${getMovieTitle(movie)}</h2>
            <p class="movie-meta">${movie.year} · ${movie.runtime} ${t('мин', 'min')}</p>
            <div class="genre-tags">${movie.genres.map(function (id) { return '<span class="genre-tag">' + getGenreLabel(id) + '</span>'; }).join('')}</div>
            <p class="movie-plot">${movie.plot[isEnglish ? 'en' : 'kk']}</p>
            <p class="director-line">${t('Режиссер', 'Director')}<strong>${movie.director}</strong></p>
            <div class="score-grid"><a class="score-box" href="https://www.imdb.com/title/${movie.id}/" target="_blank" rel="noopener noreferrer"><span class="imdb-word">IMDb</span><strong class="score-value">${movie.imdb.toFixed(1)}<small> /10</small></strong></a><a class="score-box" href="https://www.kinopoisk.ru/film/${movie.kpId}/" target="_blank" rel="noopener noreferrer"><span class="kp-word">Кинопоиск</span><strong class="score-value">${movie.kp.toFixed(1)}<small> /10</small></strong></a></div>
            <button type="button" class="btn btn-outline ${saved ? 'is-saved' : ''}" data-favorite="${movie.id}" aria-pressed="${saved}"><span data-heart aria-hidden="true">${saved ? '♥' : '♡'}</span><span data-favorite-label>${saved ? t('Сақталды', 'Saved') : t('Сақтау', 'Save')}</span></button>
            <p class="footnote mt-3 mb-0">${count} ${t('сәйкес фильм.', 'matching film(s).')} ${count > 1 ? t('Басқа фильм үшін қайта бас.', 'Press again for a different pick.') : t('Осы сүзгілерге тек осы фильм сәйкес келеді.', 'This is the only film matching these filters.')}</p>
        </div></article>`;
}

pickerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const candidates = findMatchingMovies(
        document.getElementById('pick-genre').value,
        Number(document.getElementById('pick-runtime').value),
        Number(document.getElementById('pick-rating').value)
    );
    if (candidates.length === 0) {
        pickerResult.innerHTML = `<div class="filter-panel empty-state"><span class="empty-symbol" aria-hidden="true">⌕</span><h2>${t('Фильм табылмады', 'No matching film')}</h2><p>${t('Уақытты ұзартып немесе ең төмен бағаны азайтып көр.', 'Try a longer runtime or a lower minimum score.')}</p><button type="button" id="reset-picker" class="btn btn-outline">${t('Сүзгілерді тазарту', 'Reset preferences')}</button></div>`;
        document.getElementById('reset-picker').addEventListener('click', function () {
            pickerForm.reset();
            document.getElementById('pick-genre').focus();
            pickerForm.requestSubmit();
        });
        return;
    }
    const movie = chooseRandomMovie(candidates);
    lastPickId = movie.id;
    displayPick(movie, candidates.length);
});
