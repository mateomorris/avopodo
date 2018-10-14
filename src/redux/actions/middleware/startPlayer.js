import { AppRegistry } from 'react-native';
import { setupPlayer, setCurrentTrackPosition } from '../finalware'
import TrackPlayer, {PlayerStore} from 'react-native-track-player';

export function startPlayer() {
    return (dispatch, getState) => {

        console.log(getState())
        
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

            // TrackPlayer.registerEventHandler(async (data) => {
            //     console.log(data)
            //     if (data.type === 'playback-track-changed') {
            //         console.log('playback-track-changed')
            //         // dispatch(playNextItemInQueue(1))
            //     } 
            //     else if(data.type == 'remote-seek') {
            //         console.log('Remote seek')
            //         TrackPlayer.seekTo(200)
            //     } else if(data.type == 'remote-play') {
            //         console.log('Remote play')
            //         TrackPlayer.play()
            //     } else if(data.type == 'remote-pause') {
            //         console.log('Remote pause')
            //         TrackPlayer.pause()
            //     } else if(data.type == 'remote-next') {
            //         console.log('Remote next')
            //         TrackPlayer.skipToNext();
            //     //   dispatch(playNextItemInQueue())
            //     } else if(data.type == 'remote-previous') {
            //         console.log('Remote previous')
            //         TrackPlayer.skipToPrevious()
            //     } else if (data.type === 'playback-state') {
            //         console.log('Playback state', data, nowPlayingEpisodeId)
            //         // PlayerStore.playbackState = data.state;


            //         // if (data.state == 'paused' && storedTrackPosition) {
            //         //     console.log('Setting current track position')
            //         //     dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
            //         // }
            //     } else {
            //         console.log(`No matching condition for `, data)
            //     }
            // });
              
    }
}