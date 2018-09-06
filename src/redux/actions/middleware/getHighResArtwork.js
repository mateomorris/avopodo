export function getHighResArtwork (id) {
    return dispatch => {
        return fetch(`https://itunes.apple.com/lookup?id=${id}`)
        .then((response) => response.json())
        .then((responseJson) => {

            console.log(id)

            if (responseJson.results) {
                const artwork = responseJson.results[0].artworkUrl600
                return artwork
            } 
  
        })
        .catch((error) =>{
          console.log('fetching error');
          console.error(error);
        });
    }
}