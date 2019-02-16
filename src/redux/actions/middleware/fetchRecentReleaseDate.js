export function fetchRecentReleaseDate (itunesId) {
    return dispatch => {
        return fetch(`https://itunes.apple.com/lookup?id=${itunesId}`)
        .then((response) => response.json())
        .then((responseJson) => {

            let releaseDate = responseJson.results ? responseJson.results[0].releaseDate : null;
            let myDate = new Date(releaseDate);
            let dateInMs = myDate.getTime();

            return dateInMs

        })
        .catch((error) =>{
          console.log('Error fetching recent release date');
        });
    }
}