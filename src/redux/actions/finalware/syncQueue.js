import { SYNC_QUEUE } from '../actionTypes'

export function syncQueue(newQueue) {
    return {
        type: SYNC_QUEUE,
        newQueue
    }
}