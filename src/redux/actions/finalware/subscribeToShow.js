import { SUBSCRIBE_TO_SHOW } from '../actionTypes'

export function subscribeToShow(show) {
    return {
      type: SUBSCRIBE_TO_SHOW,
      show : {
        ...show,
        id : show.id,
        title : show.title,
        image : show.thumbnail,
        description : show.description.trim().replace(/<(?:.|\n)*?>/gm, ''), // strip html,
        publisher : show.publisher,
        imageHighRes: show.image || show.imageHighRes,
        itunesId : show.itunesId,
        color: null
      }
    }
}