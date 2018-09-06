import React from 'react';
import { View, Text, Dimensions } from 'react-native'; 
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import { Bar } from 'react-native-progress';

export default class PlayProgressBar extends TrackPlayer.ProgressComponent {

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

        if (position) {
            this.props.onProgressUpdate(Math.floor(position));
        } 

        if (trackProgress >= 0.999) {
            this.playNextEpisode(this.props.playingNextEpisode); // "do something" happens
        } else if (trackProgress <= 0.01) {
            this.startNewEpisode(this.props.playingNextEpisode)
        }

        return (
            <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Bar
                    width={Dimensions.get('window').width - 100}
                    progress={trackProgress}
                    color={'white'}
                    unfilledColor={'rgb(34,28,28)'}
                    borderWidth={0}
                    height={3}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Dimensions.get('window').width - 100, paddingTop: 10 }}>
                    <Text style={{ fontSize: 12, color: '#93A8B3' }}>{this.formatTime(position)}</Text>
                    <Text style={{ fontSize: 12, color: '#93A8B3' }}>{this.formatTime(duration)}</Text>
                </View>
            </View>
        );
    }
    
}