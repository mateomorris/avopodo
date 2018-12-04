import { SUBSCRIBE_TO_SHOW } from '../actionTypes'

export function subscribeToShow(show) {
    return {
      type: SUBSCRIBE_TO_SHOW,
      id : show.id,
      title : show.title,
      image : show.thumbnail,
      description : show.description,
      publisher : show.publisher,
      imageHighRes: show.image || show.imageHighRes,
      itunesId : show.itunesId,
      color: null
    }
}