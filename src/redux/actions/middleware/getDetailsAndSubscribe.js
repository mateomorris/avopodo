import { subscribeToShow, setEpisodeListForShow } from '../finalware'
import { fetchArtworkColor, fetchHighResArtwork, getEpisodeListForShow, getNewestFromSubscribed } from './index'

export function getDetailsAndSubscribe(show) {
    return dispatch => {
        dispatch(subscribeToShow(show)),
        dispatch(fetchArtworkColor(show.id, show.image)),
        dispatch(fetchHighResArtwork(show.id, show.itunesId)),
        dispatch(getEpisodeListForShow(show.id)).then(({episodeList}) => {
            dispatch(setEpisodeListForShow(show.id, episodeList))
            dispatch(getNewestFromSubscribed()) 
        })
    }
}