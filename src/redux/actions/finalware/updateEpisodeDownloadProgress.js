import { UPDATE_EPISODE_DOWNLOAD_PROGRESS } from '../actionTypes'

export function updateEpisodeDownloadProgress (episodeId, progress) {
    return {
        type: UPDATE_EPISODE_DOWNLOAD_PROGRESS,
        episodeId,
        progress
    }
}