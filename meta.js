// Videasy Meta Module
// Fetches movie/TV metadata from TMDB API

var TMDB_API_KEY = '66df14f403f8fa60c04cbe8f3f84112a';
var TMDB_API_BASE = 'https://api.themoviedb.org/3';
var TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
var TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

var headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    "Accept": "application/json"
};

function getMetaData(link) {
    console.log("Videasy getMetaData:", link);

    try {
        // Parse link: videasy://movie/123 or videasy://tv/456
        var match = link.match(/videasy:\/\/(movie|tv)\/(\d+)/);
        if (!match) {
            console.error("Invalid link format:", link);
            return null;
        }

        var mediaType = match[1];
        var tmdbId = match[2];
        console.log("Media type:", mediaType, "TMDB ID:", tmdbId);

        // Fetch details from TMDB API
        var url = TMDB_API_BASE + "/" + mediaType + "/" + tmdbId + "?api_key=" + TMDB_API_KEY;
        var response = axios.get(url, { headers: headers });
        var data = response.data;

        var title = data.title || data.name || "Unknown";
        var poster = data.poster_path ? TMDB_IMAGE_BASE + data.poster_path : "";
        var backdrop = data.backdrop_path ? TMDB_BACKDROP_BASE + data.backdrop_path : "";
        var description = data.overview || "";
        var rating = data.vote_average ? data.vote_average.toFixed(1) : "";
        var year = "";

        if (data.release_date) {
            year = data.release_date.split("-")[0];
        } else if (data.first_air_date) {
            year = data.first_air_date.split("-")[0];
        }

        // Get genres
        var genres = [];
        if (data.genres) {
            for (var i = 0; i < data.genres.length; i++) {
                genres.push(data.genres[i].name);
            }
        }

        var linkList = [];

        if (mediaType === "movie") {
            // For movies, just one play link
            linkList.push({
                title: "Play Movie",
                links: [{
                    title: "Videasy Player",
                    link: "videasy://play/movie/" + tmdbId,
                    quality: "HD"
                }]
            });
        } else {
            // For TV shows, fetch seasons and episodes
            var seasons = data.seasons || [];
            var seasonData = [];

            for (var s = 0; s < seasons.length; s++) {
                var season = seasons[s];
                if (season.season_number === 0) continue; // Skip specials

                var seasonNum = season.season_number;
                var episodeCount = season.episode_count || 10;

                // Fetch season details for episode info
                var seasonLinks = [];
                try {
                    var seasonUrl = TMDB_API_BASE + "/tv/" + tmdbId + "/season/" + seasonNum + "?api_key=" + TMDB_API_KEY;
                    var seasonResponse = axios.get(seasonUrl, { headers: headers });
                    var seasonInfo = seasonResponse.data;
                    var episodes = seasonInfo.episodes || [];

                    for (var e = 0; e < episodes.length; e++) {
                        var ep = episodes[e];
                        var epNum = ep.episode_number;
                        var epTitle = ep.name || ("Episode " + epNum);

                        seasonLinks.push({
                            title: "E" + epNum + ": " + epTitle,
                            link: "videasy://play/tv/" + tmdbId + "/" + seasonNum + "/" + epNum,
                            quality: "HD"
                        });
                    }
                } catch (err) {
                    console.log("Failed to fetch season details, using default episodes");
                    // Fallback: create episode links without titles
                    for (var e = 1; e <= episodeCount; e++) {
                        seasonLinks.push({
                            title: "Episode " + e,
                            link: "videasy://play/tv/" + tmdbId + "/" + seasonNum + "/" + e,
                            quality: "HD"
                        });
                    }
                }

                if (seasonLinks.length > 0) {
                    linkList.push({
                        title: "Season " + seasonNum,
                        links: seasonLinks
                    });
                }
            }
        }

        return {
            title: title,
            poster: poster,
            backdrop: backdrop,
            description: description,
            type: mediaType === "tv" ? "series" : "movie",
            rating: rating,
            year: year,
            genres: genres.join(", "),
            tmdbId: tmdbId,
            linkList: linkList
        };

    } catch (err) {
        console.error("getMetaData error:", err);
        return null;
    }
}
