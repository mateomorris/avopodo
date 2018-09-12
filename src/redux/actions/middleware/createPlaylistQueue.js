import { getEpisodeListForShow } from './index'

export function createPlaylistQueue({ episodeLength, playFirst, releaseRange, shows }) {
    return dispatch => {

            let episodeLengthNumeric = {
                'ten-minutes' : 600,
                'thirty-minutes' : 1800,
                'an-hour' : 3600,
                'an-eternity' : Infinity
            }[episodeLength]

            var oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            let releaseRangeNumberic = {
                'week' : () => {
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return oneWeekAgo.getTime(); 
                },
                'two-weeks' : () => {
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);
                    return oneWeekAgo.getTime(); 
                },
                'month' : () => {
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);
                    return oneWeekAgo.getTime(); 
                },
                'eternity' : () => {
                    return 0
                }
            }[releaseRange]()


            let episodeListPromises = shows.map((showId) => {
                return dispatch(getEpisodeListForShow(showId, releaseRangeNumberic))
            })

            // Fetch all episodes from the show list, then narrow it down and send it back
            return Promise.all(episodeListPromises).then((values) => {

                // Sort by release date, remove episodes that are too long
                let episodeList = [].concat.apply([], values.map((showEpisodeList) => {
                    return showEpisodeList.episodeList
                })).sort((a, b) => {
                    return playFirst == 'newest' ? b.publishDate - a.publishDate :  a.publishDate - b.publishDate 
                }).filter((episode) => {
                    return episode.duration < episodeLengthNumeric
                })

                if (episodeList.length > 0) {

                    let episodeListDuration = episodeList.map((episode) => {
                        return episode.duration
                    }).reduce((accumulator, currentValue) => {
                        return accumulator + currentValue
                    })

                    return {
                        episodeList,
                        episodeListDuration
                    }

                } else {
                    console.log('No episodes found')
                    return false
                }



            }, reason => console.log('Episode List Fetch Failed', reason))

    }
}