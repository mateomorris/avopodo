export function getSearchResults (term, type = 'podcast') {
    return dispatch => {
        term = term.toLowerCase().replace(/ /g, "+");

        return fetch(`https://listennotes.p.mashape.com/api/v1/search?q=${term}&type=${type}`, 
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
            console.log(responseJson)
            let searchResults = responseJson.results.map((item) => {
                return {
                    id: item.id, 
                    title: item.title_original,
                    image: item.image, 
                    description: item.description_original.trim().replace(/(<([^>]+)>)/ig,""), // strip html,
                    publisher: item.publisher_original,
                    itunesId: item.itunes_id
                }
            });
        
            return searchResults;
        
            })
            .then()
            .catch((error) =>{
                console.log('Error fetching search results');
                // console.error(error);
            });
    }
}