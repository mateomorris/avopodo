import { Navigation, NativeEventsReceiver } from 'react-native-navigation';
import { Platform, AppRegistry, Text } from 'react-native';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import { Provider, connect, bindActionCreators } from 'react-redux';
import { persistStore, persistCombineReducers } from 'redux-persist'


import store from './src/redux/store';

import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import GenreListScreen from './src/screens/GenreListScreen';
import GenreDetailScreen from './src/screens/GenreDetailScreen';
import PlaylistsScreen from './src/screens/PlaylistsScreen';
import SubscribedScreen from './src/screens/SubscribedScreen';
import ShowDetailScreen from './src/screens/ShowDetailScreen';
import PlayingScreen from './src/screens/PlayingScreen';
import ShowPreviewScreen from './src/screens/ShowPreviewScreen';
import PlaylistCreationScreen from './src/screens/PlaylistCreationScreen';
import QueueScreen from './src/screens/QueueScreen';
import EpisodeDetailScreen from './src/screens/EpisodeDetailScreen';
import PlaylistDetailScreen from './src/screens/PlaylistDetailScreen';
import PlayBar from './src/components/PlayBar';
import TopBar from './src/components/TopBar';
import OfflineBanner from 'components/OfflineBanner';

//////////////////////////////////
console.disableYellowBox = true;
//////////////////////////////////

if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

persistStore(store, null, () => {

  Navigation.registerComponentWithRedux('example.HomeScreen', () => HomeScreen, Provider, store);
  Navigation.registerComponentWithRedux('example.DiscoverScreen', () => DiscoverScreen, Provider, store);
  Navigation.registerComponentWithRedux('example.GenreListScreen', () => GenreListScreen, Provider, store);
  Navigation.registerComponentWithRedux('example.GenreDetailScreen', () => GenreDetailScreen, Provider, store);
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
  Navigation.registerComponentWithRedux('example.TopBar', () => TopBar, Provider, store);
  Navigation.registerComponentWithRedux('example.OfflineBanner', () => OfflineBanner, Provider, store);

  Navigation.setRoot({
      root: {
          bottomTabs: {
            titleDisplayMode: 'alwaysShow',
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
                      text: 'Feed',
                      icon: require('./src/assets/tab-icons/feed.png'),
                      selectedIcon: require('./src/assets/tab-icons/feed-active.png'),
                      testID: 'SECOND_TAB_BAR_BUTTON'
                    },
                    topBar: {
                      title: {
                        text: 'Feed',
                        // component: {
                        //   name: 'example.TopBar',
                        //   alignment: 'center'
                        // }
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
                    topBar: {
                      title: {
                        text: 'Discover',
                      },
                    },
                    bottomTab: {
                      text: 'Discover',
                      icon: require('./src/assets/tab-icons/discover.png'),
                      selectedIcon: require('./src/assets/tab-icons/discover-active.png'),
                      testID: 'SECOND_TAB_BAR_BUTTON'
                    },
                  }
                }
              },
              // {
              //   stack: {
              //     children: [
              //       {
              //         component: {
              //           name: 'example.PlaylistsScreen',
              //           passProps: {
              //             text: 'This is tab 1'
              //           }
              //         }
              //     }],
              //     options: {
              //       bottomTab: {
              //         text: 'Stations',
              //         icon: require('./src/assets/tab-icons/stations.png'),
              //         selectedIcon: require('./src/assets/tab-icons/stations-active.png'),
              //         testID: 'SECOND_TAB_BAR_BUTTON'
              //       },
              //       topBar: {
              //         title: {
              //           text: 'Stations',
              //         },
              //       }
              //     }
              //   }
              // },
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
});

AppRegistry.registerHeadlessTask('TrackPlayer', () => require('./player-handler.js'));

Platform.OS == 'android' &&
Navigation.setDefaultOptions({
  bottomTabs: {
    titleDisplayMode: 'alwaysShow'
  }
});