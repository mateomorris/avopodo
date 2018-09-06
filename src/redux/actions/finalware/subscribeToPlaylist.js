import { CREATE_PLAYLIST } from '../actionTypes'

export function subscribeToPlaylist(playlist) {
    return {
        type: CREATE_PLAYLIST,
        playlist
    }
}