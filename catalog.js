// Videasy Catalog Module
// Returns categories for browsing - focused on Indian content

var catalog = [
    { title: "Trending in India", filter: "trending_india" },
    { title: "Latest Bollywood", filter: "bollywood" },
    { title: "Hindi Web Series", filter: "hindi_tv" },
    { title: "Latest South Indian", filter: "south_movies" },
    { title: "Latest Tamil Movies", filter: "tamil" },
    { title: "Latest Telugu Movies", filter: "telugu" },
    { title: "Latest Malayalam", filter: "malayalam" },
    { title: "Hollywood in Hindi", filter: "hollywood_hindi" },
    { title: "Popular Movies", filter: "movie_popular" },
    { title: "Popular Web Series", filter: "tv_popular" },
    { title: "Top Rated Movies", filter: "movie_top_rated" },
    { title: "Top Rated Series", filter: "tv_top_rated" },
    { title: "Now Playing", filter: "movie_now_playing" },
    { title: "Trending Today", filter: "trending_day" }
];

var genres = [
    { title: "Latest Action Movies", filter: "genre_28_movie" },
    { title: "Latest Comedy Movies", filter: "genre_35_movie" },
    { title: "Latest Drama Movies", filter: "genre_18_movie" },
    { title: "Latest Horror Movies", filter: "genre_27_movie" },
    { title: "Latest Romance Movies", filter: "genre_10749_movie" },
    { title: "Latest Thriller Movies", filter: "genre_53_movie" },
    { title: "Latest Crime Movies", filter: "genre_80_movie" },
    { title: "Latest Family Movies", filter: "genre_10751_movie" },
    { title: "Latest Action Series", filter: "genre_10759_tv" },
    { title: "Latest Comedy Series", filter: "genre_35_tv" },
    { title: "Latest Crime Series", filter: "genre_80_tv" },
    { title: "Latest Drama Series", filter: "genre_18_tv" }
];

function getCatalog() {
    return catalog;
}

function getGenres() {
    return genres;
}
