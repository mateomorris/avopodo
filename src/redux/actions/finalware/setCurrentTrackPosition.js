import { SET_CURRENT_TRACK_POSITION } from '../actionTypes'

export function setCurrentTrackPosition(episodeId, startPlaying = false) {
    return {
        type: SET_CURRENT_TRACK_POSITION,
        episodeId,
        startPlaying
    }
}