// Videasy Catalog Module
// Returns categories for browsing using TMDB data

var TMDB_API_KEY = '66df14f403f8fa60c04cbe8f3f84112a';
var TMDB_API_BASE = 'https://api.themoviedb.org/3';

function getCatalogItems() {
    return [
        { title: "Trending Today", filter: "trending/all/day" },
        { title: "Trending This Week", filter: "trending/all/week" },
        { title: "Popular Movies", filter: "movie/popular" },
        { title: "Popular TV Shows", filter: "tv/popular" },
        { title: "Top Rated Movies", filter: "movie/top_rated" },
        { title: "Top Rated TV", filter: "tv/top_rated" },
        { title: "Now Playing", filter: "movie/now_playing" },
        { title: "Upcoming Movies", filter: "movie/upcoming" },
        { title: "Airing Today", filter: "tv/airing_today" },
        { title: "On The Air", filter: "tv/on_the_air" }
    ];
}

function getGenres() {
    return [
        { title: "Action Movies", filter: "discover/movie?with_genres=28" },
        { title: "Comedy Movies", filter: "discover/movie?with_genres=35" },
        { title: "Drama Movies", filter: "discover/movie?with_genres=18" },
        { title: "Horror Movies", filter: "discover/movie?with_genres=27" },
        { title: "Romance Movies", filter: "discover/movie?with_genres=10749" },
        { title: "Thriller Movies", filter: "discover/movie?with_genres=53" },
        { title: "Sci-Fi Movies", filter: "discover/movie?with_genres=878" },
        { title: "Animation", filter: "discover/movie?with_genres=16" },
        { title: "Documentary", filter: "discover/movie?with_genres=99" },
        { title: "Fantasy Movies", filter: "discover/movie?with_genres=14" },
        { title: "Action TV", filter: "discover/tv?with_genres=10759" },
        { title: "Comedy TV", filter: "discover/tv?with_genres=35" },
        { title: "Crime TV", filter: "discover/tv?with_genres=80" },
        { title: "Drama TV", filter: "discover/tv?with_genres=18" }
    ];
}
