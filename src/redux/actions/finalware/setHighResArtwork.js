import { SET_HIGH_RES_ARTWORK } from '../actionTypes'

export function setHighResArtwork(id, artwork) {
    console.log('########')
    console.log(artwork)
    console.log(SET_HIGH_RES_ARTWORK)
    return {
        type: SET_HIGH_RES_ARTWORK,
        id,
        highResArtwork: artwork
    }
}