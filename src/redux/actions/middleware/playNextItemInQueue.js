import { playQueueItem } from '../finalware'

export function playNextItemInQueue(index) {
    return (dispatch, getState) => {
        let state = getState();

        if (index) {
            dispatch(playQueueItem(index))
        } else {

            let { id } = state.nowPlaying
            let nextQueueItem = state.playQueue.findIndex((item) => {
                return item.id == id
            })
            
            dispatch(playQueueItem(nextQueueItem))
        }


        // setCurrentTrackPosition(state.playQueue[index].id, true)
    }
}