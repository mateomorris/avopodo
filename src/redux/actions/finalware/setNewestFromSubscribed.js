import { SET_NEWEST_FROM_SUBSCRIBED } from '../actionTypes'

export function setNewestFromSubscribed(episodeList) {
    return {
        type: SET_NEWEST_FROM_SUBSCRIBED,
        episodeList
    } 
}