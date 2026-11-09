const ratingSearch = document.getElementById('rating-search');
const ratingSort = document.getElementById('rating-sort');

function sortMovies(items, sortBy) {
    // Copy the array so sorting this table cannot reorder the shared collection.
    const sorted = items.slice();
    sorted.sort(function (a, b) {
        if (sortBy === 'title') return getMovieTitle(a).localeCompare(getMovieTitle(b));
        if (sortBy === 'runtime') return a.runtime - b.runtime;
        return b[sortBy] - a[sortBy];
    });
    return sorted;
}

function renderRatings() {
    const query = ratingSearch.value.trim().toLocaleLowerCase();
    const matching = movies.filter(function (movie) {
        return (movie.title.kk + ' ' + movie.title.en).toLocaleLowerCase().includes(query);
    });
    const sorted = sortMovies(matching, ratingSort.value);
    const body = document.getElementById('rating-rows');
    body.replaceChildren();
    sorted.forEach(function (movie, index) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${String(index + 1).padStart(2, '0')}</td>
            <th scope="row"><a class="table-film" href="${pageUrl('movies')}#film-${movie.id}"><img src="assets/posters/${movie.id}.jpg" alt="" width="40" height="58" loading="lazy"><span>${getMovieTitle(movie)}<small>${getMovieGenres(movie)}</small></span></a></th>
            <td>${movie.year}</td>
            <td><a href="https://www.imdb.com/title/${movie.id}/" target="_blank" rel="noopener noreferrer">${movie.imdb.toFixed(1)}</a></td>
            <td><a href="https://www.kinopoisk.ru/film/${movie.kpId}/" target="_blank" rel="noopener noreferrer">${movie.kp.toFixed(1)}</a></td>
            <td>${movie.runtime} ${t('мин', 'min')}</td>`;
        body.appendChild(row);
    });
    document.getElementById('rating-count').textContent = sorted.length + ' ' + t('фильм', 'film(s)');
    if (sorted.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'empty-state';
        cell.textContent = t('Фильм табылмады. Басқа атауды іздеп көр.', 'No films found. Try another title.');
        row.appendChild(cell);
        body.appendChild(row);
    }
}

ratingSearch.addEventListener('input', renderRatings);
ratingSort.addEventListener('change', renderRatings);
renderRatings();
