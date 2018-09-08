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
    RESET_QUEUE
} from './actions/actionTypes';

import { Navigation } from "react-native-navigation";

import TrackPlayer from 'react-native-track-player';
import trackDetails from '../utilities/tracks';

const initialState = {
  subscribedShows: [],
  nowPlaying: {},
  playing: false,
  active: false,
  activePlaylist : null,
  playQueue: [],
  episodePlaybackPositions: {},
  currentTrackPosition: 0,
  playlists: [],
  finishedEpisodes : []
};

function reducer(state = initialState, action) {
    // console.log(state)
    switch (action.type) {
        case RESET_QUEUE: 
            TrackPlayer.reset();
            return {
                ...state,
                activePlaylist : null,
                nowPlaying : {},
                playQueue : []
            };
        case SYNC_QUEUE: 
            console.log('SYNCING QUEUE')
            TrackPlayer.getCurrentTrack().then((track) => {
                if (state.nowPlaying.id != track) {
                    let newQueue = state.playQueue.slice(state.playQueue.findIndex(item => item.id == track))
                    return {
                        ...state,
                        playQueue : newQueue
                    }
                } else {
                    return state
                }
            })
        case REMOVE_PLAYLIST: 
            return {
                ...state,
                playlists: state.playlists.filter((playlist) => {
                    return playlist.id != action.playlistId
                })
            }
        case EDIT_PLAYLIST: 
            console.log(action.playlist)
            return {
                ...state,
                playlists: state.playlists.map((playlist) => {
                    console.log(playlist)
                    if (playlist.id == action.playlist.id) {
                        console.log(`SETTING PLAYLIST UPDATE FOR`, playlist, action.playlist)
                        return {
                            id : action.playlist.id,
                            duration : action.playlist.length, // swap
                            episodeQueue : action.playlist.episodeQueue, 
                            length : action.playlist.duration, // swap
                            name : action.playlist.name,
                            playFirst : action.playlist.playFirst,
                            released : action.playlist.released,
                            shows : action.playlist.shows
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

            let currentEpisodePosition = state.playQueue.map(episode => episode.id).indexOf(state.nowPlaying.id)

            if ('id' in state.nowPlaying) {
                let playQueue = state.playQueue.slice(currentEpisodePosition).map((episode) => {
                    return trackDetails(episode)
                })
                TrackPlayer.add(playQueue).then(() => {
                    console.log(state.nowPlaying)
                    TrackPlayer.pause()

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
                // TrackPlayer.getQueue().then((queue) => {
                //     TrackPlayer.play()
                // })
            })

            return {
                ...state, 
                playing: true,
                active: true,
                activePlaylist: action.playlist,
                bufferingStatus: false, 
                nowPlaying: action.playlist.episodeQueue[0],
                playQueue: action.playlist.episodeQueue
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

            let { existingPlaylistId, queue, queueDuration } = action 
            let newestPlaylist = state.playlists.find(playlist => playlist.id == existingPlaylistId)

            newestPlaylist.duration = Number.parseFloat(queueDuration / (60 * 60)).toFixed(1) // convert to hours  
            newestPlaylist.episodeQueue = queue

            return {
                ...state,
                playlists: [newestPlaylist].concat(state.playlists.filter(playlist => playlist.id != existingPlaylistId))
            };

        case CREATE_PLAYLIST: 
            let { playlistId, playlistName, shows, releaseRange, episodeLength, playFirst, selectedPlaylistIcon } = action.playlist;
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
                    episodeQueue: null
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

            if (retrievedTrackPosition) {
                TrackPlayer.seekTo(retrievedTrackPosition);
                TrackPlayer.play();
            }

            if(!action.startPlaying) {
                TrackPlayer.pause()
            }

            return {
                ...state,
                active: true,
                playing: action.startPlaying
            };
        case START_PLAYER: 
            TrackPlayer.reset();
            TrackPlayer.setupPlayer();

            return state;
        case UPDATE_EPISODE_PLAYBACK_POSITION: 

            if (state.episodePlaybackPositions[action.episodeId] == action.position) {
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
            console.log(state.playQueue)
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
            let newShow = {
                id: action.id,
                title: action.title,
                image: action.image,
                description: action.description,
                publisher : action.publisher,
                imageHighRes: action.imageHighRes,
                itunesId : action.itunesId
            }
            return {
                ...state, 
                subscribedShows: [newShow, ...state.subscribedShows]
            }
        case 'Unsubscribe from show': 
            let updatedSubscribedShows = state.subscribedShows.filter(show => show.id !== action.id)
            return {
                ...state, 
                subscribedShows: updatedSubscribedShows
            }
        case PLAY_EPISODE: 
            var track = trackDetails(action.episode);    
            // TrackPlayer.reset();
            // #NEXT: Add the track at the current spot in the queue (as opposed to at the beginning)
            TrackPlayer.add([track]).then(function() {
                TrackPlayer.skip(track.id).then(() => {
                    TrackPlayer.play();
                })
            });

            return {
                ...state, 
                nowPlaying: action.episode,
                initialPlay: true,
                playing: true,
                active: true,
                activeQueueItem : 0,
                playQueue: [
                    action.episode
                ].concat(state.playQueue)
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
            console.log('No matching action type found in reducer');
            return state
    }
}

export default {
    reducer
}