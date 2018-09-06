import { SET_RECENT_RELEASE_DATE } from '../actionTypes'

export function setRecentReleaseDate (itunesId, releaseDate) {
    return {
        type: SET_RECENT_RELEASE_DATE,
        itunesId, 
        releaseDate
    }
}