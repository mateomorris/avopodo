import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import { MaterialIndicator } from 'react-native-indicators';

export default class PlaybackButton extends Component {

    state = {
        playing: null
    }

    render() {

        let { color, buffering }= this.props;

        return(
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity style={{ alignItems: 'center', paddingRight: 40, justifyContent: 'center', width: 50, height: 100, paddingLeft: 30 }} onPress={() => {this.props.onJumpBack()}}>
                    <Image style={{ height: 45, width: 45 }} source={require('../assets/skip-back.png')} resizeMode={'center'} />
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }} onPress={() => {this.props.onPlayPause()}}>
                    <MaterialIndicator color={ buffering ? 'transparent' : color } size={100} animationDuration={3000} />
                    <View style={{ 
                            position: 'absolute',
                            padding: 40, 
                            backgroundColor: color, 
                            height: 50, 
                            width: 50, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 500,
                            borderWidth: 10, 
                            borderColor: 'rgba(0,0,0,.1)',
                            zIndex: -1
                        }}>
                            <Image style={{ height: 35, width: 35 }} source={this.props.playbackStatus ? require('../assets/big-pause.png') : require('../assets/big-play.png')} resizeMode={'center'}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', paddingLeft: 40, justifyContent: 'center', width: 50, height: 100, paddingRight: 30 }} onPress={() => {this.props.onJumpForward()}}>
                    <Image style={{ height: 45, width: 45 }} source={require('../assets/skip-ahead.png')}  resizeMode={'center'} />
                </TouchableOpacity>
            </View>
        ) 
    }
}