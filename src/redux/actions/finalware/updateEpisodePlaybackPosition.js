import { UPDATE_EPISODE_PLAYBACK_POSITION } from '../actionTypes'

export function updateEpisodePlaybackPosition(episodeId, position) {
    return {
        type: UPDATE_EPISODE_PLAYBACK_POSITION,
        episodeId, 
        position
    }
}