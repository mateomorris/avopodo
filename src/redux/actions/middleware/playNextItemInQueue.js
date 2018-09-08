import { playQueueItem } from '../finalware'

export function playNextItemInQueue(index) {
    return (dispatch, getState) => {
        let state = getState().reducer;

        if (index) {
            console.log('Playing specific queue item')
            dispatch(playQueueItem(index))
        } else {
            console.log('Playing NEXT queue item')

            let { id } = state.nowPlaying
            let nextQueueItem = state.playQueue.findIndex((item) => {
                return item.id == id
            })

            console.log(`Playing queue item ${id}, ${nextQueueItem}`)
            dispatch(playQueueItem(nextQueueItem))
        }


        // setCurrentTrackPosition(state.playQueue[index].id, true)
    }
}