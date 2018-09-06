// import { createStore, applyMiddleware } from 'redux';
// import { persistStore, autoRehydrate } from 'redux-persist';

// import reducer from './reducers';

// const initialState = {
//   subscribedShows: []
// };

// const store = createStore(reducer, initialState)

// export default store;

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from './reducers' // where reducers is an object of reducers

const config = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(config, reducers)

export function configureStore () {
  let store = createStore(
    reducer, 
    applyMiddleware(
      thunkMiddleware
    )
  )
  return store
}