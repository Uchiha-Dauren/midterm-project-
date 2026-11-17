// Models contain data rules; journal.js owns the DOM and user interactions.
function journalToday() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

class JournalEntry {
    constructor(data = {}) {
        this.id = String(data.id || `entry-${Date.now()}-${Math.random().toString(36).slice(2)}`);
        this.title = String(data.title || '').trim();
        this.year = data.year === '' || data.year == null ? null : Number(data.year);
        this.runtime = data.runtime === '' || data.runtime == null ? null : Number(data.runtime);
        this.status = data.status || 'planned';
        this.rating = this.status === 'watched' && data.rating !== '' && data.rating != null ? Number(data.rating) : null;
        this.watchedOn = this.status === 'watched' ? String(data.watchedOn || '') : '';
        this.note = String(data.note || '').trim();
        this.createdAt = Number(data.createdAt) || Date.now();
        this.updatedAt = Number(data.updatedAt) || this.createdAt;
    }

    validate() {
        const errors = {};
        if (!this.title || this.title.length > 150) errors.title = t('Атау 1–150 таңба болуы керек.', 'Use a title of 1–150 characters.');
        if (this.year !== null && (!Number.isInteger(this.year) || this.year < 1888 || this.year > new Date().getFullYear() + 5)) errors.year = t('Жарамды жыл енгізіңіз.', 'Enter a valid release year.');
        if (this.runtime !== null && (!Number.isInteger(this.runtime) || this.runtime < 1 || this.runtime > 1440)) errors.runtime = t('1–1440 минут енгізіңіз.', 'Enter 1–1440 whole minutes.');
        if (!['planned', 'watching', 'watched'].includes(this.status)) errors.status = t('Күйді таңдаңыз.', 'Choose a valid status.');
        if (this.status === 'watched') {
            if (!Number.isInteger(this.rating) || this.rating < 1 || this.rating > 10) errors.rating = t('1–10 аралығындағы бүтін баға қажет.', 'Enter a whole rating from 1 to 10.');
            const parsed = new Date(this.watchedOn + 'T00:00:00Z');
            if (!/^\d{4}-\d{2}-\d{2}$/.test(this.watchedOn) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== this.watchedOn || this.watchedOn < '1888-01-01' || this.watchedOn > journalToday()) errors.watchedOn = t('Бүгіннен кеш емес дұрыс күн қажет.', 'Choose a valid viewing date up to today.');
        }
        if (this.note.length > 1000) errors.note = t('Жазба 1000 таңбадан аспасын.', 'Keep notes within 1,000 characters.');
        return errors;
    }

    toJSON() {
        return {id: this.id, title: this.title, year: this.year, runtime: this.runtime,
            status: this.status, rating: this.rating, watchedOn: this.watchedOn,
            note: this.note, createdAt: this.createdAt, updatedAt: this.updatedAt};
    }
}

class JournalStore {
    constructor() {
        this.key = 'cinepick-journal-v1';
        this.entries = [];
        this.warning = '';
        this.load();
    }

    load() {
        this.warning = '';
        let raw;
        try { raw = localStorage.getItem(this.key); }
        catch (error) { this.warning = 'unavailable'; return; }
        if (!raw) { this.entries = []; return; }
        try {
            const saved = JSON.parse(raw);
            if (!saved || saved.version !== 1 || !Array.isArray(saved.entries)) throw new Error('schema');
            const ids = new Set();
            this.entries = [];
            for (const item of saved.entries) {
                if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || typeof item.title !== 'string') { this.warning = 'invalid'; continue; }
                const entry = new JournalEntry(item);
                if (Object.keys(entry.validate()).length || ids.has(entry.id)) { this.warning = 'invalid'; continue; }
                ids.add(entry.id);
                this.entries.push(entry);
            }
        } catch (error) { this.entries = []; this.warning = 'invalid'; }
    }

    write(entries) {
        try { localStorage.setItem(this.key, JSON.stringify({version: 1, entries})); }
        catch (error) { this.warning = 'unavailable'; return false; }
        this.entries = entries;
        this.warning = '';
        return true;
    }

    save(entry, expectedUpdatedAt) {
        if (Object.keys(entry.validate()).length) { this.warning = 'validation'; return false; }
        this.load();
        if (this.warning === 'unavailable') return false;
        const existing = this.entries.find(item => item.id === entry.id);
        if (expectedUpdatedAt !== undefined && (!existing || existing.updatedAt !== expectedUpdatedAt)) {
            this.warning = 'conflict';
            return false;
        }
        entry.updatedAt = Math.max(Date.now(), (existing?.updatedAt || 0) + 1);
        const next = this.entries.filter(item => item.id !== entry.id);
        next.push(entry);
        return this.write(next);
    }

    remove(id, expectedUpdatedAt) {
        this.load();
        if (this.warning === 'unavailable') return false;
        const entry = this.entries.find(item => item.id === id);
        if (expectedUpdatedAt !== undefined && entry && entry.updatedAt !== expectedUpdatedAt) { this.warning = 'conflict'; return false; }
        return this.write(this.entries.filter(item => item.id !== id));
    }

    clear() { return this.write([]); }

    getStats() {
        const watched = this.entries.filter(entry => entry.status === 'watched');
        return {total: this.entries.length, planned: this.entries.filter(entry => entry.status === 'planned').length,
            watching: this.entries.filter(entry => entry.status === 'watching').length, watched: watched.length,
            average: watched.length ? watched.reduce((sum, entry) => sum + entry.rating, 0) / watched.length : 0,
            minutes: watched.reduce((sum, entry) => sum + (entry.runtime || 0), 0)};
    }
}
