import { UNSTORE_EPISODE } from '../actionTypes'

export function unStoreEpisode (episodeId) {
    return {
        type: UNSTORE_EPISODE,
        episodeId,
    }
}