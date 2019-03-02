// import {  } from '../finalware'
import RNFetchBlob from 'rn-fetch-blob'

export function pauseEpisodeDownload(episode) {
    return (dispatch, getState) => {

        let { fs, config } = RNFetchBlob;
        let state = getState();

        console.log(state)

        // RNFetchBlob.fs.exists(dest)
        //     .then((ext) => { 
        //         if (ext) { 
        //             return fs.stat(dest).then((stat) => stat) 
        //         } else {
        //             return Promise.resolve({ size: 0 }) 
        //         })
        //     .then((stat) => { 
        //             console.log(stat) 
        //             return RNFetchBlob.config({ 
        //                         path: dest, 
        //                         overwrite: false 
        //                     })
        //                     .fetch('GET', 'http://apicloudspace.b0.upaiyun.com/apicloud-video/c1.1.mp4', { Range:bytes=${stat.size}- })
        //                     .progress((received, total) => { 
        //                         const ss = 1024 * 1024; 
        //                         console.log('progress', (received / total).toFixed(2) + "&&&&" + (total / ss).toFixed(2)) 
        //                     }) 
        //         })
        // }

        
    } 
}