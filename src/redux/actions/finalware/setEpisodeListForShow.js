import { SET_EPISODE_LIST_FOR_SHOW } from '../actionTypes'

export function setEpisodeListForShow (showId, episodeList) {
    return {
        type: SET_EPISODE_LIST_FOR_SHOW,
        showId, 
        episodeList
    }
}