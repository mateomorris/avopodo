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
            return Promise.all(compiledEpisodeList).then((episodeLists) => {
                let newestEpisodesList = episodeLists.filter(({episodeList}) => {
                    if (episodeList) {
                        return episodeList
                    } 
                }).map(({episodeList}) => {
                    return episodeList[0] // Grab the most recent episode
                }).sort((a, b) => {
                    return b.publishDate - a.publishDate // Sort the whole list from newest to oldest
                })

                dispatch(setNewestFromSubscribed(newestEpisodesList))

                return true // return success
            })

        }, (reason) => {
            return false
            console.log('Episode List Fetch Failed', reason)
        })

    }
}