import { checkIfNewEpisode, getEpisodeListForShow } from './index'
import { setNewestFromSubscribed } from '../finalware'

export function getNewestFromSubscribed() {

    return ( dispatch, getState) => {

        let { subscribedShows } = getState().reducer

        let checkIfNewEpisodePromises = subscribedShows.map((show) => {
            return dispatch(checkIfNewEpisode(show))
        })

        // Check each subscribed show for a new episode
        Promise.all(checkIfNewEpisodePromises).then((values) => {

            // Collect Promises for each show that needs to fetch a fresh episode list
            let compiledEpisodeList = values.map((response) => {
                if (response.newEpisodeAvailable) { 
                    return dispatch(getEpisodeListForShow(response.show.id))
                } else {
                    return response.show.episodeList
                }
            })

            // Fetch necessary episode list (return stored list for the rest)
            Promise.all(compiledEpisodeList).then((episodeLists) => {
                let newestEpisodesList = episodeLists.map((episodeList) => {
                    return episodeList[0]
                }).sort((a, b) => {
                    return b.publishDate - a.publishDate
                })
                dispatch(setNewestFromSubscribed(newestEpisodesList));
            })

        }, reason => console.log('Episode List Fetch Failed', reason))

    }
}