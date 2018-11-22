import { UPDATE_NOW_PLAYING } from '../actionTypes'

export function updateNowPlaying(newEpisode) {
    return {
        type: UPDATE_NOW_PLAYING,
        newEpisode
    }
}