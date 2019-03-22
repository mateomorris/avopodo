import { subscribeToMultipleShows } from '../finalware'
import { fetchArtworkColor, getDetailsAndSubscribe } from '../middleware'

export function importShows (showUrls) {
    return (dispatch, getState) => {

        let state = getState()

        let iterations = Math.ceil(showUrls.length / 10) // (43 / 10).ceil => 5 => Go 5 times 

        Promise.all((() => (
            Array(iterations).fill().map((_, index) => {
                let start = index * 10
                let end = start + 9
                return fetchShows(showUrls.slice(start,end))
            })
        ))()).then((result) => {
            let shows = result.flat()
            subscribeToShows(shows);
        })

        function subscribeToShows(shows) {
            shows.forEach(show => {
                if (state.subscribedShows.filter(subbedShow => subbedShow.id == show.id).length > 0) {

                } else {
                    dispatch(getDetailsAndSubscribe(show))
                }
            })
        }

        // function formatShow (show) {
        //     return {
        //         id : show.id,
        //         title : show.title,
        //         image : show.thumbnail,
        //         description : show.description,
        //         publisher : show.publisher,
        //         imageHighRes: show.image,
        //         itunesId : show.itunes_id,
        //         color: null
        //     }
        // }


        async function fetchShows(RSSUrls) {
            let UrlsAsString = RSSUrls.join(',');

            return await fetch(`https://listennotes.p.rapidapi.com/api/v1/podcasts`, 
            {
                method: 'POST',
                headers: {
                    'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `rsses=${UrlsAsString}`
            })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson.podcasts
                // return responseJson.podcasts
            })
            .catch((error) =>{
                console.log(error);
            });
        }
    }
  }