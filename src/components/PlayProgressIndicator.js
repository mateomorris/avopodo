import React from 'react';
import { View, Text, Dimensions, StyleSheet, Animated } from 'react-native'; 
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Bar } from 'react-native-progress';
import Slider from "react-native-slider";

export default class PlayProgressIndicator extends TrackPlayer.ProgressComponent {

    state = {
        sliderValue : 0
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


    render() {

        const { position, duration } = this.state;

        let trackProgress = this.getTrackProgress(position, duration)

        return (
            <View style={{
                width: '100%',
                height: 4, 
                backgroundColor: 'black'
            }}>
                <Animated.View style={{
                    backgroundColor: this.props.color,
                    width: `${trackProgress * 100}%`,
                    height: '100%',
                }}>
                </Animated.View>
                <View style={{ 
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: this.props.color,
                    opacity: 0.5
                }}>
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