// The original midterm collection. Scores are saved snapshots, not live ratings.
const movies = [
  {
    "id": "tt1375666",
    "title": {
      "kk": "Бастау",
      "en": "Inception"
    },
    "plot": {
      "kk": "Өзгенің түсіне кіре алатын маман қауіпті тапсырма алады: бұл жолы ол ойды ұрламай, санаға жаңа идея енгізуі керек.",
      "en": "A specialist who enters dreams takes on a dangerous task: plant an idea instead of stealing one."
    },
    "genres": [
      "scifi",
      "thriller"
    ],
    "year": 2010,
    "imdb": 8.8,
    "kp": 8.7,
    "kpId": "447301",
    "director": "Christopher Nolan",
    "runtime": 148
  },
  {
    "id": "tt0816692",
    "title": {
      "kk": "Интерстеллар",
      "en": "Interstellar"
    },
    "plot": {
      "kk": "Ұшқыш адамзатқа жаңа мекен іздеу үшін отбасын Жерде қалдырып, ғарышқа аттанады.",
      "en": "A pilot leaves his family and crosses the galaxy to search for a future for humanity."
    },
    "genres": [
      "scifi",
      "drama"
    ],
    "year": 2014,
    "imdb": 8.7,
    "kp": 8.7,
    "kpId": "258687",
    "director": "Christopher Nolan",
    "runtime": 169
  },
  {
    "id": "tt0468569",
    "title": {
      "kk": "Қара рыцарь",
      "en": "The Dark Knight"
    },
    "plot": {
      "kk": "Бэтмен Готэмді хаосқа айналдырғысы келген Джокерге қарсы тұрады. Бұл күрес оның ұстанымдарын сынайды.",
      "en": "Batman faces an unpredictable enemy who turns Gotham into a test of courage and principles."
    },
    "genres": [
      "action",
      "thriller"
    ],
    "year": 2008,
    "imdb": 9.1,
    "kp": 8.5,
    "kpId": "111543",
    "director": "Christopher Nolan",
    "runtime": 152
  },
  {
    "id": "tt0111161",
    "title": {
      "kk": "Шоушенктен қашу",
      "en": "The Shawshank Redemption"
    },
    "plot": {
      "kk": "Түрмеде танысқан екі адам ұзақ жылдар бойы достығын сақтап, үмітін үзбеуге тырысады.",
      "en": "Two prisoners form a lasting friendship and find ways to hold on to hope."
    },
    "genres": [
      "drama"
    ],
    "year": 1994,
    "imdb": 9.3,
    "kp": 9.1,
    "kpId": "326",
    "director": "Frank Darabont",
    "runtime": 142
  },
  {
    "id": "tt8946378",
    "title": {
      "kk": "Пышақтар суырылсын",
      "en": "Knives Out"
    },
    "plot": {
      "kk": "Белгілі жазушының өлімін зерттеген детектив оның отбасындағы әр адамның жасыратын сыры барын байқайды.",
      "en": "A detective investigates a writer’s death, discovering that everyone in the family has something to hide."
    },
    "genres": [
      "mystery",
      "comedy"
    ],
    "year": 2019,
    "imdb": 7.9,
    "kp": 8.2,
    "kpId": "1188529",
    "director": "Rian Johnson",
    "runtime": 130
  },
  {
    "id": "tt2948356",
    "title": {
      "kk": "Зоотопия",
      "en": "Zootopia"
    },
    "plot": {
      "kk": "Жас қоян полицей мен айлакер түлкі жануарлар қаласындағы жұмбақ істі бірге тергейді.",
      "en": "A rookie rabbit officer teams up with a clever fox to solve a mystery in a city of animals."
    },
    "genres": [
      "animation",
      "mystery"
    ],
    "year": 2016,
    "imdb": 8.0,
    "kp": 8.3,
    "kpId": "775276",
    "director": "Byron Howard, Rich Moore",
    "runtime": 108
  },
  {
    "id": "tt0126029",
    "title": {
      "kk": "Шрек",
      "en": "Shrek"
    },
    "plot": {
      "kk": "Жасыл дәу мен сөзшең есек ханшайымды құтқарып, Шректің тыныш батпағын қайтару үшін жолға шығады.",
      "en": "An ogre and a talkative donkey set out to rescue a princess and reclaim a quiet swamp."
    },
    "genres": [
      "animation",
      "comedy"
    ],
    "year": 2001,
    "imdb": 7.9,
    "kp": 8.2,
    "kpId": "430",
    "director": "Andrew Adamson, Vicky Jenson",
    "runtime": 90
  },
  {
    "id": "tt3915174",
    "title": {
      "kk": "Етік киген мысық: Соңғы тілек",
      "en": "Puss in Boots: The Last Wish"
    },
    "plot": {
      "kk": "Тоғыз өмірінен біреуі ғана қалған мысық бәрін өзгерте алатын сиқырлы тілекті іздеуге аттанады.",
      "en": "Down to his last life, Puss begins a journey to find a wish that could change everything."
    },
    "genres": [
      "animation",
      "adventure"
    ],
    "year": 2022,
    "imdb": 7.8,
    "kp": 8.1,
    "kpId": "840821",
    "director": "Joel Crawford",
    "runtime": 102
  },
  {
    "id": "tt2278388",
    "title": {
      "kk": "Гранд Будапешт қонақүйі",
      "en": "The Grand Budapest Hotel"
    },
    "plot": {
      "kk": "Қонақүй қызметкері мен жас көмекшісі ұрланған сурет пен даулы мұраға байланысты оқиғалардың ортасында қалады.",
      "en": "A hotel concierge and his young friend become entangled in a stolen painting and a disputed inheritance."
    },
    "genres": [
      "comedy",
      "adventure"
    ],
    "year": 2014,
    "imdb": 8.1,
    "kp": 8.0,
    "kpId": "683999",
    "director": "Wes Anderson",
    "runtime": 99
  },
  {
    "id": "tt4633694",
    "title": {
      "kk": "Өрмекші адам: Ғаламдар тоғысында",
      "en": "Spider-Man: Into the Spider-Verse"
    },
    "plot": {
      "kk": "Майлз Моралес жаңа қабілеттерін танып, параллель әлемдерден келген өзге Өрмекші адамдармен кездеседі.",
      "en": "Miles Morales discovers his powers and meets other Spider-heroes from parallel worlds."
    },
    "genres": [
      "animation",
      "action"
    ],
    "year": 2018,
    "imdb": 8.4,
    "kp": 8.2,
    "kpId": "920265",
    "director": "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    "runtime": 117
  },
  {
    "id": "tt0245429",
    "title": {
      "kk": "Рухтар жетегінде",
      "en": "Spirited Away"
    },
    "plot": {
      "kk": "Рухтар әлеміне тап болған қыз ата-анасын құтқарып, үйіне оралу үшін батылдық танытуы керек.",
      "en": "A young girl enters a world of spirits and must find the courage to save her parents."
    },
    "genres": [
      "animation",
      "adventure"
    ],
    "year": 2001,
    "imdb": 8.6,
    "kp": 8.6,
    "kpId": "370",
    "director": "Hayao Miyazaki",
    "runtime": 124
  },
  {
    "id": "tt0120382",
    "title": {
      "kk": "Труман шоуы",
      "en": "The Truman Show"
    },
    "plot": {
      "kk": "Қарапайым өмір сүріп жүрген Труман айналасындағы таныс әлемде үлкен құпия барын сезе бастайды.",
      "en": "A man begins to notice that the familiar world around him is hiding an extraordinary secret."
    },
    "genres": [
      "drama",
      "comedy"
    ],
    "year": 1998,
    "imdb": 8.2,
    "kp": 8.3,
    "kpId": "4541",
    "director": "Peter Weir",
    "runtime": 103
  }
];

// A second array supplies the same genre names to every page.
const genres = [
  {
    "id": "scifi",
    "label": {
      "kk": "Ғылыми фантастика",
      "en": "Sci-fi"
    }
  },
  {
    "id": "animation",
    "label": {
      "kk": "Анимация",
      "en": "Animation"
    }
  },
  {
    "id": "drama",
    "label": {
      "kk": "Драма",
      "en": "Drama"
    }
  },
  {
    "id": "comedy",
    "label": {
      "kk": "Комедия",
      "en": "Comedy"
    }
  },
  {
    "id": "action",
    "label": {
      "kk": "Экшн",
      "en": "Action"
    }
  },
  {
    "id": "mystery",
    "label": {
      "kk": "Детектив",
      "en": "Mystery"
    }
  },
  {
    "id": "adventure",
    "label": {
      "kk": "Шытырман оқиға",
      "en": "Adventure"
    }
  },
  {
    "id": "thriller",
    "label": {
      "kk": "Триллер",
      "en": "Thriller"
    }
  }
];

function getMovieTitle(movie) {
    return movie.title[document.documentElement.lang === 'en' ? 'en' : 'kk'];
}

function getGenreLabel(id) {
    const genre = genres.find(function (item) { return item.id === id; });
    return genre ? genre.label[document.documentElement.lang === 'en' ? 'en' : 'kk'] : id;
}

function getMovieGenres(movie) {
    return movie.genres.map(getGenreLabel).join(' · ');
}
