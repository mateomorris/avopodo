import { unStoreEpisode } from '../finalware'
import RNFetchBlob from 'rn-fetch-blob'

export function removeEpisodeDownload(episode) {
    return (dispatch, getState) => {

        dispatch(unStoreEpisode(episode.id))

        let { fs, config } = RNFetchBlob;
        let state = getState();

        console.log(state)
        // let downloadedEpisode = state.downloadedEpisodes.find(download => download.id == episode.id)
        // console.log(downloadedEpisode)

        RNFetchBlob.fs.unlink(episode.audio.replace('file://','')).then(() => {

        }).catch((error) => {
            console.log(error)
        })
        
    } 
}