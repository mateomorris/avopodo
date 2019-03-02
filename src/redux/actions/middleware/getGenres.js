export function getGenres () {
    return dispatch => {

        return fetch(`https://listennotes.p.mashape.com/api/v1/genres`, 
        {
            headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
            .then((response) => {
                // console.log(response.headers) // See quota consumption
                return response.json()
            })
            .then((responseJson) => {
                return responseJson
            })
            .then()
            .catch((error) =>{
                console.log('error fetching genres');
                // console.error(error);
            });
    }
}