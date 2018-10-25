import { SET_PLAYLIST_QUEUE } from '../actionTypes'

export function setPlaylistQueue(existingPlaylistId, queue, queueDuration) {
    return {
        type: SET_PLAYLIST_QUEUE,
        existingPlaylistId,
        queue: {
            episodeList: queue, 
            episodeListDuration: queueDuration
        }
    }
}