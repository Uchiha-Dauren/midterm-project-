# CinePick Final Project

CinePick helps people choose films, compare saved ratings and keep a personal viewing journal. This final submission continues the same Midterm and Endterm project, topic and group. The original five pages and their Kazakh and English versions remain part of the application.

- Published website — https://uchiha-dauren.github.io/midterm-project-/
- Source repository — https://github.com/Uchiha-Dauren/midterm-project-
- Course — Web Development, Astana IT University
- Group — SE-2524
- Members — Dauren, Iskander, Nurzhan

## Final features and requirement mapping

| Requirement | Working feature | Source |
| --- | --- | --- |
| Mandatory external API | Discover retrieves the Studio Ghibli collection with `fetch` and `async/await`, then displays remote data. Loading, success, empty and error states, timeout, refresh and retry are implemented. | `js/discover.js`, `discover.html`, `discover-en.html` |
| Mandatory OOP | Each remote film is a `Film` instance. Each diary record is a `JournalEntry` instance. Constructors normalize properties; methods implement filtering, validation, serialization and persistence. `JournalStore` manages the collection. | `js/film.js`, `js/journal-store.js` |
| Mandatory new persistent data | The viewing journal restores structured JSON, handles missing/corrupt data, supports updates, deletion and clearing. Storage failures display a message and retain form input. | `JournalStore`, `js/journal.js` |
| Additional complete CRUD | Create a planned, watching or watched film; read saved cards; edit a record without changing its ID; delete a record or clear the journal after confirmation. | `journal.html`, `journal-en.html`, `js/journal.js` |
| Additional advanced search and pagination | Discover combines title/director search, director, release decade and RT score filters, four sort orders and six-item pagination over the actual API collection. | `Film.matches()`, `js/discover.js` |
| Additional statistics and visualization | Total entries, completed films, average personal rating and viewing minutes are calculated from saved records. A labelled bar chart shows planned/watching/watched counts. | `JournalStore.getStats()`, `js/journal.js`, `css/journal.css` |
| Additional advanced form | Selecting Watched reveals required personal rating and date fields. Custom validation checks whole ratings, calendar dates, release years, runtime and note length; focus moves to the first invalid field. | `JournalEntry.validate()`, `js/journal.js` |

The previous watchlist and theme storage are retained. The new journal adds independent persistent data and complete user workflows beyond those Endterm features.

## Original functionality

- Home with four curated cards and a random spotlight recommendation.
- A 12-film catalogue with bilingual title/director search, genre and minimum IMDb filters, sorting and Watchlist.
- Favourite IDs persist across reloads and are shared between the two language versions on the same origin.
- Picker filters by genre, maximum runtime and minimum IMDb score. It avoids the previous result when alternatives exist and handles zero matches.
- Ratings table supports search and sorting without changing the shared movie collection.
- Dark/light theme and responsive keyboard-accessible navigation, including Escape to close the menu.
- About feedback form checks name length, email format, movie ID, whole-number rating, review length and consent.
- jQuery FAQ accordion, character counter and success/error feedback effects.
- Kazakh and English navigation across all seven page types.
- Catalogue cards link to a prefilled journal form. Watchlist view is reflected in its URL and language-switch links.

The About form remains a local validation demonstration. The Journal form explicitly saves film records in the user's browser.

## Run locally

No build step or API key is required. Serve the project over HTTP so storage and remote requests behave consistently.

```bash
git clone https://github.com/Uchiha-Dauren/midterm-project-.git
cd midterm-project-
python3 -m http.server 8000
```

Open http://localhost:8000/ or http://localhost:8000/index-en.html. VS Code Live Server is another option. Keep the same hostname and port when checking persistence because localStorage is scoped to the origin.

## External API

- Provider — community Studio Ghibli API, https://ghibliapi.vercel.app/
- Endpoint — `GET https://ghibliapi.vercel.app/films`
- Authentication — no key required; requests go directly from the browser using CORS.
- JSON fields used — `id`, `title`, `original_title`, `director`, `description`, `release_date`, `running_time`, `rt_score`, `movie_banner` and `image`.
- A request is aborted after 12 seconds. Non-success HTTP responses, malformed JSON and invalid response shapes show a retry action. Refreshing resets pagination while retaining applicable filters.
- Empty API arrays and empty filter results have separate messages.
- Remote text is inserted using `textContent`. API images are accepted from `https://image.tmdb.org`; an unavailable image falls back to its film title.
- Titles and descriptions use the API's source language. Interface controls are translated.
- RT means the Rotten Tomatoes score supplied by the API. It is distinct from the original IMDb/Kinopoisk collection and is not guaranteed to be a current score.
- Network access is needed for Discover. The bundled original catalogue and local journal remain usable when the API is unavailable.

## Browser storage

| Key | Format and purpose |
| --- | --- |
| `cinepick-favorites` | Existing JSON array of original film IDs |
| `cinepick-theme` | Existing string `dark` or `light` |
| `cinepick-journal-v1` | `{ "version": 1, "entries": [...] }` containing personal film records |

A journal record contains `id`, `title`, `year`, `runtime`, `status`, `rating`, `watchedOn`, `note`, `createdAt` and `updatedAt`. Watched records require a rating and viewing date. Other statuses store a null rating and an empty viewing date. Clearing the journal leaves favourites and theme preferences intact.

On load, invalid records and duplicate IDs are skipped with a warning. A failed write does not report a successful save. The `storage` event refreshes open tabs. Before saving, the store rereads current data; revision checks reject stale edits of the same record. localStorage has no atomic multi-tab transaction mechanism, so simultaneous writes should be avoided. Data is local to this browser and origin; clearing site data removes it.

## Code organization

```text
index[−en].html       Original home
movies[−en].html      Original catalogue and Watchlist
picks[−en].html       Original picker and curated recommendations
ratings[−en].html     Original ratings table
about[−en].html       Original form and jQuery FAQ
discover[−en].html    API discovery and pagination
journal[−en].html     Persistent journal and statistics
js/data.js           Original movie and genre arrays
js/app.js            Shared navigation, theme and favourites
js/home.js            Home interactions
js/movies.js          Original catalogue rendering and events
js/picks.js           Original picker
js/ratings.js         Original ratings table
js/validation.js      Original feedback validation
js/jquery-features.js Original jQuery features
js/film.js            Film model
js/discover.js        Fetch, API states, filters and rendering
js/journal-store.js   JournalEntry and JournalStore models
js/journal.js         Journal DOM, form and event handling
css/                 Existing styles and final feature styles
assets/posters/      12 bundled original posters
vendor/              Local Bootstrap and jQuery distributions
tests/models.test.cjs Model and persistence regression tests
```

Scripts use ordered `defer` loading. Shared data loads before shared application functions; page models load before page controllers. Classes contain reusable data rules while page scripts handle DOM updates and events.

## Tests and demonstration

With Node.js installed, run the model regression tests without installing packages.

```bash
node --test tests/models.test.cjs
```

| Check | Expected result |
| --- | --- |
| Original catalogue → search Nolan → save a film → reload | Matching films and persisted Watchlist |
| Watchlist → remove a film; switch language | Correct cards and saved-view URL |
| Picker → restrictive filters | Valid match or clear empty message |
| About → submit empty form, then correct it | Field errors and successful validation |
| About → open FAQ and type a review | jQuery accordion and character count |
| Discover → first load, director/decade/score filters, Next | Remote records, combined filters and six-card pages |
| Discover → query with no matches | Empty result with reset controls |
| DevTools Network → Offline → Refresh collection | Error message and retry button; original catalogue remains available |
| Discover → Add to journal | Title, release year and runtime prefilled |
| Journal → save Planned → edit to Watched | Conditional rating/date validation and same record ID |
| Journal → save, reload, switch language | Restored entries and recalculated statistics |
| Journal → search/filter/sort → delete → clear | Correct records, confirmation and empty state |
| Journal → corrupt its stored JSON and reload | Warning and usable form |
| Journal → edit the same record in two tabs | A stale edit is rejected with a message |
| Desktop, tablet and mobile widths; keyboard Tab and Escape | Accessible navigation, readable forms, wrapping grids and dialogs |

For a defence, demonstrate the whole workflow from Discover to a saved journal entry and its statistics. Explain `fetch`, `await`, API JSON, the `Film` and `JournalEntry` constructors, `validate()`, `toJSON()`, `JournalStore.save()`, and the separation between model and UI code.

## Team contribution record

The existing team and group are retained. The repository history does not establish each student's personal contribution. The following entries must be confirmed by the team before submission; no personal authorship is assumed.

| Member | Confirmed group | Individual contribution |
| --- | --- | --- |
| Dauren | SE-2524 | Awaiting the member's factual contribution statement |
| Iskander | SE-2524 | Awaiting the member's factual contribution statement |
| Nurzhan | SE-2524 | Awaiting the member's factual contribution statement |

All three members should be able to explain and modify both original and final functionality. Final implementation assistance was provided with ChatGPT/Codex; the group should review the code and follow its course's disclosure rules.

## Publication and submission

GitHub Pages serves the project from the repository root on `main`. The submission includes the complete source/assets folder, this README, the published website URL and the repository URL above. The final feature source files must be uploaded together with their HTML pages to avoid broken links or missing scripts.

## Sources and attribution

Bootstrap licensing is included in `LICENSE.bootstrap.txt`; vendor distributions retain their upstream notices. Original film scores are the project's saved snapshot dated 2 October 2026. Studio Ghibli data is provided by the community API linked above. Posters and other film imagery belong to their respective rights holders.
