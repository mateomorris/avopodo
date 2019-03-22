import {
    ADD_EPISODE_TO_QUEUE, 
    PLAY_NEXT_ITEM_IN_QUEUE,
    SET_HIGH_RES_ARTWORK,
    TOGGLE_BUFFERING_STATUS,
    UPDATE_EPISODE_PLAYBACK_POSITION,
    START_PLAYER,
    SET_CURRENT_TRACK_POSITION,
    MOVE_QUEUE_ITEM_TO_FRONT,
    CREATE_PLAYLIST,
    SET_PLAYLIST_QUEUE,
    SET_RECENT_RELEASE_DATE,
    SET_EPISODE_LIST_FOR_SHOW,
    ADD_PLAYLIST_TO_QUEUE,
    PLAY_EPISODE,
    SET_ARTWORK_COLOR,
    REMOVE_ITEM_FROM_QUEUE,
    SETUP_PLAYER,
    SET_NEWEST_FROM_SUBSCRIBED,
    MARK_EPISODE_AS_PLAYED,
    EDIT_PLAYLIST,
    REMOVE_PLAYLIST,
    SYNC_QUEUE,
    RESET_QUEUE,
    SYNC_PLAY_STATUS,
    UPDATE_PLAY_QUEUE,
    UPDATE_NOW_PLAYING,
    UPDATE_PLAYLIST_EPISODE_LIST,
    SET_SHOW_AS_NEW,
    DOWNLOAD_EPISODE,
    STORE_EPISODE,
    UPDATE_EPISODE_DOWNLOAD_PROGRESS,
    SET_EPISODE_AS_DOWNLOADING,
    UNSTORE_EPISODE,
    CANCEL_EPISODE_DOWNLOAD,
    SUBSCRIBE_TO_MULTIPLE_SHOWS
} from './actions/actionTypes';

import { Navigation } from "react-native-navigation";
import firebase from 'react-native-firebase';

import TrackPlayer from 'react-native-track-player';
import trackDetails from '../utilities/tracks';

import initialState from './store';

// const initialState = {
//   downloadsInProgress : [],
//   downloadedEpisodes: [],
//   subscribedShows: [],
//   nowPlaying: {},
//   playing: false,
//   active: false,
//   activePlaylist : {},
//   playQueue: [],
//   episodePlaybackPositions: {},
//   currentTrackPosition: 0,
//   playlists: [],
//   finishedEpisodes : [],
//   trackSynced : false,
//   canceledEpisodes : []
// };

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'Clear shows': 
            return {
                ...state,
                subscribedShows : []
            }
        case SUBSCRIBE_TO_MULTIPLE_SHOWS: 
            return {
                ...state,
                subscribedShows : [
                    ...action.shows,
                    ...state.subscribedShows,
                ]
            }
        case CANCEL_EPISODE_DOWNLOAD: 
            return {
                ...state,
                canceledEpisodes : [
                    ...state.canceledEpisodes,
                    action.episodeId
                ],
                downloadsInProgress : state.downloadsInProgress.filter((download) => {
                    return download.episodeId !== action.episodeId
                }),
                downloadedEpisodes : state.downloadedEpisodes.filter((download) => {
                    return download.id !== action.episodeId
                })
            }
        case SET_EPISODE_AS_DOWNLOADING: 
            return {
                ...state,
                canceledEpisodes : state.canceledEpisodes.filter(episodeId => episodeId !== action.episode.id),
                downloadsInProgress : [
                    ...state.downloadsInProgress,
                    {
                        episodeId : action.episode.id.toString(),
                        progress: 0
                    }
                ],
                downloadedEpisodes : [
                    ...state.downloadedEpisodes.filter((download) => {
                        return download.id !== action.episode.id.toString()
                    }),
                    action.episode
                ]
            }
        case UPDATE_EPISODE_DOWNLOAD_PROGRESS: 
            return {
                ...state,
                downloadsInProgress: [
                    {
                        episodeId : action.episodeId.toString(),
                        progress : action.progress
                    },
                    ...state.downloadsInProgress.filter(download => download.episodeId !== action.episodeId.toString()),
                ]
            }
        case UNSTORE_EPISODE: 
            return {
                ...state,
                downloadsInProgress: state.downloadsInProgress.filter(download => download.episodeId !== action.episodeId),
                downloadedEpisodes: state.downloadedEpisodes.filter(download => download.id !== action.episodeId),
            }
        case STORE_EPISODE: 
            return {
                ...state,
                downloadsInProgress: [
                    {
                        episodeId : action.episode.id.toString(),
                        progress : 1
                    },
                    ...state.downloadsInProgress.filter(download => download.episodeId !== action.episode.id.toString()),
                ],
                downloadedEpisodes : [
                    {
                        ...action.episode,
                        audio: action.location,
                        // originalAudio: action.episode.audio // Might use later, depending on strategy
                    },
                    ...state.downloadedEpisodes.filter((download) => {
                        return download.id !== action.episode.id
                    })
                ]
            }
        case SET_SHOW_AS_NEW: 
            return {
                ...state,
                subscribedShows: state.subscribedShows.map((show) => {
                    if (show.id == action.showId) {
                        return {
                            ...show,
                            newEpisodesAvailable: action.setNew
                        }
                    } else {
                        return show
                    }
                })
            }
        case UPDATE_PLAYLIST_EPISODE_LIST: 
            
            const newPlaylistEpisodeListDuration = action.newEpisodeList.map((episode) => {
                return episode.duration
            }).reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })


            return {
                ...state,
                playlists: state.playlists.map((playlist) => {
                    if (playlist.id == action.playlistId) {
                        return {
                            ...playlist,
                            episodeQueue : {
                                episodeList : action.newEpisodeList,
                                episodeListDuration : newPlaylistEpisodeListDuration
                            }
                        }
                    } else {
                        return playlist
                    }
                })
            }
        case UPDATE_NOW_PLAYING: 
            return {
                ...state,
                nowPlaying: action.newEpisode
            }
        case UPDATE_PLAY_QUEUE: 

            return {
                ...state,
                playQueue: action.newPlayQueue
            }
        case SYNC_PLAY_STATUS: 
            return {
                ...state,
                playing: action.playing
            }
        case RESET_QUEUE: 
            TrackPlayer.reset();
            return {
                ...state,
                activePlaylist : {},
                nowPlaying : {},
                playQueue : [],
                active: false
            };
        case SYNC_QUEUE: 

            console.log('Setting the new queue', action.newQueue)

            // return state

            return {
                ...state,
                playQueue : action.newQueue,
                nowPlaying : action.newQueue[0]
            }

        case REMOVE_PLAYLIST: 
            return {
                ...state,
                playlists: state.playlists.filter((playlist) => {
                    return playlist.id != action.playlistId
                })
            }
        case EDIT_PLAYLIST: 
            return {
                ...state,
                // playlists: state.playlists,
                playlists: state.playlists.map((playlist) => {
                    if (playlist.id == action.playlist.id) {
                        return {
                            id : action.playlist.id,
                            duration : action.playlist.length, // swap
                            episodeQueue : action.playlist.episodeQueue, 
                            length : action.playlist.duration, // swap
                            name : action.playlist.name,
                            playFirst : action.playlist.playFirst,
                            released : action.playlist.released,
                            shows : action.playlist.shows,
                            icon : action.playlist.icon
                        }
                    } else {
                        return playlist
                    }
                })
            }
        case MARK_EPISODE_AS_PLAYED: 
            TrackPlayer.pause()
            return {
                ...state,
                nowPlaying: {
                    ...state.nowPlaying,
                    finished: true
                },
                finishedEpisodes : state.finishedEpisodes.concat([state.nowPlaying.id])
            }
        case SET_NEWEST_FROM_SUBSCRIBED: 
            return {
                ...state,
                newestFromSubscribed: action.episodeList
            }
        case SETUP_PLAYER:

            // TrackPlayer.reset();
            TrackPlayer.setupPlayer().then(()=>{
                TrackPlayer.updateOptions({
                    stopWithApp: false,
                    capabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_PAUSE,
                        TrackPlayer.CAPABILITY_STOP,
                        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                        // TrackPlayer.CAPABILITY_SEEK_TO
                    ]
                });
            });

            let currentEpisodePosition = state.playQueue.map(episode => episode.id).indexOf(state.nowPlaying.id)
            if ('id' in state.nowPlaying) {
                let playQueue = state.playQueue.slice(currentEpisodePosition).map((episode) => {
                    return trackDetails(episode)
                })
                TrackPlayer.add(playQueue).then(() => {
                    TrackPlayer.play()
                    TrackPlayer.pause()
                    // TrackPlayer.setVolume(0)
                    // TrackPlayer.play().then(() => {
                    //                         TrackPlayer.pause()

                    // })

                    // TrackPlayer.skip(state.nowPlaying.id).then(() => {
                    //     TrackPlayer.pause()
                    // })
                })
            }

            return {
                ...state,
                playQueue : state.playQueue.slice(currentEpisodePosition),
                activeQueueItem : 0
            };
        case ADD_PLAYLIST_TO_QUEUE: 
            // Reset the queue
            // Add and play the first item in the new queue
            // Add the rest of the items to the queue
            TrackPlayer.reset();
            TrackPlayer.add(action.trackPlayerQueue[0]).then(() => {
                TrackPlayer.play()
                TrackPlayer.add(action.trackPlayerQueue.slice(1))
            })

            firebase.analytics().logEvent('play_playlist', {
                playlist: action.playlist.name,
                details: action.playlist
            }) 

            return {
                ...state, 
                playing: true,
                active: true,
                activePlaylist: action.playlist,
                bufferingStatus: true, 
                nowPlaying: action.playlist.episodeQueue.episodeList[0],
                playQueue: action.playlist.episodeQueue.episodeList
            }
        case SET_EPISODE_LIST_FOR_SHOW: 
            return {
                ...state, 
                subscribedShows : state.subscribedShows.map((show) => {
                    if (show.id == action.showId) {
                        show['episodeList'] = action.episodeList
                    } 
                    return show
                })
            }
        case SET_RECENT_RELEASE_DATE: 

            let showWithUpdatedReleaseDate = state.subscribedShows.find((show) => {
                if (show.itunesId == action.itunesId) {
                    show['releaseDate'] = action.releaseDate
                    return show
                }
            })

            return {
                ...state,
                subscribedShows: [showWithUpdatedReleaseDate].concat(...state.subscribedShows.filter((show) => {
                    return show.itunesId !== action.itunesId
                }))
            };
        case SET_PLAYLIST_QUEUE: 

            let { existingPlaylistId, queue } = action 
            let existingPlaylist = state.playlists.find(playlist => playlist.id == existingPlaylistId)

            let updatedPlaylist = {
                ...existingPlaylist,
                episodeQueue : {
                    episodeList : queue.episodeList,
                    episodeListDuration : Number.parseFloat(queue.episodeListDuration / (60 * 60)).toFixed(1) // convert to hours 
                }
            }

            return {
                ...state,
                playlists: [updatedPlaylist].concat(state.playlists.filter(playlist => playlist.id != existingPlaylistId))
            };

        case CREATE_PLAYLIST: 

            let { playlistId, playlistName, shows, releaseRange, episodeLength, playFirst, selectedPlaylistIcon } = action.playlist;

            firebase.analytics().logEvent('create_playlist', {
                name: playlistName,
                details: action.playlist
            }) 

            return {
                ...state, 
                playlists: [{
                    id : playlistId,
                    name: playlistName,
                    icon: selectedPlaylistIcon,
                    shows,
                    released: releaseRange,
                    length: episodeLength,
                    playFirst,
                    duration: null,
                    episodeQueue: {
                        episodeList: [],
                        episodeListDuration: 0
                    }
                }].concat(state.playlists)
            }
        case MOVE_QUEUE_ITEM_TO_FRONT: 
            return {
                ...state,
                activeQueueItem: 0,
                playQueue: state.playQueue.filter((item, index) => {
                    if (action.index != index) {
                        return item;
                    } 
                }),
            };
        case SET_CURRENT_TRACK_POSITION:
            console.log('Setting current track position')
            let retrievedTrackPosition = state.episodePlaybackPositions[action.episodeId];
            var track = trackDetails(state.nowPlaying);    
            // TrackPlayer.reset()
            // TrackPlayer.add([track]).then(() => {
            //     TrackPlayer.play(); // Necessary to get the seek to work
            //     if(!action.startPlaying) {
            //         TrackPlayer.pause()
            //     }
            // }).then(() => {
            //     if (retrievedTrackPosition) {
            //         TrackPlayer.seekTo(retrievedTrackPosition);
            //     }
            // })

            console.log(retrievedTrackPosition)
            if (retrievedTrackPosition) {
                // TrackPlayer.play()
                // TrackPlayer.seekTo(retrievedTrackPosition);


                const trackPositionSetter = setInterval(function() {
                    TrackPlayer.getBufferedPosition().then((buffered) => {
                        if (buffered > 0) {
                            TrackPlayer.seekTo(retrievedTrackPosition);
                            clearInterval(trackPositionSetter)
                        }
                    })
                }, 1000);

                



                // TrackPlayer.seekTo(retrievedTrackPosition);
            }

            // if(!action.startPlaying) {
            //     TrackPlayer.pause()
            // }

            // Ensure volume is full (gets set to zero in SETUP_PLAYER because .play() needs to get called in order for buffering to start)
            TrackPlayer.setVolume(1)

            return {
                ...state,
                active: true,
                playing: action.startPlaying,
                trackSynced : true
            };
        case START_PLAYER: 
            TrackPlayer.reset();
            TrackPlayer.setupPlayer({
                // minBuffer : 0,	// Minimum time in seconds that needs to be buffered
                // maxBuffer : 0,	// Maximum time in seconds that needs to be buffered
                // playBuffer : 10, // Minimum time in seconds that needs to be buffered to start playing
                // maxCacheFiles : 100, // Maximum amount of files cached
                // maxCacheSize : 100000 // Maximum cache size in kilobytes
            });

            return state;
        case UPDATE_EPISODE_PLAYBACK_POSITION: 

            if (state.episodePlaybackPositions[action.episodeId] == action.position) { // No difference in values
                return state;
            } else {
                return {
                    ...state,
                    episodePlaybackPositions: {
                        ...state.episodePlaybackPositions,
                        [action.episodeId]: action.position
                    }
                }; 
            }



        case TOGGLE_BUFFERING_STATUS: 
            return {
                ...state, 
                bufferingStatus: action.status
            }

        case REMOVE_ITEM_FROM_QUEUE: 
            return {
                ...state, 
                activeQueueItem : action.index,
                playQueue: state.playQueue,
                // playQueue: [
                //     ...state.playQueue.slice(action.index + 1)
                // ] 
            }

        case PLAY_NEXT_ITEM_IN_QUEUE: 

            let trackToPlay = state.playQueue[action.index];
            var track = trackDetails(trackToPlay);

            // Removing the skipped item from the queue for now
            // TODO: Always keep the most recently skipped item in the queue so it can be returned to

            TrackPlayer.skip(track.id).then(() => {
                TrackPlayer.play()
            })

            if (state.activePlaylist) { // Playing a playlist

                // Remove the skipped episodes from the playlist play queue 

                const trackPositionInQueue = state.playlists.find((playlist) => {
                    return playlist.id == state.activePlaylist.id
                }).episodeQueue.episodeList.findIndex((track) => {
                    return track.id == trackToPlay.id
                })

                const newPlaylistEpisodeList = state.playlists.find((playlist) => {
                    return playlist.id == state.activePlaylist.id
                }).episodeQueue.episodeList.slice(trackPositionInQueue)
                

                // Calculate the new length of the playlist 

                const newEpisodeListDuration = newPlaylistEpisodeList.map((episode) => {
                    return episode.duration
                }).reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                })



                return {
                    ...state,
                    playing: true,
                    active: true,
                    nowPlaying: state.playQueue[action.index],
                    activeQueueItem: action.index,
                    // playQueue : newPlaylistEpisodeList,
                    playlists: state.playlists.map((playlist) => {
                        if (state.activePlaylist.id == playlist.id) {
                            return {
                                ...playlist,
                                episodeQueue : {
                                    episodeList : newPlaylistEpisodeList,
                                    episodeListDuration : Number.parseFloat(newEpisodeListDuration / (60 * 60)).toFixed(1)
                                }
                            }
                        } else {
                            return playlist
                        }
                    })
                }
                
            } else {
                console.log('No playlist is active')
                return state
            }

            // TrackPlayer.add([track]).then(() => {
            //     TrackPlayer.remove(state.playQueue[0].id).then(() => {
            //         // TrackPlayer.reset();
            //         console.log(track)

            //     })
            // });


            return {
                ...state,
                playing: true,
                active: true,
                nowPlaying: state.playQueue[action.index],
                activeQueueItem: action.index,
            }

        case ADD_EPISODE_TO_QUEUE: 
            var track = trackDetails(action.episode);
            TrackPlayer.add([track])
            return {
                ...state, 
                nowPlaying: {
                    episode: action.episode,
                    show: action.show
                },
                playQueue: [
                    {
                        show: action.show,
                        episode: action.episode
                    }
                ].concat(state.playQueue)
            }
        case 'Search': 
            return {
                ...state, 
                searchResults: 'This should be some search results'
            }
        case 'Subscribe to show': 

            firebase.analytics().logEvent('show_subscribe', {
                title: action.title
            }) 

            // console.log(action)
            
            // let newShow = {
            //     id: action.id,
            //     title: action.title,
            //     image: action.image,
            //     description: action.description,
            //     publisher : action.publisher,
            //     imageHighRes: action.imageHighRes,
            //     itunesId : action.itunesId,
            //     newEpisodesAvailable : true
            // }
            return {
                ...state, 
                subscribedShows: [action.show, ...state.subscribedShows]
            }
        case 'Unsubscribe from show': 

            let updatedSubscribedShows = state.subscribedShows.filter(show => show.id !== action.id)
            let showTitle = state.subscribedShows.find(show => show.id == action.id);

            firebase.analytics().logEvent('unsubscribe_from_show', {
                show: showTitle,
                subscribedShows: updatedSubscribedShows
            }) 


            return {
                ...state, 
                subscribedShows: updatedSubscribedShows
            }
        case PLAY_EPISODE: 

            let episode = action.episode;
            let downloadedEpisode = state.downloadedEpisodes.find(d => d.id == episode.id)

            // If it exists, swap out network audio for local audio
            if (downloadedEpisode) {
                episode = {
                    ...episode,
                    audio: downloadedEpisode.audio
                }
            }


            var track = trackDetails(episode);  
            // TrackPlayer.reset();
            // #NEXT: Add the track at the current spot in the queue (as opposed to at the beginning)
            TrackPlayer.add([track]).then(function() {
                TrackPlayer.skip(track.id).then(() => {
                    TrackPlayer.play()
                })
            }).catch((error) => {
                console.log(error)
            })
            
            firebase.analytics().logEvent('play_episode', {
                episode: action.episode.title,
                show: action.episode.showTitle
            }) 

            return {
                ...state, 
                nowPlaying: action.episode,
                initialPlay: true,
                playing: true,
                active: true,
                activeQueueItem : 0,
                playQueue: [ action.episode ]
                // playQueue: [
                //     action.episode
                // ].concat(state.playQueue)
            }
        case 'Toggle playback':
            if (state.playing) {
                TrackPlayer.pause();
            } else {
                TrackPlayer.play();
            }
            return {
                ...state, 
                initialPlay: false,
                playing: state.playing ? false : true
            }
        case SET_ARTWORK_COLOR:
            let modifiedShow = state.subscribedShows.filter((show) => {
                return show.id == action.id
            })[0];
            modifiedShow.color = action.color;

            const newSubscribedShows = state.subscribedShows.map((show) => {
                if (show.id == action.id) {
                    show.episodeList = show.episodeList.map((episode) => {
                        episode.showColor = action.color
                        return episode
                    })
                    show.color = action.color
                    return show;
                } else {
                    return show
                }
            });
            
            return {
                ...state,
                subscribedShows: newSubscribedShows
            }
        case SET_HIGH_RES_ARTWORK: 
            let newModifiedShow = state.subscribedShows.filter((show) => {
                return show.id == action.id
            })[0];
            newModifiedShow.imageHighRes = action.highResArtwork;
            const newNewSubscribedShows = state.subscribedShows.map((show) => {
                if (show.id == action.id) {
                    return show = newModifiedShow;
                } else {
                    return show
                }
            });
            return {
                ...state,
                subscribedShows: newNewSubscribedShows
            }
        default:
            return state
    }
}

export default {
    reducer
}