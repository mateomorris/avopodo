import TrackPlayer from 'react-native-track-player';

import { 
    toggleBufferingStatus, 
    playEpisode,  
    moveQueueItemToFront
} from '../finalware'

export function addToQueueFrontAndPlayEpisode(show, episode) {
    return (dispatch, getState) => {
        console.log(show)
        let state = getState().reducer;
        // dispatch(addEpisodeToQueue(show, episode))
        dispatch(toggleBufferingStatus(true))
        this.interval = setInterval(() => { 
            TrackPlayer.getBufferedPosition().then((buffered) => {
                TrackPlayer.getPosition().then((position) => {
                if (buffered > position) {
                  clearInterval(this.interval);
                  dispatch(toggleBufferingStatus(false))
                } else {
                  console.log('Buffering')
                }
              })
            })
        }, 500);

        // Check if episode is already at the top of the queue
        if (state.playQueue.length == 0) { // Play Queue is empty
            dispatch(playEpisode(show, episode));
        } else if (state.playQueue[0].id != episode.id) { // Episode is not at the top of the queue
            // Check if item is already in queue, move it to the front
            state.playQueue.forEach((item, index) => {
                if (item.id == episode.id) {
                    console.log(`Already in queue as item ${index}`);
                    dispatch(moveQueueItemToFront(index));
                }
            });
            dispatch(playEpisode(show, episode))
        } else {
            // Do nothing
        }
    }
}