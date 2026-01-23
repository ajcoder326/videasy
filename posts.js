// Videasy Posts Module
// Fetches movie/TV listings from TMDB API - focused on Indian content

var TMDB_API_KEY = '66df14f403f8fa60c04cbe8f3f84112a';
var TMDB_API_BASE = 'https://api.themoviedb.org/3';
var TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

var headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json"
};

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

// Check if date is in the future (strictly after today)
function isFutureRelease(releaseDate) {
    if (!releaseDate) return false;
    return releaseDate > getTodayDate();
}

function getPosts(filter, page) {
    console.log("Videasy getPosts:", filter, "page:", page);

    try {
        var url = "";
        var today = getTodayDate();

        // Sort by release date descending for "latest" categories
        if (filter === "trending_india") {
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "bollywood") {
            // Hindi movies - LATEST first, filter out future releases
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=hi&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
        } else if (filter === "hindi_tv") {
            url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                "&with_original_language=hi&sort_by=first_air_date.desc&first_air_date.lte=" + today + "&page=" + page;
        } else if (filter === "south_movies") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ta|te|ml|kn&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
        } else if (filter === "tamil") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ta&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
        } else if (filter === "telugu") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=te&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
        } else if (filter === "malayalam") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ml&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
        } else if (filter === "hollywood_hindi") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=en&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
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
            var parts = filter.split("_");
            var genreId = parts[1];
            var mediaType = parts[2];
            if (mediaType === "movie") {
                url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                    "&with_genres=" + genreId + "&sort_by=primary_release_date.desc&primary_release_date.lte=" + today + "&page=" + page;
            } else {
                url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                    "&with_genres=" + genreId + "&sort_by=first_air_date.desc&first_air_date.lte=" + today + "&page=" + page;
            }
        } else {
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        }

        console.log("TMDB API URL:", url);
        var response = axios.get(url, { headers: headers });

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
        var url = TMDB_API_BASE + "/search/multi?api_key=" + TMDB_API_KEY +
            "&query=" + encodeURIComponent(query) + "&page=" + page + "&region=IN&include_adult=false";

        var response = axios.get(url, { headers: headers });
        var rawData = response.data;
        var data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

        var posts = [];
        var results = data.results || [];

        for (var i = 0; i < results.length; i++) {
            var item = results[i];
            var mediaType = item.media_type;

            if (mediaType !== "movie" && mediaType !== "tv") continue;

            // Skip future releases
            var releaseDate = item.release_date || item.first_air_date;
            if (isFutureRelease(releaseDate)) continue;

            var title = item.title || item.name || "Unknown";
            var posterPath = item.poster_path;
            var id = item.id;

            posts.push({
                title: title,
                link: "videasy://" + mediaType + "/" + id,
                image: posterPath ? TMDB_IMAGE_BASE + posterPath : ""
            });
        }

        return posts;
    } catch (err) {
        console.error("getSearchPosts error:", err);
        return [];
    }
}
