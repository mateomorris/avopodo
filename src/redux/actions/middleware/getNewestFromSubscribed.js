import { checkIfNewEpisode, getEpisodeListForShow } from './index'
import { setNewestFromSubscribed } from '../finalware'

export function getNewestFromSubscribed() {

    return ( dispatch, getState) => {

        let { subscribedShows } = getState()

        console.log(getState())

        let checkIfNewEpisodePromises = subscribedShows.map((show) => {
            return dispatch(checkIfNewEpisode(show))
        })

        // Check each subscribed show for a new episode
        return Promise.all(checkIfNewEpisodePromises).then((values) => {

            // Collect Promises for each show that needs to fetch a fresh episode list
            let compiledEpisodeList = values.map((response) => {
                if (response.newEpisodeAvailable) { 
                    return dispatch(getEpisodeListForShow(response.show.id))
                } else {
                    return response.show.episodeList
                }
            })

            // Fetch necessary episode list (return stored list for the rest), then sort them by date
            Promise.all(compiledEpisodeList).then((episodeLists) => {
                let newestEpisodesList = episodeLists.map((episodeList) => {
                    return episodeList[0]
                }).sort((a, b) => {
                    return b.publishDate - a.publishDate
                })
                dispatch(setNewestFromSubscribed(newestEpisodesList));
            })

            return true

        }, (reason) => {
            return false
            console.log('Episode List Fetch Failed', reason)
        })

    }
}