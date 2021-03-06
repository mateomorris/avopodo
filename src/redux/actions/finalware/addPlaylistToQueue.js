import { ADD_PLAYLIST_TO_QUEUE } from '../actionTypes'

export function addPlaylistToQueue(playlist) {
    let trackPlayerQueue = playlist.episodeQueue.episodeList.map((episode) => {
        return {
            id: episode.id,
            title: episode.title,
            url: episode.audio,
            artist: episode.showTitle,
            duration: episode.duration,
            description: episode.description,
            // date: '',
            artwork: episode.showImage
        }
    })
    return {
        type: ADD_PLAYLIST_TO_QUEUE,
        playlist,
        trackPlayerQueue
    }
}