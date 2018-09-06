import { TOGGLE_BUFFERING_STATUS } from '../actionTypes'

export function toggleBufferingStatus(buffering) {
    return {
        type: TOGGLE_BUFFERING_STATUS,
        status: buffering
    }
}