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

            console.log('searched for ', `https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${genreId}&page=${page}`)

            if (responseJson.has_next) {
              // return responseJson.channels.map((show) => {
              //   show.description = show.description.trim().replace(/(<([^>]+)>)/ig,"")
              //   return show
              // });
              return {
                nextGenrePage : responseJson.next_page_number,
                moreShows: responseJson.channels.map((show) => {
                  show.description = show.description.trim().replace(/(<([^>]+)>)/ig,"")
                  return show
                })
              }
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