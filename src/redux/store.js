// import { createStore, applyMiddleware } from 'redux';
// import { persistStore, autoRehydrate } from 'redux-persist';

// import reducer from './reducers';

// const initialState = {
//   subscribedShows: []
// };

// const store = createStore(reducer, initialState)

// export default store;



// import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk'
// import { persistStore, persistCombineReducers } from 'redux-persist'
// import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
// import reducers from './reducers' // where reducers is an object of reducers

// const config = {
//   key: 'root',
//   storage,
// }

// const reducer = persistCombineReducers(config, reducers)

// export function configureStore () {
//   let store = createStore(
//     reducer, 
//     applyMiddleware(
//       thunkMiddleware
//     )
//   )
//   return store
// }


import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
}

export const initialState = {
  downloadsInProgress : [],
  downloadedEpisodes: [],
  subscribedShows: [],
  nowPlaying: {},
  playing: false,
  active: false,
  activePlaylist : {},
  playQueue: [],
  episodePlaybackPositions: {},
  currentTrackPosition: 0,
  playlists: [],
  finishedEpisodes : [],
  trackSynced : false,
  canceledEpisodes : []
};

const persistedReducer = persistReducer(persistConfig, reducer.reducer)

let store = createStore(persistedReducer, initialState, applyMiddleware(thunkMiddleware))
// let persistor = persistStore(store)

export default store