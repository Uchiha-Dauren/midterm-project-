(() => {
    const store = new JournalStore();
    const form = document.getElementById('journal-form');
    const byId = id => document.getElementById('journal-' + id);
    const names = ['title', 'year', 'runtime', 'status', 'rating', 'watchedOn', 'note'];
    const labels = {planned: t('Жоспарда', 'Planned'), watching: t('Көріп жатырмын', 'Watching'), watched: t('Көрілді', 'Watched')};
    let editing = null;
    let pendingDelete = null;
    let submitted = false;

    function message(text, type = 'success') {
        byId('message').textContent = text;
        byId('message').dataset.type = type;
        byId('message').hidden = !text;
    }

    function storageMessage() {
        const messages = {
            invalid: t('Кейбір сақталған деректер оқылмады. Жарамды жазбалар қалпына келтірілді.', 'Some saved data could not be read. Valid entries were restored.'),
            unavailable: t('Браузер сақтауға рұқсат бермеді. Өзгеріс сақталмады. Енгізілген мәтін формада қалды.', 'Browser storage is unavailable. The change was not saved. Your input remains in the form.'),
            conflict: t('Бұл жазба басқа бетте өзгерді. Жаңартылған жазбаны қайта ашыңыз.', 'This entry changed in another tab. Open the updated entry before saving again.'),
            validation: t('Белгіленген өрістерді тексеріңіз.', 'Check the highlighted fields.')
        };
        message(messages[store.warning] || '', 'error');
    }

    function element(tag, className, text) {
        const node = document.createElement(tag);
        node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function setWatchedFields() {
        const watched = byId('status').value === 'watched';
        byId('watched-fields').hidden = !watched;
        for (const name of ['rating', 'watchedOn']) {
            byId(name).disabled = !watched;
            byId(name).required = watched;
        }
    }

    function readEntry() {
        const values = Object.fromEntries(names.map(name => [name, byId(name).value]));
        return new JournalEntry({...editing?.toJSON(), ...values});
    }

    function showErrors(errors) {
        for (const name of names) {
            byId(name + '-error').textContent = errors[name] || '';
            byId(name).setAttribute('aria-invalid', String(Boolean(errors[name])));
        }
    }

    function resetEditor() {
        editing = null;
        submitted = false;
        form.reset();
        showErrors({});
        setWatchedFields();
        byId('editor-title').textContent = t('Жаңа жазба', 'New entry');
        byId('save').textContent = t('Сақтау', 'Save entry');
        byId('cancel').hidden = true;
        byId('note-count').textContent = '0 / 1000';
    }

    function render() {
        const stats = store.getStats();
        for (const name of ['total', 'watched', 'average', 'minutes']) {
            document.getElementById('stats-' + name).textContent = name === 'average' ? (stats.watched ? stats.average.toFixed(1) : '—') : stats[name];
        }
        for (const status of Object.keys(labels)) {
            document.getElementById('bar-' + status).style.width = (stats.total ? stats[status] / stats.total * 100 : 0) + '%';
            document.getElementById('count-' + status).textContent = stats[status];
        }
        const query = byId('search').value.trim().toLocaleLowerCase();
        const status = byId('filter').value;
        const entries = store.entries.filter(entry => `${entry.title} ${entry.note}`.toLocaleLowerCase().includes(query) && (status === 'all' || entry.status === status));
        const sorts = {updated: (a, b) => b.updatedAt - a.updatedAt, title: (a, b) => a.title.localeCompare(b.title), rating: (a, b) => (b.rating || 0) - (a.rating || 0)};
        entries.sort(sorts[byId('sort').value]);
        byId('entries').replaceChildren();
        byId('clear').disabled = !store.entries.length;
        byId('count').textContent = `${entries.length} / ${store.entries.length} ${t('жазба', 'entries')}`;
        for (const entry of entries) {
            const card = element('article', 'journal-entry');
            const badge = element('span', 'journal-status', labels[entry.status]);
            badge.dataset.status = entry.status;
            card.append(badge, element('h3', '', entry.title));
            const metadata = [entry.year, entry.runtime ? entry.runtime + t(' мин', ' min') : '', entry.watchedOn].filter(Boolean).join(' · ');
            card.append(element('p', 'journal-entry-meta', metadata));
            if (entry.rating !== null) card.append(element('p', 'journal-rating', `${entry.rating} / 10`));
            if (entry.note) card.append(element('p', 'journal-entry-note', entry.note));
            const actions = element('div', 'journal-entry-actions');
            for (const [action, text] of [['edit', t('Өзгерту', 'Edit')], ['delete', t('Өшіру', 'Delete')]]) {
                const button = element('button', 'text-link', text);
                button.type = 'button';
                button.dataset.action = action;
                button.dataset.id = entry.id;
                button.setAttribute('aria-label', text + ' ' + entry.title);
                actions.append(button);
            }
            card.append(actions);
            byId('entries').append(card);
        }
        if (!entries.length) {
            const empty = element('div', 'journal-empty');
            empty.append(element('h2', '', store.entries.length ? t('Жазба табылмады', 'No matching entries') : t('Алғашқы фильміңізді қосыңыз', 'Start with your first film')),
                element('p', '', store.entries.length ? t('Іздеу мен сүзгіні өзгертіңіз.', 'Change your search or status filter.') : t('Фильмді сол жақтағы форма арқылы сақтаңыз.', 'Use the form to save a film, then return after watching.')));
            byId('entries').append(empty);
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        submitted = true;
        const entry = readEntry();
        const errors = entry.validate();
        showErrors(errors);
        const first = names.find(name => errors[name]);
        if (first) { byId(first).focus(); return; }
        if (!store.save(entry, editing?.updatedAt)) { storageMessage(); render(); return; }
        resetEditor();
        render();
        message(t('Жазба сақталды.', 'Entry saved.'));
    });
    form.addEventListener('input', () => {
        byId('note-count').textContent = `${byId('note').value.trim().length} / 1000`;
        if (submitted) showErrors(readEntry().validate());
    });
    byId('status').addEventListener('change', () => { setWatchedFields(); if (submitted) showErrors(readEntry().validate()); });
    byId('cancel').addEventListener('click', () => { resetEditor(); byId('title').focus(); });
    for (const name of ['search', 'filter', 'sort']) byId(name).addEventListener(name === 'search' ? 'input' : 'change', render);

    function askDelete(entry) {
        pendingDelete = entry ? {id: entry.id, updatedAt: entry.updatedAt} : {all: true};
        byId('dialog-text').textContent = entry ? t('Осы жазбаны өшіру керек пе? ', 'Delete this entry? ') + entry.title : t('Барлық күнделік жазбаларын өшіру керек пе?', 'Delete every entry in this journal?');
        byId('dialog').returnValue = '';
        byId('dialog').showModal();
    }
    byId('entries').addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const entry = store.entries.find(item => item.id === button.dataset.id);
        if (!entry) return;
        if (button.dataset.action === 'delete') { askDelete(entry); return; }
        editing = new JournalEntry(entry.toJSON());
        submitted = false;
        for (const name of names) byId(name).value = entry[name] ?? '';
        showErrors({});
        setWatchedFields();
        byId('editor-title').textContent = t('Жазбаны өзгерту', 'Edit entry');
        byId('save').textContent = t('Өзгерістерді сақтау', 'Save changes');
        byId('cancel').hidden = false;
        byId('note-count').textContent = `${entry.note.length} / 1000`;
        byId('title').focus();
    });
    byId('clear').addEventListener('click', () => askDelete(null));
    byId('dialog').addEventListener('close', () => {
        if (byId('dialog').returnValue !== 'delete' || !pendingDelete) return;
        const saved = pendingDelete.all ? store.clear() : store.remove(pendingDelete.id, pendingDelete.updatedAt);
        if (!saved) { storageMessage(); render(); return; }
        if (pendingDelete.all || editing?.id === pendingDelete.id) resetEditor();
        pendingDelete = null;
        render();
        message(t('Жазбалар жаңартылды.', 'Journal updated.'));
    });
    window.addEventListener('storage', event => {
        if (event.key !== store.key && event.key !== null) return;
        store.load();
        render();
        if (store.warning) storageMessage();
        else message(t('Күнделік басқа беттен жаңартылды.', 'Journal updated from another tab.'));
    });

    byId('watchedOn').max = journalToday();
    byId('year').max = new Date().getFullYear() + 5;
    resetEditor();
    const params = new URLSearchParams(window.location.search);
    for (const name of ['title', 'year', 'runtime']) if (params.has(name)) byId(name).value = params.get(name).slice(0, 150);
    render();
    if (store.warning) storageMessage();
})();
