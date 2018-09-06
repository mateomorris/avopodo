import { ADD_EPISODE_TO_QUEUE } from '../actionTypes'

export function addEpisodeToQueue(show, episode) {
    return {
        type: ADD_EPISODE_TO_QUEUE,
        show, 
        episode
    }
}   