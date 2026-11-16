// Keep the midterm hero and four hand-picked cards, adding useful interactions.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.home-grid .movie-card').forEach(card => {
        const id = card.id.replace('film-', '');
        const poster = card.querySelector('.poster-link');
        const wrap = document.createElement('div');
        wrap.className = 'card-poster';
        poster.before(wrap);
        wrap.append(poster);
        const favorite = document.createElement('button');
        favorite.type = 'button';
        favorite.className = 'favorite-button';
        favorite.dataset.favorite = id;
        favorite.innerHTML = '<span data-heart aria-hidden="true">♡</span>';
        wrap.append(favorite);
    });
    updateFavoriteButtons();

    let currentId = 'tt0816692';
    document.querySelector('#surprise-me').addEventListener('click', () => {
        const options = movies.filter(movie => movie.id !== currentId);
        const movie = options[Math.floor(Math.random() * options.length)];
        currentId = movie.id;
        const title = getMovieTitle(movie);
        const link = document.querySelector('.spotlight-poster');
        const image = link.querySelector('img');
        image.src = 'assets/posters/' + movie.id + '.jpg';
        image.alt = title;
        link.href = pageUrl('movies') + '#film-' + movie.id;
        document.querySelector('.spotlight-caption h2').textContent = title;
        document.querySelector('.spotlight-meta').textContent = movie.year + ' · ' + movie.runtime + t(' мин', ' min');
        document.querySelector('.spotlight-score strong').innerHTML = movie.imdb.toFixed(1) + '<span>/10</span>';
        showToast(t('Бүгінгі ұсыныс: ', 'Tonight’s suggestion: ') + title);
    });
});
