import { UPDATE_PLAYLIST_EPISODE_LIST } from '../actionTypes'

export function updatePlaylistEpisodeList(playlistId, newEpisodeList) {
    return {
        type: UPDATE_PLAYLIST_EPISODE_LIST,
        playlistId,
        newEpisodeList
    }
}