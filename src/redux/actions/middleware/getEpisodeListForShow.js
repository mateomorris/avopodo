export function getEpisodeListForShow(showId, ageLimit = 0, nextEpisodeDate = new Date().getTime() ){
    return ( dispatch, getState ) => {

        return fetch(`https://listennotes.p.mashape.com/api/v1/podcasts/${showId}/?next_episode_pub_date=${nextEpisodeDate}`,
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

            // Cut the list off at the point where an episode pub_date_ms is smaller than episodeRange        
            let episodeList = show.episodes.map((episode) => {
                return {
                    id: episode.id,
                    title: episode.title,
                    description: episode.description.replace(/(<([^>]+)>)/ig,""), // strip html
                    duration: episode.audio_length, 
                    publishDate: episode.pub_date_ms,
                    audio: episode.audio,
                    showId: show.id,
                    showTitle: show.title,
                    showImage: show.image,
                    showDescription : show.description, 
                    showPublisher : show.publisher,
                    showWebsite: show.website,
                    showColor
                };
            }).filter((episode) => {
                return episode.publishDate > ageLimit ? episode : null
            });

            // // If last episode is within release range, keep fetching until the limit is reached (or no more episodes are left)
            // // Works, but too API-heavy to implement right now
            // if (episodeList.length == 10 && episodeList[9].publishDate > ageLimit) {
            //     console.log(showId, ageLimit, episodeList[9].publishDate)
            //     dispatch(getEpisodeListForShow(showId, ageLimit, episodeList[9].publishDate)).then((episodes) => {
            //         episodeList = [...episodeList, ...episodes] 
            //         console.log(episodeList)
            //     })
            // } else {
            //     return episodeList;
            // }

            // If last episode is within release range, too bad
            if (episodeList.length == 10 && episodeList[9].publishDate > ageLimit) {
                return {
                    complete: false,
                    episodeList
                };
            } else {
                return {
                    complete: true,
                    episodeList
                };
            }

          })
          .catch((error) =>{
            console.log('Error fetching episode list');
            console.error(error);
          });
    }
  }