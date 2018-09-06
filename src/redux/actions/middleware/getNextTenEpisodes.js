export function getNextTenEpisodes (id, nextPublishDate) {
    return dispatch => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/podcasts/${id}/?next_episode_pub_date=${nextPublishDate}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((responseJson) => {
            let episodeList = responseJson.episodes.map((episode) => {
                let { audio, description, id, title } = episode
                return {
                    audio,
                    description,
                    duration : episode.audio_length,
                    id,
                    publishDate : episode.pub_date_ms,
                    title
                }
            })
      
            return episodeList;
      
          })
          .then()
          .catch((error) =>{
            console.log('fetching error');
            console.error(error);
          });
    }
  }