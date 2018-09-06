export function getPodcastGenres () {
    return dispatch => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/genres`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            let topLevelGenres = responseJson.genres.filter((category) => {
                return category.parent_id == 67
            })
            console.log(topLevelGenres)

            return topLevelGenres;
          })
          .then()
          .catch((error) =>{
            console.log('fetching error');
            console.error(error);
          });
    }
  }