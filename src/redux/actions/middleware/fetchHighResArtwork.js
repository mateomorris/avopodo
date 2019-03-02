import { setHighResArtwork } from '../finalware'

export function fetchHighResArtwork(id, itunesId) {
    return dispatch => {
        return fetch(`https://itunes.apple.com/lookup?id=${itunesId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          const artwork = responseJson.results[0].artworkUrl600
          dispatch(setHighResArtwork(id, artwork))
        })
        .catch((error) =>{
          console.log('Error fetching high res artwork');
          // console.error(error);
        });
    }
}