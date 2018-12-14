import { AppRegistry, Platform, Alert } from 'react-native';
import { setupPlayer, setCurrentTrackPosition, updatePlayQueue, markEpisodeAsPlayed, resetQueue } from '../finalware'
import { playNextItemInQueue, syncPlayQueue } from '../middleware'
import TrackPlayer, {PlayerStore} from 'react-native-track-player';

export function startPlayer() {
    return (dispatch, getState) => {
        
        let state = getState();
        let nowPlayingEpisodeId = state.active ? state.nowPlaying.id : false;

            dispatch(setupPlayer())

            let storedTrackPosition = state.episodePlaybackPositions[nowPlayingEpisodeId];

            if (storedTrackPosition) {
                TrackPlayer.getPosition().then((actualPosition) => {
                    console.log(actualPosition, storedTrackPosition)
                    if (actualPosition < storedTrackPosition) {
                        console.log('Playback position needs to be adjusted')
                        console.log(nowPlayingEpisodeId)
                        dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
                    }
                })            
            }

            Platform.OS == 'ios' && 
            TrackPlayer.registerEventHandler(async (data) => {

                if (data.type === 'playback-track-changed') {
                    dispatch(syncPlayQueue()) 

                    let { nowPlaying, episodePlaybackPositions } = getState(); // Get updated values

                    if (episodePlaybackPositions[data.track] >= nowPlaying.duration - 120) { // Episode finished
                        dispatch(markEpisodeAsPlayed(data.track)) 
                    } else {
                        console.log('NOT marking episode as played')
                        // TODO: Add to 'Unfinished'
                    }
                } 
                else if(data.type == 'remote-seek') {
                    console.log('Remote seek')
                    TrackPlayer.seekTo(200)
                } else if(data.type == 'remote-play') {
                    console.log('Remote play')
                    TrackPlayer.play()
                } else if(data.type == 'remote-pause') {
                    console.log('Remote pause')
                    TrackPlayer.pause()
                } else if(data.type == 'remote-next') {
                    console.log('Remote next')
                    TrackPlayer.skipToNext();
                //   dispatch(playNextItemInQueue())
                } else if(data.type == 'remote-previous') {
                    console.log('Remote previous')
                    TrackPlayer.skipToPrevious()
                } else if (data.type === 'playback-state') {
                    // PlayerStore.playbackState = data.state;


                    // if (data.state == 'paused' && storedTrackPosition) {
                    //     console.log('Setting current track position')
                    //     dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
                    // }
                } else if (data.type == 'playback-queue-ended') {
                    console.log('Finished queue')
                    dispatch(markEpisodeAsPlayed(data.track)) 
                    dispatch(resetQueue())
                } else {
                    console.log(`No matching condition for `, data)
                }
            });
              
    }
}