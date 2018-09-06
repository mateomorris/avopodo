import { SUBSCRIBE_TO_SHOW } from '../actionTypes'

export function subscribeToShow(show, artworkUrl = '') {
    return {
      type: SUBSCRIBE_TO_SHOW,
      id : show.id,
      title : show.title,
      image : show.image,
      description : show.description,
      publisher : show.publisher,
      imageHighRes: artworkUrl,
      itunesId : show.itunesId,
      color: null
    }
}