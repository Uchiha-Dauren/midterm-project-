# CinePick — Movie Recommendation Website

## Project Overview

CinePick is a responsive and interactive movie recommendation website developed as a Web Development Endterm Project at Astana IT University.

The project is a continuation of our Midterm Project. It helps users discover movies, compare IMDb and Kinopoisk ratings, filter movies by different criteria, and save their favorite films.

The website supports two languages: Kazakh and English.

## Technologies Used

- HTML5 — website structure
- CSS3 — styling and responsive design
- Bootstrap 5 — responsive layout and components
- JavaScript — interactive functionality and DOM manipulation
- jQuery 3.7.1 — events, animations, and DOM traversal
- LocalStorage — saving favorites and theme preferences

## Main Features

### 1. Movie Catalog
- Browse a collection of 12 movies.
- Search movies by title or director.
- Filter movies by genre and minimum IMDb rating.
- Sort movies by rating, release year, or title.
- Dynamically generate movie cards using JavaScript.

### 2. Movie Recommendation
- Get a random movie recommendation.
- Choose a preferred genre.
- Set maximum movie duration.
- Set minimum IMDb rating.
- Generate another recommendation without repeating the previous movie when alternatives are available.

### 3. Favorites / Watchlist
- Add or remove movies from favorites.
- View saved movies in a separate catalog tab.
- Save favorite movie IDs using LocalStorage.
- Keep favorites after refreshing the website.

### 4. Ratings Comparison
- Compare IMDb and Kinopoisk ratings.
- Search movies in the ratings table.
- Sort movies by different criteria.
- Dynamically update the table using JavaScript.

### 5. Theme and Language
- Switch between dark and light themes.
- Save theme preferences using LocalStorage.
- Switch between Kazakh and English.
- Use responsive navigation on mobile devices.

### 6. Feedback Form Validation

The feedback form validates:

- Name: 2–60 characters.
- Email: valid email format.
- Movie: a movie must be selected.
- Rating: whole number between 1 and 10.
- Review: 20–500 characters.
- Consent: checkbox must be selected.

Invalid fields display specific error messages. A success message appears when all fields are valid.

The feedback form is a demonstration feature. It does not send or store user information.

### 7. jQuery Features

- FAQ accordion using `slideUp()` and `slideDown()`.
- Form success animation using `fadeIn()`.
- Hiding success feedback using `fadeOut()`.
- Character counter for the review field.
- DOM traversal using `closest()`, `parent()`, `next()`, `siblings()`, and `find()`.
- Event handling using `.on()`.

## Project Structure

```text
midterm-project-/
├── index.html
├── movies.html
├── picks.html
├── ratings.html
├── about.html
├── index-en.html
├── movies-en.html
├── picks-en.html
├── ratings-en.html
├── about-en.html
├── css/
│   ├── style.css
│   └── endterm.css
├── js/
│   ├── data.js
│   ├── app.js
│   ├── home.js
│   ├── movies.js
│   ├── picks.js
│   ├── ratings.js
│   ├── validation.js
│   └── jquery-features.js
├── assets/
│   └── posters/
└── vendor/
    ├── jquery-3.7.1.min.js
    ├── bootstrap.min.css
    └── bootstrap.bundle.min.js
```

## How to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/Uchiha-Dauren/midterm-project-.git
```

2. Open the project folder:

```bash
cd midterm-project-
```

3. Open `index.html` in a web browser.

No additional installation or backend server is required.

## How to Test Interactive Features

| Feature | Testing Instructions | Expected Result |
|---|---|---|
| Movie Search | Enter a movie title in the search field | Matching movies appear |
| Genre Filter | Select a genre | Only matching movies appear |
| Sorting | Change the sorting option | Movies appear in the selected order |
| Random Movie | Click the recommendation button | A movie recommendation appears |
| Favorites | Click the heart icon | Movie is added to or removed from the watchlist |
| LocalStorage | Save a movie and refresh the page | The movie remains saved |
| Theme Switcher | Click the theme button | Website switches between dark and light |
| Form Validation | Submit an empty or invalid form | Error messages appear |
| Successful Validation | Complete all fields correctly | Success message appears |
| FAQ Accordion | Click a FAQ question | Answer expands or collapses |
| Language Switch | Switch between Kazakh and English | Website language changes |

## JavaScript Concepts Demonstrated

The project demonstrates:

- Arrays and objects
- Variables (`let`, `const`)
- Functions, parameters, and return values
- Loops (`forEach`, `for...of`)
- Array methods (`filter`, `find`, `map`, `sort`)
- DOM selection and manipulation
- Dynamic element creation and removal
- Event handling with `addEventListener`
- Form validation and `preventDefault()`
- LocalStorage and JSON
- jQuery selectors, events, traversal, and effects

## Project Pages

1. **Home** — Main page with featured movies and random recommendations.
2. **Movies** — Interactive movie catalog with search, filters, and favorites.
3. **Picks** — Personalized movie recommendation based on user preferences.
4. **Ratings** — Comparison of IMDb and Kinopoisk ratings.
5. **About** — Project information, feedback form, and FAQ section.

All five pages are available in Kazakh and English.

## Project Repository

GitHub: https://github.com/Uchiha-Dauren/midterm-project-

## Team Members

Astana IT University

Course: Web Development

Project: Endterm Project

Team members: [Add team member names]

## Conclusion

CinePick demonstrates practical knowledge of HTML, CSS, Bootstrap, JavaScript, and jQuery.

The project combines responsive web design with interactive features such as dynamic movie filtering, personalized recommendations, favorites management, form validation, and jQuery animations.

The main goal of the project is to provide a simple and user-friendly platform for discovering and comparing movies.
