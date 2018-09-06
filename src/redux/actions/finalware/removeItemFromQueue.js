import { REMOVE_ITEM_FROM_QUEUE } from '../actionTypes'

export function removeItemFromQueue (index) {
    return {
        type: REMOVE_ITEM_FROM_QUEUE,
        index
    }
}