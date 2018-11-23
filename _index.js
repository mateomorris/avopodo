import { Navigation } from "react-native-navigation";
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider, connect, bindActionCreators } from 'react-redux';
import { persistStore, persistCombineReducers } from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from './src/redux/reducers' // where reducers is an object of reducers

// import { configureStore } from './src/redux/store';
import * as specialActions from './src/redux/actions'

import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import SubscribedScreen from './src/screens/SubscribedScreen';
import ShowDetailScreen from './src/screens/ShowDetailScreen';
import PlayingScreen from './src/screens/PlayingScreen';
import ShowPreviewScreen from './src/screens/ShowPreviewScreen';
import PlaylistCreationScreen from './src/screens/PlaylistCreationScreen';
import QueueScreen from './src/screens/QueueScreen';
import EpisodeDetailScreen from './src/screens/EpisodeDetailScreen';
import PlaylistDetailScreen from './src/screens/PlaylistDetailScreen';

import { PlayBar } from './src/components/PlayBar';


////////////////////////////////
console.disableYellowBox = true;
////////////////////////////////

const config = {
  key: 'root',
  storage,
}

const finalReducer = persistCombineReducers(config, reducers)
export function configureStore () {
  let store = createStore(
    finalReducer, 
    applyMiddleware(
      thunkMiddleware
    )
  )
  return store
}

const store = configureStore()


// Register Screens
Navigation.registerComponentWithRedux('example.HomeScreen', () => HomeScreen, Provider, store);
Navigation.registerComponentWithRedux('example.DiscoverScreen', () => DiscoverScreen, Provider, store);
Navigation.registerComponentWithRedux('example.PlaylistsScreen', () => PlaylistsScreen, Provider, store);
Navigation.registerComponentWithRedux('example.SubscribedScreen', () => SubscribedScreen, Provider, store);
Navigation.registerComponentWithRedux('example.ShowDetailScreen', () => ShowDetailScreen, Provider, store);
Navigation.registerComponentWithRedux('example.PlayingScreen', () => PlayingScreen, Provider, store);
Navigation.registerComponentWithRedux('example.ShowPreviewScreen', () => ShowPreviewScreen, Provider, store);
Navigation.registerComponentWithRedux('example.PlaylistCreationScreen', () => PlaylistCreationScreen, Provider, store);
Navigation.registerComponentWithRedux('example.QueueScreen', () => QueueScreen, Provider, store);
Navigation.registerComponentWithRedux('example.EpisodeDetailScreen', () => EpisodeDetailScreen, Provider, store);
Navigation.registerComponentWithRedux('example.PlaylistDetailScreen', () => PlaylistDetailScreen, Provider, store);
Navigation.registerComponentWithRedux('example.PlayBar', () => PlayBar, Provider, store);

persistStore(store, null, () => {

  // Runs when app launches
  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root: {
          bottomTabs: {
            children: [
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: 'example.HomeScreen',
                        passProps: {
                          text: 'This is tab 1'
                        }
                      }
                  }],
                  options: {
                    bottomTab: {
                      text: 'Home',
                      icon: require('./src/assets/tab-icons/home.png'),
                      selectedIcon: require('./src/assets/tab-icons/home-active.png'),
                      testID: 'SECOND_TAB_BAR_BUTTON'
                    },
                    topBar: {
                      title: {
                        text: 'Home',
                      },
                    }
                  }
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: 'example.DiscoverScreen',
                        passProps: {
                          text: 'This is tab 1'
                        }
                      }
                  }],
                  options: {
                    bottomTab: {
                      text: 'Search',
                      icon: require('./src/assets/tab-icons/discover.png'),
                      selectedIcon: require('./src/assets/tab-icons/discover-active.png'),
                      testID: 'SECOND_TAB_BAR_BUTTON'
                    },
                    topBar: {
                      title: {
                        text: 'Search',
                      },
                    }
                  }
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: 'example.PlaylistsScreen',
                        passProps: {
                          text: 'This is tab 1'
                        }
                      }
                  }],
                  options: {
                    bottomTab: {
                      text: 'Playlists',
                      icon: require('./src/assets/tab-icons/playlists.png'),
                      selectedIcon: require('./src/assets/tab-icons/playlists-active.png'),
                      testID: 'SECOND_TAB_BAR_BUTTON'
                    },
                    topBar: {
                      title: {
                        text: 'Playlists',
                      },
                    }
                  }
                }
              },
              {
                stack: {
                  children: [
                    {
                      component: {
                        name: 'example.SubscribedScreen',
                        passProps: {
                          text: 'This is tab 1'
                        }
                      }
                  }],
                  options: {
                    bottomTab: {
                      text: 'Subscribed',
                      icon: require('./src/assets/tab-icons/subscribed.png'),
                      selectedIcon: require('./src/assets/tab-icons/subscribed-active.png'),
                      testID: 'FIRST_TAB_BAR_BUTTON'
                    },
                    topBar: {
                      title: {
                        text: 'Subscribed',
                      },
                    }
                  }
                }
              },
            ]
          }
        }
    });

    // Navigation.showOverlay({
    //   component: {
    //     name: 'navigation.playground.PlayBar',
    //     options: {
    //       overlay: {
    //         interceptTouchOutside: false
    //       }
    //     }
    //   }
    // });
  });
})


