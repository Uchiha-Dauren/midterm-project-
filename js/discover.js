// API data is kept separate from the original midterm movie collection.
(() => {
    const endpoint = 'https://ghibliapi.vercel.app/films';
    const byId = id => document.getElementById('discover-' + id);
    const controls = byId('controls');
    const grid = byId('grid');
    const state = byId('state');
    const fields = ['search', 'director', 'decade', 'score', 'sort'];
    const pageSize = 6;
    let films = [];
    let page = 1;
    let request = null;

    function element(tag, className, text) {
        const node = document.createElement(tag);
        node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function showState(kind, title, text) {
        state.dataset.state = kind;
        state.hidden = false;
        byId('state-title').textContent = title;
        byId('state-text').textContent = text;
        byId('retry').hidden = kind !== 'error';
    }

    function createCard(film) {
        const card = element('article', 'discover-card');
        const cover = element('div', 'discover-cover');
        cover.append(element('div', 'discover-placeholder', film.title));
        if (film.image) {
            const image = element('img', '');
            image.src = film.image;
            image.alt = film.title;
            image.loading = 'lazy';
            image.width = 640;
            image.height = 360;
            image.addEventListener('error', () => image.remove(), {once: true});
            cover.append(image);
        }
        cover.append(element('span', 'discover-year', film.year));
        const body = element('div', 'discover-card-body');
        body.append(element('p', 'discover-director', film.director), element('h2', '', film.title));
        const meta = element('div', 'discover-meta');
        meta.append(element('span', '', film.durationLabel()), element('strong', 'discover-score', `RT ${film.score}%`));
        const details = element('details', 'discover-description');
        details.append(element('summary', '', t('Фильм туралы', 'About this film')), element('p', '', film.description));
        const add = element('a', 'btn btn-outline discover-add', t('Күнделікке қосу', 'Add to journal'));
        add.href = film.journalUrl();
        body.append(meta, details, add);
        card.append(cover, body);
        return card;
    }

    function render() {
        const result = films.filter(film => film.matches(byId('search').value, byId('director').value, byId('score').value, byId('decade').value));
        const sort = byId('sort').value;
        const compare = {
            score: (a, b) => b.score - a.score,
            newest: (a, b) => b.year - a.year,
            shortest: (a, b) => a.runtime - b.runtime,
            title: (a, b) => a.title.localeCompare(b.title)
        };
        result.sort(compare[sort]);
        const pages = Math.max(1, Math.ceil(result.length / pageSize));
        page = Math.min(page, pages);
        grid.replaceChildren(...result.slice((page - 1) * pageSize, page * pageSize).map(createCard));
        state.hidden = result.length > 0;
        if (!result.length) showState('empty', t('Фильм табылмады', 'No matching films'), t('Сүзгілерді өзгертіңіз немесе қалпына келтіріңіз.', 'Change your filters or reset them.'));
        byId('count').textContent = `${result.length} ${t('фильм', 'films')}`;
        byId('page').textContent = `${t('Бет', 'Page')} ${page} / ${pages}`;
        byId('pagination').hidden = result.length <= pageSize;
        byId('previous').disabled = page === 1;
        byId('next').disabled = page === pages;
    }

    function fillOptions(name, values, label) {
        const select = byId(name);
        const oldValue = select.value;
        select.replaceChildren(new Option(label, 'all'));
        values.forEach(value => select.append(new Option(String(value), String(value))));
        select.value = values.map(String).includes(oldValue) ? oldValue : 'all';
    }

    async function loadFilms() {
        // A superseded response cannot replace a more recent request.
        if (request) request.abort();
        const controller = new AbortController();
        request = controller;
        const timeout = setTimeout(() => controller.abort(), 12000);
        grid.replaceChildren();
        grid.setAttribute('aria-busy', 'true');
        controls.hidden = true;
        byId('results').hidden = true;
        byId('pagination').hidden = true;
        byId('refresh').disabled = true;
        byId('source').textContent = t('Жүктелуде…', 'Loading…');
        showState('loading', t('Фильмдер жүктелуде', 'Gathering new stories…'), t('Studio Ghibli жинағы сұратылуда.', 'Fetching the Studio Ghibli collection.'));
        try {
            const response = await fetch(endpoint, {signal: controller.signal});
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Invalid response');
            if (request !== controller) return;
            const seen = new Set();
            films = data.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && item.title.trim())
                .map(item => new Film(item)).filter(film => {
                    if (seen.has(film.id)) return false;
                    seen.add(film.id);
                    return true;
                });
            if (data.length && !films.length) throw new Error('No valid records');
            byId('source').textContent = t('API деректері жүктелді', 'API collection loaded');
            if (!films.length) {
                showState('empty', t('Жинақ бос', 'The collection is empty'), t('Кейінірек қайта жүктеп көріңіз.', 'Refresh the collection later.'));
                return;
            }
            fillOptions('director', [...new Set(films.map(film => film.director))].sort(), t('Барлық режиссерлер', 'All directors'));
            fillOptions('decade', [...new Set(films.map(film => Math.floor(film.year / 10) * 10))].sort((a, b) => b - a), t('Барлық онжылдықтар', 'All decades'));
            controls.hidden = false;
            byId('results').hidden = false;
            page = 1;
            render();
        } catch (error) {
            if (request !== controller) return;
            films = [];
            byId('source').textContent = t('API қолжетімсіз', 'API unavailable');
            showState('error', t('Жүктеу сәтсіз аяқталды', 'Could not load the films'), t('Байланысты тексеріп, қайталап көріңіз. Негізгі каталог қолжетімді.', 'Check your connection and try again. The original catalogue is still available.'));
        } finally {
            clearTimeout(timeout);
            if (request === controller) {
                grid.setAttribute('aria-busy', 'false');
                byId('refresh').disabled = false;
                request = null;
            }
        }
    }

    controls.addEventListener('submit', event => event.preventDefault());
    fields.forEach(name => byId(name).addEventListener(name === 'search' ? 'input' : 'change', () => { page = 1; render(); }));
    byId('reset').addEventListener('click', () => { controls.reset(); page = 1; render(); byId('search').focus(); });
    byId('previous').addEventListener('click', () => { page--; render(); });
    byId('next').addEventListener('click', () => { page++; render(); });
    byId('refresh').addEventListener('click', loadFilms);
    byId('retry').addEventListener('click', loadFilms);
    loadFilms();
})();
