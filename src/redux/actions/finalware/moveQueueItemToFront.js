import { MOVE_QUEUE_ITEM_TO_FRONT } from '../actionTypes'

export function moveQueueItemToFront(index) {
    return {
        type: MOVE_QUEUE_ITEM_TO_FRONT,
        index
    }
}