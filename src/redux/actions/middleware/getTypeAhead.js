export function getTypeAhead (text) {
    return dispatch => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/typeahead?q=${text}&show_genres=0&show_podcasts=1`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            return responseJson.podcasts
          })
          .catch((error) =>{
            console.log('Error fetching typeAhead');
          });
    }
  }