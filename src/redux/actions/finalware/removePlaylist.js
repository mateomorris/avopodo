import { REMOVE_PLAYLIST } from '../actionTypes'

export function removePlaylist (playlistId) {
    return {
        type: REMOVE_PLAYLIST,
        playlistId
    }
}