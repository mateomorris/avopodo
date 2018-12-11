import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback, Animated } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import SvgUri from 'react-native-svg-uri';
import LinearGradient from 'react-native-linear-gradient';

import playlistIcons from 'assets/newPlaylistIcons'
import generalIcons from 'assets/generalIcons'

import { TouchableView } from 'components/Button'
import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import PlayBar from 'components/PlayBar';

import {animate} from 'helpers/animations'
import * as actions from 'actions'

class PlaylistsScreen extends React.Component {

  static options(passProps) {
    return {
      topBar: {
        noBorder: true,
        title: {
          text: 'Stations'
        },
        background: {
          color: '#fafafa',
          blur: true
        }
      }
    };
  }

  componentDidMount() {
    this.props.actions.syncPlaylists()
  }

  _handleFavoritePress = () => {

  }

  _playAudio = (playlist) => {
    
    this.props.actions.addPlaylistToQueue(playlist)
    // this.props.actions.toggleBufferingStatus(false)

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
            interceptTouchOutside: false
          }
        }
      }
    });
  }

  _handlePlaylistPlayPress = (playlist) => {

    if (playlist.id == this.props.activePlaylist.id) {
      this.props.actions.togglePlayback()
    } else {
      this._playAudio(playlist)
    }

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

  _renderPlaylists = (playlists, nowPlaying, nowPlayingPlaylist) => {
    return (
      <View>
        {playlists.map((item, index) => {
          return (
            <PlaylistThumbnail 
              key={index} 
              playing={this.props.state.playing}
              playlist={item}
              title={item.name} 
              duration={item.episodeQueue.episodeListDuration} 
              icon={playlistIcons[item.icon]} 
              episodes={item.episodeQueue.episodeList.length > 0 ? item.episodeQueue.episodeList : null} 
              currentPlaylist={nowPlayingPlaylist}
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

  _handleNewStationInitialPress = () => {
    animate([
      {
        property : this.state.newStationOpacity,
        toValue : 0
      },
      {
        property : this.state.newStationScale,
        toValue : 0.99
      }
    ])
  }

  _handleNewStationPress = () => {
    this._resetNewStationButton();

    if (this.props.subscribedShows.length >= 2) {

      Navigation.showOverlay({
        component: {
          name: 'example.PlaylistCreationScreen',
          passProps: { 
            subscribedShows : this.props.subscribedShows
          }, // simple serializable object that will pass as props to the lightbox (optional)
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
      
    } else {
      Alert.alert(`You must subscribe to at least three shows before creating a station`, `otherwise, what's the point?`);
    }
  }

  _resetNewStationButton = () => {
    animate([
      {
        property : this.state.newStationOpacity,
        toValue : 0.35
      },
      {
        property : this.state.newStationScale,
        toValue : 1
      }
    ])
  }

  handleViewRef = ref => this.view = ref;
  
  bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

  render() {

    this.state = {
      favorites: [],
      playlists: [],
      homeFeed: [],
      newStationOpacity : new Animated.Value(0.35),
      newStationScale : new Animated.Value(1)
    };

    let { subscribedShows } = this.props;

    return (
      <View style={{flex:1, overflow: 'visible', paddingTop: 10, backgroundColor: '#fafafa'}}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20, paddingLeft: 15, paddingTop: 10, paddingBottom: 10 }}>My Playlists</Text> */}
          <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 10, paddingRight: 10 }}>
            { this._renderPlaylists(this.props.playlists, this.props.nowPlaying, this.props.activePlaylist) }
            <TouchableView style={{
              backgroundColor: 'black',
              marginTop: 10,
              marginRight: 5,
              marginLeft: 5,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#D8D8D8',
              position: 'relative',
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 27,
              paddingRight: 15,
              borderRadius: 5,
              overflow: 'visible',
              shadowColor: 'black',
              shadowOffset: {
                  width: 0,
                  height: 0
              },
              shadowRadius: 3,
              shadowOpacity: this.state.newStationOpacity,
              transform : [
                { scale : this.state.newStationScale }
              ]
            }} onInitialPress={() => {
              this._handleNewStationInitialPress()
            }} onRelease={(completed) => {
              completed ?
              this._handleNewStationPress(this.props.subscribedShows) : 
              this._resetNewStationButton()
            }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                    <SvgUri 
                        style={{ 
                          paddingRight: 5
                        }} 
                        width="20" 
                        height="20" 
                        svgXmlData={generalIcons['station']} 
                        fill={'#444'} 
                        fillAll={true}
                    />
                  <Text style={{
                    fontWeight: '800',
                    fontSize: 17,
                    color: '#444',
                    paddingLeft: 7
                  }}>
                    Create New Station
                  </Text>
                </View>
              </TouchableView>
          </View>
        </ScrollView>
      </View>
    );
  }

}

function mapStateToProps(state, ownProps) {
	return {
    subscribedShows: state.subscribedShows,
    playlists: state.playlists,
    nowPlaying: state.nowPlaying,
    activePlaylist : state.activePlaylist,
    state
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
