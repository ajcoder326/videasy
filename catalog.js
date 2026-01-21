// Videasy Catalog Module
// Returns categories for browsing using TMDB data

var catalog = [
    { title: "Trending Today", filter: "trending_day" },
    { title: "Trending This Week", filter: "trending_week" },
    { title: "Popular Movies", filter: "movie_popular" },
    { title: "Popular TV Shows", filter: "tv_popular" },
    { title: "Top Rated Movies", filter: "movie_top_rated" },
    { title: "Top Rated TV", filter: "tv_top_rated" },
    { title: "Now Playing", filter: "movie_now_playing" },
    { title: "Upcoming Movies", filter: "movie_upcoming" }
];

var genres = [
    { title: "Action Movies", filter: "genre_28_movie" },
    { title: "Comedy Movies", filter: "genre_35_movie" },
    { title: "Drama Movies", filter: "genre_18_movie" },
    { title: "Horror Movies", filter: "genre_27_movie" },
    { title: "Romance Movies", filter: "genre_10749_movie" },
    { title: "Thriller Movies", filter: "genre_53_movie" },
    { title: "Sci-Fi Movies", filter: "genre_878_movie" },
    { title: "Animation", filter: "genre_16_movie" },
    { title: "Fantasy Movies", filter: "genre_14_movie" },
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
