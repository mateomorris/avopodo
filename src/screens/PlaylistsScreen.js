import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, TouchableWithoutFeedback, Animated } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import SvgUri from 'react-native-svg-uri';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer from 'react-native-track-player';

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

  state = {
    swiping : false,
    activelySwiped : null,
    favorites: [],
    playlists: [],
    homeFeed: [],
    newStationOpacity : new Animated.Value(0.35),
    newStationScale : new Animated.Value(1) 
  }

  componentDidMount() {
    this.props.actions.syncPlaylists()
  }

  _handleFavoritePress = () => {

  }

  _playAudio = (playlist) => {

    this.props.actions.toggleBufferingStatus(true)

    this.interval = setInterval(() => { 
        TrackPlayer.getBufferedPosition().then((buffered) => {
            TrackPlayer.getPosition().then((position) => {
            if (buffered > position) {
              clearInterval(this.interval);
              this.props.actions.toggleBufferingStatus(false)
            } 
          })
        })
    }, 500);
    
    this.props.actions.addPlaylistToQueue(playlist)
    // this.props.actions.toggleBufferingStatus(false)

  }

  _handlePlaylistEditPress = (playlist) => {
    Navigation.showOverlay({
      component: {
        name: 'example.PlaylistCreationScreen',
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
              // onLeftPress={() => {this._handlePlaylistDetailPress(item)}} 
              onPress={() => {this._handlePlaylistPlayPress(item)}}
              onQueuePress={() => {this._handlePlaylistDetailPress(item)}} 
              onEditPress={() => {this._handlePlaylistEditPress(item)}}
              onSwipe={() => {
                this.setState({
                  activelySwiped : index
                })
              }}
              swipeStatus={index == this.state.activelySwiped ? true : false}
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

          }, // simple serializable object that will pass as props to the lightbox (optional)
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
      
    } else {
      Alert.alert(
        `Stations are curated from your subscribed shows. Try subscribing to three shows before creating a Station.`, 
        `Apologies for the inconvenience`
      );
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

    let { subscribedShows } = this.props;

    return (
      <View style={{flex:1, overflow: 'visible', paddingTop: 10, backgroundColor: '#fafafa'}}>
        <ScrollView 
          contentContainerStyle={styles.container}
          onScrollBeginDrag={() => {
            this.setState({
              activelySwiped : null
            })
          }}
          scrollEnabled={this.state.swiping ? false : true}
        >
          {/* <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20, paddingLeft: 15, paddingTop: 10, paddingBottom: 10 }}>My Playlists</Text> */}
          <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 5, paddingRight: 5 }}>
            { this._renderPlaylists(this.props.playlists, this.props.nowPlaying, this.props.activePlaylist) }
            <TouchableView style={{
              backgroundColor: 'black',
              marginTop: 0,
              marginRight: 0,
              marginLeft: 0,
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#222',
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
              shadowRadius: 2,
              shadowOpacity: this.state.newStationOpacity,
              transform : [
                { scale : this.state.newStationScale }
              ]
            }} onInitialPress={() => {
              this.setState({
                swiping : true
              })
              this._handleNewStationInitialPress()
            }} onRelease={(completed) => {
              completed ?
              this._handleNewStationPress(this.props.subscribedShows) : 
              this._resetNewStationButton()

              this.setState({
                swiping : false
              })
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
                        fill={'#aaa'} 
                        fillAll={true}
                    />
                  <Text style={{
                    fontWeight: '800',
                    fontSize: 17,
                    color: '#eee',
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
    paddingLeft : 5,
    paddingRight: 5
  },
});
