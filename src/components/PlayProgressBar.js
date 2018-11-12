import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native'; 
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Bar } from 'react-native-progress';
import Slider from "react-native-slider";

export default class PlayProgressBar extends TrackPlayer.ProgressComponent {

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

    componentDidUpdate () {
        if (this.state.position > 0) {
            this.props.onProgressUpdate(Math.floor(this.state.position));
        }
    }

    render() {

        const { position, duration } = this.state;

        let trackProgress = this.getTrackProgress(position, duration)

        // if (position) {
        //     this.props.onProgressUpdate(Math.floor(position));
        // } 

        if (trackProgress >= 0.999) {
            this.playNextEpisode(this.props.playingNextEpisode); // "do something" happens
        } else if (trackProgress <= 0.01) {
            this.startNewEpisode(this.props.playingNextEpisode)
        }

        return (
            <View style={{ padding: 20, paddingTop: 10, paddingBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                {/* <Bar
                    width={Dimensions.get('window').width - 100}
                    progress={trackProgress}
                    color={'white'}
                    unfilledColor={'rgb(34,28,28)'}
                    borderWidth={0}
                    height={3}
                /> */}
                {/* <Slider
                style={{
                    width: Dimensions.get('window').width - 50 ,
                    backgroundColor: 'blue'
                }}
                value={this.state.sliderValue}
                onValueChange={value => this.setState({ sliderValue : value })}
                /> */}
                <Slider
                    style={{
                        width: Dimensions.get('window').width - 100 ,
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
                    value={trackProgress}
                    onValueChange={value => this.setState({ sliderValue : value })}
                    onSlidingComplete={() => {
                        TrackPlayer.getPosition().then((position) => {
                            // new position = total duration (in seconds) * new percentage / total percentage (1)
                            let newPosition = Math.floor(duration * this.state.sliderValue) || null

                            console.log(newPosition)
                            if (newPosition) {
                                console.log(`TrackPlayer seeking to `, position * this.state.sliderValue / trackProgress)
                                TrackPlayer.seekTo(position * this.state.sliderValue / trackProgress);
                            } 
                        })
                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Dimensions.get('window').width - 100, paddingTop: 10 }}>
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