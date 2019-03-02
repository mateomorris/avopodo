export function getBestShowsForGenre (genreId) {
    return dispatch => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${genreId}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            return responseJson;
          })
          .then()
          .catch((error) =>{
            // console.error('Error fetching best shows for genre', error);
          });
    }
}