import { EDIT_PLAYLIST } from '../actionTypes'

export function editPlaylist (playlist) {
    return {
        type: EDIT_PLAYLIST,
        playlist
    }
}