import { SET_EPISODE_AS_DOWNLOADING } from '../actionTypes'

export function setEpisodeAsDownloading (episode) {
    return {
        type: SET_EPISODE_AS_DOWNLOADING,
        episode
    }
}