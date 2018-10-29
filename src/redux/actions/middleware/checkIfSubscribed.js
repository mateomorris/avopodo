export function checkIfSubscribed (showId) {
    return ( dispatch, getState ) => {
        const state = getState()
        if (state.subscribedShows.find(item => item.id == showId)) {
            return true
        } else {
            return false
        }
    }
}