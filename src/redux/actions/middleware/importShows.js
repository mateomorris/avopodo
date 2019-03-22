import { subscribeToMultipleShows } from '../finalware'
import { fetchArtworkColor, getDetailsAndSubscribe } from '../middleware'

export function importShows (showUrls) {
    return (dispatch, getState) => {

        let iterations = Math.ceil(showUrls.length / 10) // (43 / 10).ceil => 5 => Go 5 times 

        Promise.all((() => (
            Array(iterations).fill().map((_, index) => {
                let start = index * 10
                let end = start + 9
                return fetchShows(showUrls.slice(start,end))
            })
        ))()).then((result) => {
            let shows = result.flat()
            console.log('the good stuff', shows)
            subscribeToShows(shows);
        })

        function subscribeToShows(shows) {
            let formattedShows = shows.map(show => {
                return formatShow(show)
            } )
            // dispatch(subscribeToMultipleShows(formattedShows))
            shows.forEach(show => {
                dispatch(getDetailsAndSubscribe(show))
                // dispatch(fetchArtworkColor(show.id, show.image))
            })

        }

        function formatShow (show) {
            return {
                id : show.id,
                title : show.title,
                image : show.thumbnail,
                description : show.description,
                publisher : show.publisher,
                imageHighRes: show.image,
                itunesId : show.itunes_id,
                color: null
            }
        }


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
                console.log(responseJson.podcasts)
                return responseJson.podcasts
                // return responseJson.podcasts
            })
            .catch((error) =>{
                console.log(error);
            });
        }
    }
  }