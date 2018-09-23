import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import playlistIcons from '../assets/playlist-icons'

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';
import PlayBar from '../components/PlayBar';

import * as actions from '../redux/actions'

class PlaylistsScreen extends React.Component {

  componentDidMount() {
    this.props.actions.syncPlaylists()
  }

  _handleFavoritePress = () => {

  }

  _playAudio = (playlist) => {
    
    this.props.actions.addPlaylistToQueue(playlist)
    this.props.actions.toggleBufferingStatus(false)

  }

  _handlePlaylistDetailPress = (playlist) => {

    Navigation.showOverlay({
      component: {
        name: 'example.PlaylistDetailScreen',
        passProps: { 
          playlist
        }, // simple serializable object that will pass as props to the lightbox (optional)
        options: {
          overlay: {
            interceptTouchOutside: true
          }
        }
      }
    });
  }

  _handlePlaylistPlayPress = (playlist) => {

    // let playlistQueue = playlist.episodeQueue.map((episode) => {
    //   return {
    //     id: episode.id,
    //     title: episode.title,
    //     url: episode.audio,
    //     artist: episode.showTitle,
    //     duration: episode.duration,
    //     description: episode.description,
    //     // date: '',
    //     artwork: episode.showImage
    //   }
    // })

    this._playAudio(playlist)

  }

  _renderFavorites = (favorites) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {favorites.map((item, index) => {
          return (
            <ShowThumbnail art={item.art} key={index} />
          )
        })}
      </View>
    );
  }

  _getMostRecentPlaylistItemIndex = (episodeQueue, nowPlaying) => {
    if (episodeQueue[0].id == nowPlaying.id) {
      return 1
    } else {
      return 0
    }
  }

  _renderPlaylists = (playlists, nowPlaying) => {
    return (
      <View>
        {playlists.map((item, index) => {
          return (
            <PlaylistThumbnail 
              key={index} 
              title={item.name} 
              duration={item.duration} 
              icon={playlistIcons[item.icon]} 
              episodes={item.episodeQueue ? item.episodeQueue.slice(this._getMostRecentPlaylistItemIndex(item.episodeQueue, nowPlaying)) : null} 
              onRightPress={() => {this._handlePlaylistPlayPress(item)}} 
              onLeftPress={() => {this._handlePlaylistDetailPress(item)}} 
            />
          )
        })}
      </View>
    );
  }

  _renderHomeFeed = (episodes) => {
    return (
      <View style={{flex: 1, marginTop: 15}}>
        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20, paddingLeft: 5 }}>Newest from Favorites</Text>
        {
          episodes.map((episode, index) => {
            return (
              <EpisodeSnippet data={episode} key={index} />
            )
          })
        }
      </View>
    );
  }

  _createPlaylist = () => {

  }

  _handleNewPlaylistsPress = (subscribedShows) => {

    if (subscribedShows.length >= 5) {

      Navigation.showOverlay({
        component: {
          name: 'example.PlaylistCreationScreen',
          passProps: { 
            subscribedShows
          }, // simple serializable object that will pass as props to the lightbox (optional)
          options: {
            overlay: {
              interceptTouchOutside: true
            }
          }
        }
      });
      
    } else {
      Alert.alert(`You must subscribe to at least five shows before creating a playlist`, `otherwise like, what's the point`);
    }
  }


  handleViewRef = ref => this.view = ref;
  
  bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

  render() {

    this.state = {
      favorites: [],
      playlists: [],
      homeFeed: []
    };

    let { subscribedShows }= this.props;

    return (
      <View style={{flex:1, overflow: 'visible', paddingTop: 10}}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20, paddingLeft: 15, paddingTop: 10, paddingBottom: 10 }}>My Playlists</Text> */}
          <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 10, paddingRight: 10 }}>
            { this._renderPlaylists(this.props.playlists, this.props.nowPlaying) }
            <View style={{
              backgroundColor: 'black',
              marginTop: 10,
              marginRight: 10,
              marginLeft: 10,
              borderRadius: 5
            }}>
            <TouchableOpacity style={{
                backgroundColor: '#D8D8D8',
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 5
            }} onPress={() => {
              this._handleNewPlaylistsPress(subscribedShows)
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Image source={require('../assets/plus.png')} style={{
                  marginRight: 10,
                  height: 25,
                  width: 25
                }}/>
                <Text style={{
                  fontWeight: '800',
                  fontSize: 17,
                  color: '#666666'
                }}>
                  Add a New Playlist
                </Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

}

function mapStateToProps(state, ownProps) {
	return {
    subscribedShows: state.reducer.subscribedShows,
    playlists: state.reducer.playlists,
    nowPlaying: state.reducer.nowPlaying,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsScreen);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
