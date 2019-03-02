export function getNextTenEpisodes (id, nextPublishDate) {
    return (dispatch, getState) => {
  
        return fetch(`https://listennotes.p.mashape.com/api/v1/podcasts/${id}/?next_episode_pub_date=${nextPublishDate}`, 
        {
          headers: {
            'X-Mashape-Key' : 'xGqxpKDt1rmshDkDCHU7rUGMqWxqp1oEyY5jsnYTD6AGzqmQlb',
            'Accept': 'application/json',
        }})
          .then((response) => response.json())
          .then((show) => {

            let showColor = getState().subscribedShows.find((subscribedShow) => {
                return subscribedShow.id == show.id
            }).color

            let episodeList = show.episodes.filter((episode) => {
                return episode.audio ? episode : null // ensure audio exists
            }).map((episode) => {
                return {
                    id: episode.id,
                    title: episode.title,
                    description: episode.description.replace(/(<([^>]+)>)/ig,""), // strip html
                    duration: episode.audio_length, 
                    publishDate: episode.pub_date_ms,
                    audio: episode.audio.replace('http://', 'https://'), // Doesn't load if the url isn't safe
                    showId: show.id,
                    showTitle: show.title,
                    showImage: show.image,
                    showDescription : show.description, 
                    showPublisher : show.publisher,
                    showWebsite: show.website,
                    showColor
                };
            })

            return episodeList
      
          })
          .then()
          .catch((error) =>{
            console.log('error fetching next ten episodes');
            // console.error(error);
          });
    }
  }