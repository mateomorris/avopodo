import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, NetInfo, RefreshControl } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { Navigation } from "react-native-navigation";

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';
import PlayBar from '../components/PlayBar';

import trackDetails from '../utilities/tracks';

import TrackPlayer from 'react-native-track-player';

import * as specialActions from '../redux/actions'

import { WebView } from 'react-native';
import { LoadingIndicator } from '../components/SimpleComponents';

class HomeScreen extends React.Component {

  state = {
    refreshing: false,
    buffered: false,
    active: false,
    playing: false, 
    nowPlaying: {},
    initialPlay: null,
    dataSource: null,
    favorites: [],
    playlists: [],
    homeFeed: null
  };

  _handleFavoritePress = () => {

  }

  _handlePlaylistPress = () => {

  }

  _initialPlay = ( show, episode ) => {
    console.log('Playing episode from beginning');
    var track = trackDetails(episode);
    TrackPlayer.reset();
    TrackPlayer.add([track]).then(function() {
        TrackPlayer.play();
    });
  }

  _checkForPlaybackStatus = ( show, episode ) => {
      console.log('Checking for playback status')
      if (this.props.state.initialPlay) {
          console.log('Playing initial episode');
          this._initialPlay(show, episode);
      } else if ( this.props.state.playing ) {
          console.log('Playing episode');
          TrackPlayer.setupPlayer().then(() => {
            TrackPlayer.play();
          })
      } else {
          console.log('Pausing episode');
          TrackPlayer.pause();
      }
  }

  _handleEpisodeThumbnailPress = (episode) => {

    let show = {
      title: episode.showTitle,
      image: episode.showImage,
      color: episode.showColor,
      description: episode.showImageHighRes,
      imageHighRes: episode.showImageHighRes
    }
    
    this.props.actions.addToQueueFrontAndPlayEpisode(show, episode);

  }

  _handleEpisodeDetailPress = (episode) => {

    Navigation.showOverlay({
      component: {
        name: 'example.EpisodeDetailScreen',
        passProps: { 
          episode,
          playing : this.props.state.nowPlaying.id == episode.id ? true : false,
          onPlayPress : () => {this._handleEpisodeThumbnailPress(episode)}
        }, // simple serializable object that will pass as props to the lightbox (optional)
        options: {
          overlay: {
            interceptTouchOutside: true
          }
        }
      }
    });

  }

  componentWillMount = () => {

    this.props.actions.startPlayer();
        
    // this.setState({
    //     nowPlaying: this.props.state.nowPlaying,
    //     playing: this.props.state.playing,
    // }, () => {
    //     this._checkForPlaybackStatus( this.props.state.nowPlaying.show, this.props.state.nowPlaying.episode );
    // });
  }

  componentDidMount() {
    // this.props.actions.setupPlayer();

    // Activate playbar
    Navigation.showOverlay({
        component: {
            name: 'example.PlayBar',
            options: {
                overlay: {
                    interceptTouchOutside: false
                }
            }
        }
    });


    if ('id' in this.props.state.nowPlaying) {
      console.log('An episode is currently playing')
      let currentTrackEpisodeId = this.props.state.nowPlaying.id;
      // this.props.actions.setCurrentTrackPosition(currentTrackEpisodeId);
    } else {
      console.log('No episode is currently playing')
    }

    // TODO: Offline functionality
    NetInfo.getConnectionInfo().then((connectionInfo) => {

    });

    // this.props.actions.getNewestFromSubscribed();
    this._onRefresh()
    // this._getNewestFromSubscribed()

    // #TODO: Clean playQueue by removing played tracks
  }

  _getNewestFromSubscribed = () => {
    this.props.actions.getNewestFromSubscribed()
    this.props.actions.getNewestFromSubscribed().then((results) => {
      let episodeList = results.map((episodeList) => {
        // console.log(episodeList.episodeList[0].showId, this.props.state)
        let highResArt = this.props.state.subscribedShows.find((show) => {
          if (show.id == episodeList[0].showId) {
            return show
          }
        }).imageHighRes || null
        episodeList[0]['showImageHighRes'] = highResArt
        return episodeList[0]
      }).sort((a,b) => {
        return b.publishDate - a.publishDate 
      })
      this.setState({
        homeFeed : episodeList,
        refreshing: addToQueueFrontAndPlayEpisode
      })
    })
  }


  _bufferingCheckInterval = () => {
    this.interval = setInterval(() => { 
      this._checkIfBuffering()
    }, 1000);
  }

  _checkIfBuffering = () => {
    // this._getBufferStatus()
    TrackPlayer.getBufferedPosition().then((buffered) => {
      TrackPlayer.getPosition().then((position) => {
      if (buffered > position) {
        clearInterval(this.interval);
        // this.setState({
        //   buffered: true
        // }, () => {
        //   Alert.alert('Buffered');
        // });
        Alert.alert('Buffered');
        this.props.actions.toggleBufferingStatus(true);
      }
    })
  })
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

  _renderPlaylists = (playlists) => {
    return (
      <View style={{ flexDirection: 'column', flex: 1}}>
        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20 }}>Continue Listening</Text>
        {playlists.map((item, index) => {
          return (
            <PlaylistThumbnail key={index} title={item.title} duration={item.duration} icon={item.icon} episodes={item.episodes}/>
          )
        })}
      </View>
    );
  }

  _renderHomeFeed = (episodes) => {
    // Get list from redux store instead of local state
    if (episodes) {
      return (
        <View style={{flex: 1}}>
          <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20 }}>Newest from Subscribed</Text>
          {
            episodes.filter((episode) => {
              if (episode && !this.props.state.finishedEpisodes.find(matchingEpisode => matchingEpisode == episode.id)) {
                return episode
              }
            }).map((episode, index) => {
              return (
                <EpisodeSnippet 
                  key={index}
                  data={episode}
                  onThumbnailPress={() => this._handleEpisodeThumbnailPress(episode)}
                  onDetailPress={() => this._handleEpisodeDetailPress(episode)}
                />
              )
            })
          }
        </View>
      );
    } else {
      return <LoadingIndicator />
    }
  }

  _renderPopularFeed = () => {
    return (
      <View style={{flex:1}}>
        <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20 }}>Popular New Episodes</Text>
        <Text>This is the popular feed</Text>
      </View>
    )
  }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.props.actions.getNewestFromSubscribed().then((fetchSuccessful) => {
          if (fetchSuccessful) {
            setTimeout(() => {
                this.setState({refreshing: false}
            )}, 1000)
          } 
        })
    }

  render() {

    let { nowPlaying, playing } = this.props.state
    let { togglePlayback } = this.props.actions

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <ScrollView 
          contentContainerStyle={[styles.container, { paddingBottom: this.props.state.active ? 45 : 0 }]}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
              />
          }
        >
          {/* { this._renderPlaylists(this.state.playlists) } */}
          { this.props.state.subscribedShows.length > 0 ? this._renderHomeFeed(this.props.state.newestFromSubscribed) : null }
        </ScrollView>
        {/* <PlayBar nav={Navigation}/> */}
      </View>
    );
  }

  static navigatorStyle = {
  };

}


function mapStateToProps(state, ownProps) {
	return {
		state: state.reducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(specialActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
});
