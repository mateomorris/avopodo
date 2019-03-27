import { SUBSCRIBE_TO_MULTIPLE_SHOWS } from '../actionTypes'

export function subscribeToMultipleShows (shows) {
    return {
        type: SUBSCRIBE_TO_MULTIPLE_SHOWS,
        shows
    }
}