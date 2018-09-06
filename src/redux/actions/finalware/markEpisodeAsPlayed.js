import { MARK_EPISODE_AS_PLAYED } from '../actionTypes'

export function markEpisodeAsPlayed(episodeId) {
    return {
        type: MARK_EPISODE_AS_PLAYED,
        episodeId
    }
}