import { SET_ARTWORK_COLOR } from '../actionTypes'

export function setArtworkColor(id, color) {
    return {
        type: SET_ARTWORK_COLOR,
        id,
        color
    }
}