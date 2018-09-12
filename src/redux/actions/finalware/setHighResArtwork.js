import { SET_HIGH_RES_ARTWORK } from '../actionTypes'

export function setHighResArtwork(id, artwork) {
    return {
        type: SET_HIGH_RES_ARTWORK,
        id,
        highResArtwork: artwork
    }
}