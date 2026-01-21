// Videasy Stream Module
// Returns Videasy player embed URLs for WebView playback

var VIDEASY_PLAYER = 'https://player.videasy.net';

function getStreams(link, type) {
    console.log("Videasy getStreams:", link, "type:", type);

    try {
        // Parse link: videasy://play/movie/123 or videasy://play/tv/123/1/1
        var movieMatch = link.match(/videasy:\/\/play\/movie\/(\d+)/);
        var tvMatch = link.match(/videasy:\/\/play\/tv\/(\d+)\/(\d+)\/(\d+)/);

        var streams = [];

        if (movieMatch) {
            var tmdbId = movieMatch[1];
            console.log("Movie stream for TMDB ID:", tmdbId);

            streams.push({
                server: "Videasy",
                link: VIDEASY_PLAYER + "/movie/" + tmdbId + "?color=8B5CF6",
                type: "webview",
                quality: "HD"
            });

        } else if (tvMatch) {
            var tmdbId = tvMatch[1];
            var season = tvMatch[2];
            var episode = tvMatch[3];
            console.log("TV stream - ID:", tmdbId, "S:", season, "E:", episode);

            streams.push({
                server: "Videasy",
                link: VIDEASY_PLAYER + "/tv/" + tmdbId + "/" + season + "/" + episode +
                    "?color=8B5CF6&nextEpisode=true&episodeSelector=true",
                type: "webview",
                quality: "HD"
            });

        } else {
            console.error("Invalid stream link format:", link);
        }

        console.log("Returning", streams.length, "streams");
        return streams;

    } catch (err) {
        console.error("getStreams error:", err);
        return [];
    }
}
