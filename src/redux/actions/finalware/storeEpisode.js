import { STORE_EPISODE } from '../actionTypes'

export function storeEpisode (episode, location) {
    return {
        type: STORE_EPISODE,
        episode,
        location
    }
}