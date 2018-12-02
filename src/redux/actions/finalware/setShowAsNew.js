import { SET_SHOW_AS_NEW } from '../actionTypes'

export function setShowAsNew(showId, setNew = true) {
    return {
        type: SET_SHOW_AS_NEW,
        showId,
        setNew
    }
}   