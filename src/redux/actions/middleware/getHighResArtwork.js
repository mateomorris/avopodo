export function getHighResArtwork (id) {
    return dispatch => {
        return fetch(`https://itunes.apple.com/lookup?id=${id}`)
        .then((response) => response.json())
        .then((responseJson) => {

            if (responseJson.results) {
                const artwork = responseJson.results[0].artworkUrl600
                return artwork
            } 
  
        })
        .catch((error) =>{
          console.log('error fetching high res artwork');
          console.error(error);
        });
    }
}