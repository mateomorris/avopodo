import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions, AppState } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Carousel from 'react-native-snap-carousel';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import { Navigation } from "react-native-navigation";

import ShowThumbnail from '../components/ShowThumbnail';
import PlayProgressBar from '../components/PlayProgressBar';
import PlayBackButtons from '../components/PlaybackButtons';

import * as actions from '../redux/actions'
import NowPlayingHeader from '../components/NowPlayingHeader';

class PlayingScreen extends React.Component {

  state = {
    artworks: [],
    playingNextEpisode : false,
    appState: AppState.currentState
  }

  _handleFavoritePress = () => {

  }

  _handlePlaybackStep = async (change) => {
    await TrackPlayer.getPosition().then((position) => {
      TrackPlayer.seekTo(position + change);
    })
  }

  componentWillMount = () => {
    // let currentTrackEpisodeId = this.props.state.nowPlaying.episode.id;
    // this.props.actions.setCurrentTrackPosition(currentTrackEpisodeId);
  }


  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.props.actions.syncQueue()
    } else {
      console.log('App in background')
    }
    this.setState({appState: nextAppState});
  }

  _renderFavorites = (favorites) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', flex: 1}}>
        {favorites.map((item, index) => {
          return (
            <ShowThumbnail art={item.image} key={index} onPress={() => { 
              Navigation.push({
                screen: 'example.ShowDetailScreen',
                title: item.title,
                backButtonTitle: '',
                passProps: item
              });
          }}/>
          )
        })}
      </View>
    );
  }

  _renderItem ({item, index}) {
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <Image source={{ uri: item.showImage }} style={{ height: '100%', width: '100%'}} resizeMode={'contain'}/>
        </View>
    );
  }

  _playNextItemInQueue = (index) => {
    this.props.actions.playNextItemInQueue(index);
  }

  _markEpisodeAsPlayed = (episodeId, carousel) => {
      console.log('Marking episode as played, playing next')
      carousel.snapToNext() // handles playing the next track 
      this.props.actions.markEpisodeAsPlayed(episodeId)
      this.setState({
        playingNextEpisode : true
      })
  }

  _startNewTrack = () => {
    this.setState({
      playingNextEpisode : false
    })
  }
  
  _onPlaylistPress = () => {

    Navigation.showOverlay({
      component: {
        name: 'example.QueueScreen',
        passProps: { 
          playlist : this.props.state.activePlaylist,
          queue : this.props.state.playQueue.slice(this.props.state.playQueue.map(e => e.id).indexOf(this.props.state.nowPlaying.id)) // Just return queue starting with episode currently playing
        }, // simple serializable object that will pass as props to the lightbox (optional)
        options: {
          overlay: {
            interceptTouchOutside: true
          }
        }
      }
    });

  }

  render() {

    let { nowPlaying, playing, active, activePlaylist, playQueue, bufferingStatus, activeQueueItem } = this.props.state
    let { togglePlayback, updateEpisodePlaybackPosition, markEpisodeAsPlayed } = this.props.actions

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      active &&
      <View style={{
          backgroundColor: 'black',
          flex: 1
      }}>
        <NowPlayingHeader 
          componentId={this.props.componentId} 
          label={activePlaylist}
          onPlaylistPress={() => { this._onPlaylistPress() }}
        />
        <GestureRecognizer
        onSwipeDown={() => { Navigation.dismissModal(this.props.componentId); }}
        config={config}
        style={{
          flex: 1
        }}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            layout={'stack'} 
            layoutCardOffset={`18`} 
            onBeforeSnapToItem={(index) => {
              this._playNextItemInQueue(index)}}
              // NEXT: Set state playingNextEpisode back to false
            data={playQueue}
            renderItem={this._renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width-50}
            itemHeight={Dimensions.get('window').width }
            sliderHeight={Dimensions.get('window').width}
            firstItem={activeQueueItem}
          />
        </GestureRecognizer>

        <View style={{
          flex: 1,
          paddingTop: 30
        }}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <View style={{ flex: 1, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center'}}>
              {/* <Text style={{color:'white', fontSize: 20, fontWeight: '700', textAlign: 'center', height: 25, marginLeft: 10, marginRight: 10}}>{nowPlaying.title}</Text> */}
              <MarqueeText
              style={{ color:'white', fontSize: 20, fontWeight: '700', textAlign: 'center', height: 25 }}
              marqueeOnStart
              loop={false}
              marqueeDelay={5000}
              marqueeResetDelay={1000}
              >
                {nowPlaying.title}
              </MarqueeText>
              <Text style={{color:'#93A8B3', textAlign: 'center'}}>{nowPlaying.showTitle}</Text>
            </View>
            {/* <TouchableOpacity style={{ position: 'absolute', right: 30 }}>
              <Text style={{ color: 'gray', fontSize: 30 }}>...</Text>
            </TouchableOpacity> */}
          </View>
          <PlayProgressBar 
            onProgressUpdate={(position) => {
              updateEpisodePlaybackPosition(nowPlaying.id, position);
            }} 
            onFinishTrack={() => { 
              // Dispatch action to mark the track as played
              this._markEpisodeAsPlayed(nowPlaying.id, this._carousel)
            }}
            onStartNewTrack={() => {
              this._startNewTrack()
            }}
            playingNextEpisode={this.state.playingNextEpisode}
          />
          <View>
            <PlayBackButtons 
              color={nowPlaying.showColor}
              playbackStatus={playing}
              onPlayPause={() => { togglePlayback() }} 
              onJumpBack={() => { this._handlePlaybackStep(-15) }} 
              onJumpForward={() => { this._handlePlaybackStep(15) }}
              buffering={bufferingStatus}
            />
          </View>
        </View>
      </View>
      || null
    );
  }

    static navigatorStyle = {
        statusBarTextColorScheme: 'light', // text color of status bar, 'dark' / 'light' (remembered across pushes)
        navBarHidden: true
    };

}

function mapStateToProps(state, ownProps) {
	return {
		state: state.reducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
});
