import { UNSUBSCRIBE_FROM_SHOW } from '../actionTypes'

export function unsubscribeFromShow(id) {
    return {
        type: UNSUBSCRIBE_FROM_SHOW,
        id
    }
}