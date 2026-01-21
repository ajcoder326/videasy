// Videasy Posts Module
// Fetches movie/TV listings from TMDB API

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

        // Parse filter to build TMDB API URL
        if (filter === "trending_day") {
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
            url = TMDB_API_BASE + "/movie/now_playing?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "movie_upcoming") {
            url = TMDB_API_BASE + "/movie/upcoming?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter.indexOf("genre_") === 0) {
            // Genre filter: genre_28_movie or genre_35_tv
            var parts = filter.split("_");
            var genreId = parts[1];
            var mediaType = parts[2];
            url = TMDB_API_BASE + "/discover/" + mediaType + "?api_key=" + TMDB_API_KEY + "&with_genres=" + genreId + "&page=" + page;
        } else {
            // Default to trending
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&page=" + page;
        }

        console.log("TMDB API URL:", url);
        var response = axios.get(url, { headers: headers });

        // IMPORTANT: response.data is a STRING, need to parse as JSON
        var rawData = response.data;
        console.log("Raw response type:", typeof rawData);
        console.log("Raw response (first 200 chars):", String(rawData).substring(0, 200));

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
        var url = TMDB_API_BASE + "/search/multi?api_key=" + TMDB_API_KEY +
            "&query=" + encodeURIComponent(query) + "&page=" + page;

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

        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var mediaType = item.media_type;

            // Only include movies and TV shows
            if (mediaType !== "movie" && mediaType !== "tv") continue;

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

        console.log("Search found", posts.length, "results");
        return posts;

    } catch (err) {
        console.error("getSearchPosts error:", err);
        return [];
    }
}
