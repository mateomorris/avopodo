import { UPDATE_PLAY_QUEUE } from '../actionTypes'

export function updatePlayQueue(newPlayQueue) {
    return {
        type: UPDATE_PLAY_QUEUE,
        newPlayQueue
    }
}