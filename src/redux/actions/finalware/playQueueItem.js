import { PLAY_NEXT_ITEM_IN_QUEUE } from '../actionTypes'

export function playQueueItem(index) {
    return {
        type: PLAY_NEXT_ITEM_IN_QUEUE,
        index
    }
}