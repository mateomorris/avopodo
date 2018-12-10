import React from 'react';
import { View, Text, Dimensions, StyleSheet, Animated } from 'react-native'; 
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Bar } from 'react-native-progress';
import Slider from "react-native-slider";

import { animate } from 'helpers/animations';

export default class PlayProgressBar extends TrackPlayer.ProgressComponent {

    state = {
        sliderValue : 0,
        timeTellerPosition : 0,
        timeTellerOpacity : new Animated.Value(0),
        width : 0
    }

    formatTime(seconds) {
        return seconds > 3600 
        ?
          [
            parseInt(seconds / 60 / 60),
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
          ].join(":").replace(/\b(\d)\b/g, "0$1")
        :
          [
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
          ].join(":").replace(/\b(\d)\b/g, "0$1")
    }

    getTrackProgress = (position, duration) => {
        if (position) {
            return position / duration
        } else {
            return 0
        }
    }

    _onFinishTrack =() => {
        this.props.onFinishTrack()
    }

    _onStartNewTrack = () => {
        this.props.onStartNewTrack()
    }

    playNextEpisode = (function() {
        // var executed = false;
        return function(playingNextEpisode) {
            if (!playingNextEpisode) {
                this._onFinishTrack()
            } 
        };
    })();

    startNewEpisode = (function() {
        // var executed = false;
        return function(playingNextEpisode) {
            if (playingNextEpisode) {
                this._onStartNewTrack()
            } 
        };
    })();

    componentDidUpdate () {
        if (this.state.position > 0) {
            this.props.onProgressUpdate(Math.floor(this.state.position));
        }
    }

  onLayout = (e) => {
    this.setState({
      width: e.nativeEvent.layout.width
    })
  }

    render() {

        const { position, duration, bufferedPosition, sliderTimePosition, sliderValue } = this.state;

        let trackProgress = this.getTrackProgress(position, duration)

        return (
            <View style={{ 
                padding: 20, 
                paddingTop: 10, 
                paddingBottom: 0, 
                justifyContent: 'center', 
                alignItems: 'center', 
                width : Dimensions.get('window').width - 100
            }} onLayout={this.onLayout}>
                <Animated.View style={{
                    position: 'absolute',
                    flex: 1,
                    left : 0,
                    bottom : 80,
                    backgroundColor: this.props.color,
                    padding: 10,
                    borderRadius : 500,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.75,
                    opacity : this.state.timeTellerOpacity,
                    transform : [
                        {
                            translateX : this.state.timeTellerPosition
                        }
                    ]
                }}>
                    <Text style={{
                        color: this.props.textColor,
                        fontWeight: '600'
                    }}>{ sliderTimePosition }</Text>
                </Animated.View>
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: 3,
                        width: `${(bufferedPosition / duration) * 100}%`,
                        backgroundColor: `${this.props.color}40`,
                        position: 'absolute',
                        left : 0
                    }}>
                    </View>
                    <Slider
                        style={{
                            width: '100%',
                        }}
                        trackStyle={[scrubber.track, {
                            backgroundColor: 'rgba(250,250,250,0.1)'
                        }]}
                        thumbStyle={[scrubber.thumb, {
                            backgroundColor: this.props.color,
                            shadowColor: this.props.color,
                            shadowOpacity: 0.5
                        }]}
                        minimumTrackTintColor={this.props.color}
                        thumbTouchSize={{width: 50, height: 40}}
                        value={this.state.settingtime ? sliderValue : trackProgress}
                        onValueChange={(value) => {
                            animate([
                                {
                                    property : this.state.timeTellerOpacity,
                                    toValue : 1,
                                    speed : 200
                                }
                            ])
                            this.setState({ 
                                settingtime : true, 
                                sliderTimePosition : this.formatTime(duration * value),
                                sliderValue : value,
                                timeTellerPosition : value * (this.state.width - 50)
                            })
                        }}
                        onSlidingComplete={() => {
                            animate([
                                {
                                    property : this.state.timeTellerOpacity,
                                    toValue : 0
                                }
                            ])
                            setTimeout(() => {
                                this.setState({
                                    settingtime : false
                                })
                            }, 1000)
                            TrackPlayer.getPosition().then((position) => {
                                // new position = total duration (in seconds) * new percentage / total percentage (1)
                                let newPosition = Math.floor(duration * this.state.sliderValue) || null
                                if (newPosition && trackProgress) {
                                    TrackPlayer.seekTo(position * this.state.sliderValue / trackProgress);
                                } 
                            })
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 10 }}>
                    <Text style={{ fontSize: 12, color: '#93A8B3' }}>{this.formatTime(position)}</Text>
                    <Text style={{ fontSize: 12, color: '#93A8B3' }}>{this.formatTime(duration)}</Text>
                </View>
            </View>
        );
    }
    
}


var scrubber = StyleSheet.create({
  container: {
    height: 30,
  },
  track: {
    height: 2
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  }
});