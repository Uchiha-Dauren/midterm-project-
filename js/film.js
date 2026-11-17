// Every API record becomes a Film used by filtering, rendering and journal links.
class Film {
    constructor(data) {
        this.id = String(data.id || '');
        this.title = String(data.title || '').trim();
        this.originalTitle = String(data.original_title || '');
        this.director = String(data.director || '');
        this.description = String(data.description || '');
        this.year = Number(data.release_date) || 0;
        this.runtime = Number(data.running_time) || 0;
        this.score = Number(data.rt_score) || 0;
        this.image = this.safeImage(data.movie_banner || data.image);
    }

    safeImage(value) {
        try {
            const url = new URL(value);
            return url.protocol === 'https:' && url.hostname === 'image.tmdb.org' ? url.href : '';
        } catch (error) { return ''; }
    }

    matches(query, director, minimumScore, decade) {
        const text = `${this.title} ${this.originalTitle} ${this.director}`.toLocaleLowerCase();
        return text.includes(query.trim().toLocaleLowerCase())
            && (director === 'all' || this.director === director)
            && this.score >= Number(minimumScore)
            && (decade === 'all' || Math.floor(this.year / 10) * 10 === Number(decade));
    }

    durationLabel() { return this.runtime + t(' мин', ' min'); }

    journalUrl() {
        const params = new URLSearchParams({title: this.title, year: this.year, runtime: this.runtime});
        return pageUrl('journal') + '?' + params.toString();
    }
}
