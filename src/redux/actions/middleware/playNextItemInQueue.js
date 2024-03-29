import { playQueueItem } from '../finalware'

export function playNextItemInQueue(index) {
    return (dispatch, getState) => {
        let state = getState();

        if (index) {
            console.log('Playing specific queue item', index)
            dispatch(playQueueItem(index))
        } else {
            let nextQueueItem = state.playQueue.findIndex((item) => {
                return item.id == state.nowPlaying.id
            })
            // dispatch(playQueueItem(1))

            // dispatch(playQueueItem(nextQueueItem))
        }


        // setCurrentTrackPosition(state.playQueue[index].id, true)
    }
}