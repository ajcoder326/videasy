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
        var url = TMDB_API_BASE + "/" + filter;

        // Add API key and page
        if (url.indexOf("?") !== -1) {
            url = url + "&api_key=" + TMDB_API_KEY + "&page=" + page;
        } else {
            url = url + "?api_key=" + TMDB_API_KEY + "&page=" + page;
        }

        console.log("TMDB API URL:", url);
        var response = axios.get(url, { headers: headers });
        var data = response.data;
        var posts = [];

        var results = data.results || [];
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
                    thumbnail: TMDB_IMAGE_BASE + posterPath
                });
            }
        }

        console.log("Found", posts.length, "posts from TMDB");
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
        var data = response.data;
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
                    thumbnail: TMDB_IMAGE_BASE + posterPath
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
