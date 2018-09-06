import { setupPlayer, setCurrentTrackPosition } from '../finalware'

export function startPlayer() {
    return (dispatch, getState) => {
        let state = getState().reducer;
        let nowPlayingEpisodeId = state.playing ? state.nowPlaying.id : false;
        dispatch(setupPlayer())
        if (nowPlayingEpisodeId) {
            dispatch(setCurrentTrackPosition(nowPlayingEpisodeId))
        }
    }
}