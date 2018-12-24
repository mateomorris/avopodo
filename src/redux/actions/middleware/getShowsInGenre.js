export function getShowsInGenre (genreId, page = 1) {
    return dispatch => {
        return fetch(`https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${genreId}&page=${page}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            responseJson.channels.map((show) => {
              show.description = show.description.trim().replace(/(<([^>]+)>)/ig,"")
              return show
            })

            if (responseJson.has_next) {
              return responseJson.channels;
            } else {
              return false
            }
          })
          .catch((error) =>{
            console.error('Error getting shows in genre');
            console.error(error);
          });
    }
}