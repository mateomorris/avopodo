import {Navigation, ScreenVisibilityListener} from 'react-native-navigation';

import HomeScreen from './HomeScreen';
import DiscoverScreen from './DiscoverScreen';
import PlaylistsScreen from './PlaylistsScreen';
import SubscribedScreen from './SubscribedScreen';
import ShowDetailScreen from './ShowDetailScreen';
import PlayingScreen from './PlayingScreen';
import ShowPreviewScreen from './ShowPreviewScreen';
import PlaylistCreationScreen from './PlaylistCreationScreen';
import QueueScreen from './QueueScreen';
import EpisodeDetailScreen from './EpisodeDetailScreen'
import PlaylistDetailScreen from './PlaylistDetailScreen'

import NowPlayingHeader from 'components/NowPlayingHeader';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('example.HomeScreen', () => HomeScreen, store, Provider);
  Navigation.registerComponent('example.DiscoverScreen', () => DiscoverScreen, store, Provider);
  Navigation.registerComponent('example.PlaylistsScreen', () => PlaylistsScreen, store, Provider);
  Navigation.registerComponent('example.SubscribedScreen', () => SubscribedScreen, store, Provider);
  Navigation.registerComponent('example.ShowDetailScreen', () => ShowDetailScreen, store, Provider);
  Navigation.registerComponent('example.PlayingScreen', () => PlayingScreen, store, Provider);
  Navigation.registerComponent('example.NowPlayingHeader', () => NowPlayingHeader, store, Provider);
  Navigation.registerComponent('example.ShowPreviewScreen', () => ShowPreviewScreen, store, Provider);
  Navigation.registerComponent('example.PlaylistCreationScreen', () => PlaylistCreationScreen, store, Provider);
  Navigation.registerComponent('example.QueueScreen', () => QueueScreen, store, Provider);
  Navigation.registerComponent('example.EpisodeDetailScreen', () => EpisodeDetailScreen, store, Provider);
  Navigation.registerComponent('example.PlaylistDetailScreen', () => PlaylistDetailScreen, store, Provider);
}

export function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    willAppear: ({screen}) => console.log(`Displaying screen ${screen}`),
    didAppear: ({screen, startTime, endTime, commandType}) => console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
    willDisappear: ({screen}) => console.log(`Screen will disappear ${screen}`),
    didDisappear: ({screen}) => console.log(`Screen disappeared ${screen}`)
  }).register();
}
