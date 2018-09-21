import { syncQueue, syncPlayStatus } from '../finalware'
import TrackPlayer, {PlayerStore} from 'react-native-track-player';

export function syncPlayer() {
    return (dispatch, getState) => {

        const state = getState().reducer

        TrackPlayer.getState().then((theNewState) => {
            console.log(theNewState)
            if (theNewState == 'playing' && !state.playing) {
                dispatch(syncPlayStatus(true))
            } else if (theNewState == 'paused' && state.playing) {
                dispatch(syncPlayStatus(false))
            }
        })

        TrackPlayer.getCurrentTrack().then((track) => {
            if (state.nowPlaying.id != track) {
                console.log('Track needs to be updated')
                let newQueue = state.playQueue.slice(state.playQueue.findIndex(item => item.id == track))
                dispatch(syncQueue(newQueue))
            } else {
                console.log('Track doesnt need to be updated')
                // return state
                return false
            }
        })
    }
}