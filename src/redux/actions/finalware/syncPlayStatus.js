import { SYNC_PLAY_STATUS } from '../actionTypes'

export function syncPlayStatus(playing) {
    return {
        type: SYNC_PLAY_STATUS,
        playing
    }
}