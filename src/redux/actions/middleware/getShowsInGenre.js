export function getShowsInGenre (genreId) {
    return dispatch => {
        return fetch(`https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${genreId}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            responseJson.channels.map((show) => {
              console.log(show)
              show.description = show.description.trim().replace(/(<([^>]+)>)/ig,"")
              console.log(show)
              return show
            })
            return responseJson.channels;
          })
          .catch((error) =>{
            console.log('fetching error');
            console.error(error);
          });
    }
}