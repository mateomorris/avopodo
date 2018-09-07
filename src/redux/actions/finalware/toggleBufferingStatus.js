import { TOGGLE_BUFFERING_STATUS } from '../actionTypes'

export function toggleBufferingStatus(status) {
    return {
        type: TOGGLE_BUFFERING_STATUS,
        status
    }
}