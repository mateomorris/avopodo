import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions, AppState, Animated } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BlurView } from 'react-native-blur';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Carousel from 'react-native-snap-carousel';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import MarqueeText from 'react-native-marquee';
import { Navigation } from "react-native-navigation";
import firebase from 'react-native-firebase';

import ShowThumbnail from '../components/ShowThumbnail';
import PlayProgressBar from '../components/PlayProgressBar';
import PlayBackButtons from '../components/PlaybackButtons';

import * as actions from '../redux/actions'
import NowPlayingHeader from '../components/NowPlayingHeader';

class PlayingScreen extends React.Component {

  state = {
    visible : false,
    artworks: [],
    playingNextEpisode : false,
    appState: AppState.currentState,
    loadedImages: {
      0 : new Animated.Value(1), 
      1 : new Animated.Value(1), 
      2 : new Animated.Value(1)
    },
    carouselActive : false,
  }

  _handleFavoritePress = () => {

  }

  _handlePlaybackStep = async (change) => {
    await TrackPlayer.getPosition().then((position) => {

      firebase.analytics().logEvent('seek_15', {
          direction: change > 0 ? 'forward' : 'backward'
      }) 

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

  componentDidUpdate() {
      if (this.props.expanded && !this.state.carouselActive) { // Expanded AND carousel is inactive -> set to visible
          this._openCarousel()
      } else if (!this.props.expanded && this.state.carouselActive) { // Unexpanded AND carousel is active -> close carousel
          this._closeCarousel()
      }
  }


  _openCarousel = () => {
    setTimeout(() => {
      this.setState({carouselActive: true}
    )}, 0)
  }

  _closeCarousel = () => {
    this.state.loadedImages[0].setValue(1)
    this.state.loadedImages[1].setValue(1)
    this.state.loadedImages[2].setValue(1)

    this.setState({
      carouselActive : false
    })
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.actions.syncPlayer()
    } else {
      console.log('In background')
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
      <Animated.View style={{ justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: 5, backgroundColor: item.showColor}}>
        <Animated.View
          style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0, right: 0,
              zIndex: 9,
              opacity: index <= 2 ? this.state.loadedImages[index] : 0
          }}>
            <BlurView
              style={{ flex: 1 }}
              viewRef={this.state.viewRef}
              blurType="dark"
              blurAmount={10}
          />
        </Animated.View>
        <Image onLoad={() => {
          // Show Carousel
          if (index <= 2) {
            Animated.timing(this.state.loadedImages[index], {
                toValue: 0,
                duration: 500,
                delay: 0,
            }).start()
          }
        }} source={{ uri: item.showImage, cache: 'force-cache' }} style={{ height: '100%', width: '100%' }} resizeMode={'contain'} />
      </Animated.View>
    );
  }

  _playNextItemInQueue = (index) => {
    this.props.actions.playNextItemInQueue(index)
  }

  _markEpisodeAsPlayed = (episodeId, carousel) => {
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
          playlist={activePlaylist}
          onPress={() => { this.props.onClose() }}
          onPlaylistPress={() => { this._onPlaylistPress() }}
        />
        <GestureRecognizer
        onSwipeDown={() => {
            this.props.onClose()
         }}
        config={config}
        style={{
          flex: 1,
          paddingTop: 10,
          paddingBottom: 25
        }}>
          {
            this.props.expanded &&
            this.state.carouselActive &&
            <Carousel
              ref={(c) => { this._carousel = c; }}
              layout={'stack'} 
              layoutCardOffset={`18`} 
              onBeforeSnapToItem={(index) => {
                this._playNextItemInQueue(index)}}
                // NEXT: Set state playingNextEpisode back to false
              data={this.props.state.playQueue}
              renderItem={this._renderItem.bind(this)}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 100 }
              itemHeight={Dimensions.get('window').width - 50 }
              // firstItem={activeQueueItem}
            />
          }
        </GestureRecognizer>

        <View style={{
          flex: 1
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
            color={nowPlaying.showColor}
            onProgressUpdate={(position) => {
              updateEpisodePlaybackPosition(nowPlaying.id, position);
            }} 
            onFinishTrack={() => { 
              // Dispatch action to mark the track as played
              console.log('ON FINISH TRACK')
              // this._markEpisodeAsPlayed(nowPlaying.id, this._carousel)
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
