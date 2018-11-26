export function getShowDetails (showId) {
    return dispatch => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/podcasts/${showId}/`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)

            return {
                id: responseJson.id, 
                title: responseJson.title,
                image: responseJson.image,
                imageHighRes: responseJson.image, 
                description: responseJson.description.trim().replace(/(<([^>]+)>)/ig,""), // strip html,
                publisher: responseJson.publisher_original,
                itunesId: responseJson.itunes_id
            }

          })
          .catch((error) =>{
            console.error('Unable to fetch show details', error);
          });
    }
  }