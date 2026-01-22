// Videasy Catalog Module
// Returns categories for browsing - focused on Indian content

var catalog = [
    { title: "Trending in India", filter: "trending_india" },
    { title: "Bollywood Movies", filter: "bollywood" },
    { title: "Hindi Web Series", filter: "hindi_tv" },
    { title: "South Indian Movies", filter: "south_movies" },
    { title: "Tamil Movies", filter: "tamil" },
    { title: "Telugu Movies", filter: "telugu" },
    { title: "Malayalam Movies", filter: "malayalam" },
    { title: "Hollywood Hindi", filter: "hollywood_hindi" },
    { title: "Popular Movies", filter: "movie_popular" },
    { title: "Popular TV Shows", filter: "tv_popular" },
    { title: "Top Rated Movies", filter: "movie_top_rated" },
    { title: "Trending Today", filter: "trending_day" }
];

var genres = [
    { title: "Action Movies", filter: "genre_28_movie" },
    { title: "Comedy Movies", filter: "genre_35_movie" },
    { title: "Drama Movies", filter: "genre_18_movie" },
    { title: "Horror Movies", filter: "genre_27_movie" },
    { title: "Romance Movies", filter: "genre_10749_movie" },
    { title: "Thriller Movies", filter: "genre_53_movie" },
    { title: "Crime Movies", filter: "genre_80_movie" },
    { title: "Family Movies", filter: "genre_10751_movie" },
    { title: "Action TV", filter: "genre_10759_tv" },
    { title: "Comedy TV", filter: "genre_35_tv" },
    { title: "Crime TV", filter: "genre_80_tv" },
    { title: "Drama TV", filter: "genre_18_tv" }
];

function getCatalog() {
    return catalog;
}

function getGenres() {
    return genres;
}
