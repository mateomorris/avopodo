import { PLAY_EPISODE } from '../actionTypes'

export function playEpisode(show, episode) {
    return {
        type: PLAY_EPISODE,
        show: show,
        episode: episode
    }
}