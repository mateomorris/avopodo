import { storeEpisode, updateEpisodeDownloadProgress, setEpisodeAsDownloading } from '../finalware'
import RNFetchBlob from 'rn-fetch-blob'

export function downloadEpisode(episode) {
    return (dispatch, getState) => {

        dispatch(setEpisodeAsDownloading(episode))


        let state = getState()

        const dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
        .config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            path: `${dirs.MainBundleDir}/${episode.id}.mp3`,
            fileCache : true,
            appendExt : 'mp3'
        })
        // .fetch('GET', 'https://content.production.cdn.art19.com/episodes/3bd93e04-1373-4737-b877-c8236061bb45/33ee05ed7b83dfe04a5d8ece7f33be550daa2554d695560398ad22d93bde6c98904b9472d45cdf479f85812a7e852f941e16d520ba538a1a9ce34a1f91df42a9/Change%20Agent_TRAILER_MIX%20BF.mp3', {
        .fetch('GET', episode.audio, {
            //some headers ..
        })
        .progress((received, total) => {
            let progress = received / total
            if (state.downloadsInProgress) {
                dispatch(updateEpisodeDownloadProgress(episode.id, progress))
            }
        })
        .then((res) => {
            // the temp file path
            // console.log('The file saved to ', res.path())

            dispatch(storeEpisode(episode, 'file://' + res.path()));

        })
        .catch((error) => {
            console.log('Could not download file', error)
        })
    }
}