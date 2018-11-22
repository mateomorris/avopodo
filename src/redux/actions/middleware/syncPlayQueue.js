import { updatePlayQueue, updateNowPlaying, updatePlaylistEpisodeList } from '../finalware'
import TrackPlayer, {PlayerStore} from 'react-native-track-player';

export function syncPlayQueue() {
    return (dispatch, getState) => {

        const state = getState()

        TrackPlayer.getCurrentTrack().then((currentTrackId) => {

            if (currentTrackId && currentTrackId !== state.nowPlaying.id) {

                let indexOfCurrentTrack = state.playQueue.findIndex((episode) => {
                    return episode.id == currentTrackId
                })

                let updatedPlayQueue = state.playQueue.slice(indexOfCurrentTrack)

                dispatch(updatePlayQueue(updatedPlayQueue))
                dispatch(updateNowPlaying(updatedPlayQueue[0]))
                dispatch(updatePlaylistEpisodeList(state.activePlaylist.id, updatedPlayQueue))

            } else if (!currentTrackId) {
                console.log('NO TRACK AVAILABLE')
            } else {
                console.log('PLAY QUEUE IS CURRENT')
            }
        })

        // dispatch(updatePlayQueue())
    }
}