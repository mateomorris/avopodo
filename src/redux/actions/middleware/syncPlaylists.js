import { SYNC_PLAYLISTS } from '../actionTypes'
import { validatePlaylistQueue, checkIfNewEpisode, createPlaylistQueue } from './index'
import { setPlaylistQueue } from '../finalware'

export function syncPlaylists(playing) {
    return (dispatch, getState) => {
        let state = getState()

        state.playlists.forEach((playlist) => {
            console.log(playlist)
            let { episodeQueue } = playlist
            let { episodeList } = episodeQueue

            let releaseDateInMS = {
                'week' : Date.now() + -7*24*3600*1000, // date 7 days ago in milliseconds,
                'two-weeks' : Date.now() + -14*24*3600*1000, // date 14 days ago in milliseconds,
                'month' : Date.now() + -30*24*3600*1000, // date 30 days ago in milliseconds,
                'eternity' : 0
            }[playlist.released]

            let d = new Date();
            let nowInSeconds = d.getTime();

            // First: Get rid of any out of date episodes
            const newQueue = episodeList.filter((episode) => {
                return episode.publishDate > releaseDateInMS
            })

            if (episodeList.length !== newQueue.length && episodeList.length !== 0) {
                
                console.log(newQueue, newQueue.length)

                let queueDuration = 0;

                if (newQueue.length > 0) {
                    queueDuration = newQueue.map((episode) => {
                        return episode.duration
                    }).reduce((accumulator, currentValue) => {
                        return accumulator + currentValue
                    })
                }
                
                console.log(newQueue, queueDuration)
                dispatch(setPlaylistQueue(playlist.id, newQueue, queueDuration))
            }

            // let showsInPlaylist = playlist.shows.map((show) => {
            //     return show == state.subscribedShows.find(subscribedShow => subscribedShow.id == show)
            // })

            let playlistShowsWithData = state.subscribedShows.filter((subscribedShow) => {
                return playlist.shows.find((playlistShowId) => {
                    return playlistShowId == subscribedShow.id
                })
            })


            // // Second: Go through each show in the playlist and compare the newest episode in the queue by that show to the newest stored episode of the show
            // 
            playlistShowsWithData.forEach((show) => {

                let showEpisodesInQueue = newQueue.filter((episode) => {
                    return episode.showId == show.id
                }).sort((a, b) => {
                    return b.publishDate - a.publishDate
                })

                if (showEpisodesInQueue.length > 0 && show.episodeList) {

                    if (showEpisodesInQueue[0] && showEpisodesInQueue[0].id !== show.episodeList[0].id) {
                        let length = {
                            'ten-minutes' : 600,
                            'thirty-minutes' : 1800,
                            'an-hour' : 3600,
                            'an-eternity' : 9999999999
                        }[playlist.length]

                        if (show.episodeList.find((episode) => {
                            if (episode.duration >= length) {
                                return episode
                            }
                        })) {
                            console.log('FOUND AN OUT OF DATE EPISODE IN ', show)
                            dispatch(createPlaylistQueue({ 
                                episodeLength : playlist.length, 
                                playFirst : playlist.playFirst, 
                                releaseRange : playlist.released, 
                                shows : playlist.shows
                                })).then((newPlaylistQueue) => {

                                    let newQueueDuration = newQueue.map((episode) => {
                                        return episode.duration
                                    }).reduce((accumulator, currentValue) => {
                                        return accumulator + currentValue
                                    })
                                    console.log(newPlaylistQueue, newQueueDuration)
                                    dispatch(setPlaylistQueue(playlist.id, newPlaylistQueue, newQueueDuration))
                            })
                        }

                        // if (length >= show.episodeList[0].duration) {
                        //     console.log('Latest episode in show should be in list', showEpisodesInQueue[0], show.episodeList[0])
                        //     console.log(playlist)
                        //     dispatch(createPlaylistQueue({ 
                        //         episodeLength : playlist.length, 
                        //         playFirst : playlist.playFirst, 
                        //         releaseRange : playlist.released, 
                        //         shows : playlist.shows
                        //         })).then((newPlaylistQueue) => {
                        //             console.log(newPlaylistQueue.episodeList, newQueue)

                        //             let newQueueDuration = newQueue.map((episode) => {
                        //                 return episode.duration
                        //             }).reduce((accumulator, currentValue) => {
                        //                 return accumulator + currentValue
                        //             })

                        //             dispatch(setPlaylistQueue(playlist.id, newPlaylistQueue, newQueueDuration))
                        //     })
                        // }

                    } 
                }

            })



            // let checkIfNewEpisodePromises = playlistShowsWithData.map((show) => {
            //     return dispatch(checkIfNewEpisode(show))
            // })

            // // Check each subscribed show for a new episode
            // return Promise.all(checkIfNewEpisodePromises).then((values) => {

            //     console.log(values)
            //     values.forEach((value) => {
            //         if (newEpisodeAvailable) {

            //         }
            //     })

            //     return true

            // }, (reason) => {
            //     return false
            //     console.log('Episode List Fetch Failed', reason)
            // })



            // // Second: See if any of the shows have a new episode available
            // let checkIfNewEpisodePromises = subscribedShows.map((show) => {
            //     return dispatch(checkIfNewEpisode(show))
            // })

            // // Check each subscribed show for a new episode
            // return Promise.all(checkIfNewEpisodePromises).then((values) => {

            //     // Collect Promises for each show that needs to fetch a fresh episode list
            //     let compiledEpisodeList = values.map((response) => {
            //         if (response.newEpisodeAvailable) { 
            //             return dispatch(getEpisodeListForShow(response.show.id))
            //         } else {
            //             return response.show.episodeList
            //         }
            //     })

            //     // Fetch necessary episode list (return stored list for the rest), then sort them by date
            //     Promise.all(compiledEpisodeList).then((episodeLists) => {
            //         let newestEpisodesList = episodeLists.map((episodeList) => {
            //             return episodeList[0]
            //         }).sort((a, b) => {
            //             return b.publishDate - a.publishDate
            //         })
            //         dispatch(setNewestFromSubscribed(newestEpisodesList));
            //     })

            //     return true

            // }, (reason) => {
            //     return false
            //     console.log('Episode List Fetch Failed', reason)
            // })



            // dispatch(getPlaylistQueue(playlist)).then((result) => {
            //     console.log(result)
            // })
        })
    }
}