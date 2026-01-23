// Videasy Posts Module
// Fetches movie/TV listings from TMDB API - focused on Indian content

var TMDB_API_KEY = '66df14f403f8fa60c04cbe8f3f84112a';
var TMDB_API_BASE = 'https://api.themoviedb.org/3';
var TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

var headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json"
};

// Get today's date in YYYY-MM-DD format for filtering unreleased content
function getTodayDate() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function getPosts(filter, page) {
    console.log("Videasy getPosts:", filter, "page:", page);

    try {
        var url = "";
        var today = getTodayDate();

        // Parse filter to build TMDB API URL - India focused
        if (filter === "trending_india") {
            // Trending in India region
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "bollywood") {
            // Hindi language movies - sort by latest, hide unreleased
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=hi&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "hindi_tv") {
            // Hindi TV shows - sort by latest aired, hide unreleased
            url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                "&with_original_language=hi&sort_by=first_air_date.desc&first_air_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "south_movies") {
            // South Indian movies - sort by latest
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ta|te|ml|kn&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "tamil") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ta&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "telugu") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=te&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "malayalam") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&with_original_language=ml&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "hollywood_hindi") {
            // Popular Hollywood movies (for Hindi dub) - only released
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&region=IN&sort_by=release_date.desc&release_date.lte=" + today +
                "&page=" + page;
        } else if (filter === "trending_day") {
            url = TMDB_API_BASE + "/trending/all/day?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "trending_week") {
            url = TMDB_API_BASE + "/trending/all/week?api_key=" + TMDB_API_KEY + "&page=" + page;
        } else if (filter === "movie_popular") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&sort_by=popularity.desc&release_date.lte=" + today + "&page=" + page;
        } else if (filter === "tv_popular") {
            url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                "&sort_by=popularity.desc&first_air_date.lte=" + today + "&page=" + page;
        } else if (filter === "movie_top_rated") {
            url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                "&sort_by=vote_average.desc&vote_count.gte=100&release_date.lte=" + today + "&page=" + page;
        } else if (filter === "tv_top_rated") {
            url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                "&sort_by=vote_average.desc&vote_count.gte=100&first_air_date.lte=" + today + "&page=" + page;
        } else if (filter === "movie_now_playing") {
            url = TMDB_API_BASE + "/movie/now_playing?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter === "movie_upcoming") {
            // Keep upcoming as is - these are meant to show unreleased
            url = TMDB_API_BASE + "/movie/upcoming?api_key=" + TMDB_API_KEY + "&region=IN&page=" + page;
        } else if (filter.indexOf("genre_") === 0) {
            // Genre filter: genre_28_movie or genre_35_tv
            var parts = filter.split("_");
            var genreId = parts[1];
            var mediaType = parts[2];

            if (mediaType === "movie") {
                url = TMDB_API_BASE + "/discover/movie?api_key=" + TMDB_API_KEY +
                    "&with_genres=" + genreId + "&sort_by=release_date.desc&release_date.lte=" + today +
                    "&page=" + page;
            } else {
                url = TMDB_API_BASE + "/discover/tv?api_key=" + TMDB_API_KEY +
                    "&with_genres=" + genreId + "&sort_by=first_air_date.desc&first_air_date.lte=" + today +
                    "&page=" + page;
            }
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
        var today = getTodayDate();

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

            // Filter out unreleased content from search
            var releaseDate = item.release_date || item.first_air_date;
            if (releaseDate && releaseDate > today) {
                console.log("Skipping unreleased:", item.title || item.name, "date:", releaseDate);
                continue;
            }

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

        console.log("Search found", posts.length, "results (after filtering unreleased)");
        return posts;

    } catch (err) {
        console.error("getSearchPosts error:", err);
        return [];
    }
}

// Autocomplete/suggestions function
function getSearchSuggestions(query) {
    console.log("Videasy search suggestions:", query);

    if (!query || query.length < 2) {
        return [];
    }

    try {
        var today = getTodayDate();

        // Use search API for autocomplete
        var url = TMDB_API_BASE + "/search/multi?api_key=" + TMDB_API_KEY +
            "&query=" + encodeURIComponent(query) + "&page=1&region=IN&include_adult=false";

        var response = axios.get(url, { headers: headers });
        var rawData = response.data;
        var data;
        if (typeof rawData === 'string') {
            data = JSON.parse(rawData);
        } else {
            data = rawData;
        }

        var suggestions = [];
        var results = data.results || [];

        // Return top 10 suggestions
        for (var i = 0; i < Math.min(results.length, 10); i++) {
            var item = results[i];
            var mediaType = item.media_type;

            if (mediaType !== "movie" && mediaType !== "tv") continue;

            // Filter unreleased
            var releaseDate = item.release_date || item.first_air_date;
            if (releaseDate && releaseDate > today) continue;

            var title = item.title || item.name;
            if (title) {
                suggestions.push(title);
            }
        }

        console.log("Returning", suggestions.length, "suggestions");
        return suggestions;

    } catch (err) {
        console.error("getSearchSuggestions error:", err);
        return [];
    }
}
