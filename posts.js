// Videasy Posts Module
// Fetches movie/TV listings from TMDB API - focused on Indian content

var TMDB_API_KEY = '66df14f403f8fa60c04cbe8f3f84112a';
var TMDB_API_BASE = 'https://api.themoviedb.org/3';
var TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

var headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json"
};

function getPosts(filter, page) {
    console.log("Videasy getPosts:", filter, "page:", page);

    try {
        var url = "";

        // Parse filter to build TMDB API URL - India focused
        if (filter === "trending_india") {
            // Trending in India region
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "bollywood") {
            // Hindi language movies from India
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY + "&with_original_language=hi&sort_by=popularity.desc&page=" + page;
        } else if (filter === "hindi_tv") {
            // Hindi TV shows
            url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY + "&with_original_language=hi&sort_by=popularity.desc&page=" + page;
        } else if (filter === "south_movies") {
            // South Indian movies (Tamil, Telugu, Malayalam, Kannada)
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY + "&with_original_language=ta|te|ml|kn&sort_by=popularity.desc&page=" + page;
        } else if (filter === "tamil") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY + "&with_original_language=ta&sort_by=popularity.desc&page=" + page;
        } else if (filter === "telugu") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY + "&with_original_language=te&sort_by=popularity.desc&page=" + page;
        } else if (filter === "malayalam") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY + "&with_original_language=ml&sort_by=popularity.desc&page=" + page;
        } else if (filter === "hollywood_hindi") {
            // Popular Hollywood movies (for Hindi dub)
            url = TMDB_API_BASE + "/movie/popular?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "trending_day") {
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "trending_week") {
            url = TMDB_API_BASE + "/trending/all/week?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "movie_popular") {
            url = TMDB_API_BASE + "/movie/popular?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "tv_popular") {
            url = TMDB_API_BASE + "/tv/popular?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "movie_top_rated") {
            url = TMDB_API_BASE + "/movie/top_rated?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "tv_top_rated") {
            url = TMDB_API_BASE + "/tv/top_rated?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "movie_now_playing") {
            url = TMDB_API_BASE + "/movie/now_playing?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "movie_upcoming") {
            url = TMDB_API_BASE + "/movie/upcoming?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter.indexOf("genre_") === 0) {
            // Genre filter: genre_28_movie or genre_35_tv
            var parts = filter.split("_");
            var genreId = parts[1];
            var mediaType = parts[2];
            url = TMDB_API_BASE + "/discover/" + mediaType + "?api_key=" + TMDB_API_KEY + "&with_genres=" + genreId + "&page=" + page;
        } else {
            // Default to trending in India
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        }

        console.log("TMDB API URL:", url);
        var response = axios.get(url, { headers: headers });

        // response.data is a STRING, need to parse as JSON
        var rawData = response.data;
        var data;
        if (typeof rawData === 'string') {
            data = JSON.parse(rawData);
        } else {
            data = rawData;
        }

        var posts = [];
        var results = data.results || [];
        console.log("Found", results.length, "results from TMDB");

        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var mediaType = item.media_type || (filter.indexOf("tv") !== -1 ? "tv" : "movie");
            var title = item.title || item.name || "Unknown";
            var posterPath = item.poster_path;
            var id = item.id;

            if (posterPath && id) {
                posts.push({
                    title: title,
                    link: "videasy://" + mediaType + "/" + id,
                    image: TMDB_IMAGE_BASE + posterPath
                });
            }
        }

        console.log("Returning", posts.length, "posts");
        return posts;

    } catch (err) {
        console.error("getPosts error:", err);
        return [];
    }
}

function getSearchPosts(query, page) {
    console.log("Videasy search:", query, "page:", page);

    try {
        // Search with India region preference
        var url = TMDB_API_BASE + "/search/multi?api_key=" + TMDB_API_KEY +
            "&query=" + encodeURIComponent(query) + "&page=" + page + "&region=IN&include_adult=false";

        console.log("Search URL:", url);
        var response = axios.get(url, { headers: headers });

        // Parse JSON string
        var rawData = response.data;
        var data;
        if (typeof rawData === 'string') {
            data = JSON.parse(rawData);
        } else {
            data = rawData;
        }

        var posts = [];
        var results = data.results || [];
        console.log("Search API returned", results.length, "results");

        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var mediaType = item.media_type;

            // Only include movies and TV shows
            if (mediaType !== "movie" && mediaType !== "tv") continue;

            var title = item.title || item.name || "Unknown";
            var posterPath = item.poster_path;
            var id = item.id;

            // Include items even without poster for better search results
            posts.push({
                title: title,
                link: "videasy://" + mediaType + "/" + id,
                image: posterPath ? TMDB_IMAGE_BASE + posterPath : ""
            });
        }

        console.log("Search found", posts.length, "results");
        return posts;

    } catch (err) {
        console.error("getSearchPosts error:", err);
        return [];
    }
}
