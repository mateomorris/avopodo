import { playQueueItem } from '../finalware'

export function playNextItemInQueue(index) {
    return (dispatch, getState) => {
        let state = getState().reducer;

        dispatch(playQueueItem(index))

        // setCurrentTrackPosition(state.playQueue[index].id, true)
    }
}