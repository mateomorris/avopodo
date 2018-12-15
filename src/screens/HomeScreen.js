import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, NetInfo, RefreshControl, FlatList } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import SvgUri from 'react-native-svg-uri';

import { Navigation } from "react-native-navigation";

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import PlayBar from 'components/PlayBar';
import { Headline } from 'components/Headline';

import trackDetails from '../utilities/tracks';

import TrackPlayer from 'react-native-track-player';

import * as specialActions from 'actions'

import { WebView } from 'react-native';
import { LoadingIndicator } from 'components/SimpleComponents';

import OfflineBanner from 'components/OfflineBanner';

export class HomeScreen extends React.Component {

  static options(passProps) {
    return {
      topBar: {
        noBorder: true,
        title: {
          text: 'Home'
        },
        background: {
          color: '#fafafa',
          blur: true
        }
      }
    };
  }

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

    if (this.props.nowPlaying.id == episode.id) { // if already playing
      this.props.actions.togglePlayback()
    } else {
      let show = {
        title: episode.showTitle,
        image: episode.showImage,
        color: episode.showColor,
        description: episode.showImageHighRes,
        imageHighRes: episode.showImageHighRes
      }
      this.props.actions.addToQueueFrontAndPlayEpisode(show, episode); // reactivate
    }

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
            interceptTouchOutside: false
          }
        }
      }
    });

  }

  componentWillMount = () => {

    this.props.actions.startPlayer(); // reactivate

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

    // Active Offline Indicator
    Navigation.showOverlay({
        component: {
            name: 'example.OfflineBanner',
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
    // NetInfo.getConnectionInfo().then((connectionInfo) => {

    // });

    this._onRefresh()

    // #TODO: Clean playQueue by removing played tracks
  }

  _getNewestFromSubscribed = () => {
    // this.props.actions.getNewestFromSubscribed() // reactivate
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
    }) // reactivate
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
        this.props.actions.toggleBufferingStatus(true); // reactivate
      }
    })
  })
}

  _renderFavorites = (favorites) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {favorites.map((item, index) => {
          return (
            <ShowThumbnail 
              art={item.art} 
              key={index} 
            />
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
          <Headline 
            text={'Newest from Subscribed'}
            style={{
              marginTop: 0,
              marginBottom: 10,
            }}
          />
          <FlatList 
            data={
              episodes.filter((episode) => {
                if (episode && !this.props.state.finishedEpisodes.find(matchingEpisode => matchingEpisode == episode.id)) {
                  return episode
                }
              })
            }
            extraData={this.props.state}
            keyExtractor={(item, index) => item.id}
            initialNumToRender={5}
            renderItem={({item}) => {
              let isActive = this.props.nowPlaying.id == item.id ? true : false
              return (
                <EpisodeSnippet 
                  data={item}
                  onThumbnailPress={() => this._handleEpisodeThumbnailPress(item)}
                  onDetailPress={() => this._handleEpisodeDetailPress(item)}
                  active={isActive}
                  playing={this.props.playing}
                />
              )
            }}
          />
        </View>
      );
    } else {
      return <LoadingIndicator />
    }
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
      {
        this.props.state.subscribedShows.length == 0 &&
        <View style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0, right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 50,
          paddingTop: 0
        }}>
          <Image 
            source={require('assets/avopodo.png')}
            style={{
              width: 150,
              height: 150
            }}
          />
          <Text style={{
            fontWeight: '700',
            fontSize: 18,
            textAlign: 'center'
          }}>Press 'Discover' to find your old favorites and new favorites</Text>
        </View>
      }
      {
        this.props.state.subscribedShows.length > 0 &&
        <ScrollView 
          contentContainerStyle={[styles.container, { paddingBottom: this.props.state.active ? 45 : 0 }]}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
              />
          }
        >
          { this.props.state.subscribedShows.length > 0 ? this._renderHomeFeed(this.props.state.newestFromSubscribed) : null }
        </ScrollView>
      }
      </View>
    );
  }

  static navigatorStyle = {
  };

}


function mapStateToProps(state, ownProps) {
	return {
		state: state,
    nowPlaying : state.nowPlaying,
    playing : state.playing
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
