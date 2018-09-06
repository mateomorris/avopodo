import { fetchRecentReleaseDate } from './index'

export function checkIfNewEpisode (show) {
    return (dispatch, getState) => {
        return dispatch(fetchRecentReleaseDate(show.itunesId)).then((releaseDateInMs) => {

            let state = getState().reducer

            let thisShow = state.subscribedShows.find((subscribedShow) => {
                return subscribedShow.id == show.id
            })


            let latestStoredEpisodePubDate = thisShow.hasOwnProperty('episodeList') ? thisShow.episodeList[0].publishDate : null

            return {
                show,
                newEpisodeAvailable : releaseDateInMs > latestStoredEpisodePubDate ? true : false
            }
        })
    }
}