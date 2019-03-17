import { CANCEL_EPISODE_DOWNLOAD } from '../actionTypes'

export function cancelEpisodeDownload (episode) {
    return {
        type : CANCEL_EPISODE_DOWNLOAD,
        episodeId : episode.id
    }
}