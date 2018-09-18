import { setupPlayer, setCurrentTrackPosition } from '../finalware'
import TrackPlayer, {PlayerStore} from 'react-native-track-player';

export function startPlayer() {
    return (dispatch, getState) => {
        let state = getState().reducer;
        let nowPlayingEpisodeId = state.active ? state.nowPlaying.id : false;

            // TrackPlayer.reset();
            TrackPlayer.setupPlayer().then(()=>{
                TrackPlayer.updateOptions({
                    stopWithApp: false,
                    capabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_PAUSE,
                        TrackPlayer.CAPABILITY_STOP,
                        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
                    ]
                });
        });

            TrackPlayer.registerEventHandler(async (data) => {

                if (data.type === 'playback-track-changed') {
                    console.log('playback-track-changed')
                    // dispatch(playNextItemInQueue(1))
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
                    console.log('Playback state', data, nowPlayingEpisodeId)
                    // PlayerStore.playbackState = data.state;
                    let storedTrackPosition = state.episodePlaybackPositions[nowPlayingEpisodeId];

                    if (data.state == 'playing' && storedTrackPosition) {
                        console.log('Done buffering')

                        TrackPlayer.getPosition().then((actualPosition) => {
                            console.log(actualPosition, storedTrackPosition)
                            if (actualPosition < storedTrackPosition) {
                                console.log('Playback position needs to be adjusted')
                                dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
                            }
                        })

                    }

                    // if (data.state == 'paused' && storedTrackPosition) {
                    //     console.log('Setting current track position')
                    //     dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
                    // }
                } else {
                    console.log(`No matching condition for `, data)
                }



                // if (data.type === 'playback-track-changed') {
                //     console.log('playback-track-changed')
                //   if (data.nextTrack) {
                //     console.log('Playing next item in queue')
                //     // dispatch(playNextItemInQueue())
                //     TrackPlayer.skipToNext();
                //   }
                // } 
                // else if(data.type == 'remote-seek') {
                //     console.log('Remote seek')
                //     TrackPlayer.seekTo(200)
                // } else if(data.type == 'remote-play') {
                //     console.log('Remote play')
                //   TrackPlayer.play()
                // } else if(data.type == 'remote-pause') {
                //     console.log('Remote pause')
                //   TrackPlayer.pause()
                // } else if(data.type == 'remote-next') {
                //     console.log('Remote next')
                //     TrackPlayer.skipToNext();
                // //   dispatch(playNextItemInQueue())
                // } else if(data.type == 'remote-previous') {
                //     console.log('Remote previous')
                //   TrackPlayer.skipToPrevious()
                // } else if (data.type === 'playback-state') {
                //     console.log('Playback state')
                //   PlayerStore.playbackState = data.state;
                // } else {
                //     console.log(`No matching condition for ${data}`)
                // }
            });
              
        dispatch(setupPlayer())
    }
}