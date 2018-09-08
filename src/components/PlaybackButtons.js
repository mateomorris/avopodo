import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import SvgUri from 'react-native-svg-uri';

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
                    <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, right: 40 }}>15</Text>
                    <SvgUri  style={{transform: [{ rotate: '90deg'},{ translateY: 35 }] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }} onPress={() => {this.props.onPlayPause()}}>
                    <MaterialIndicator color={ buffering ? color : 'transparent' } size={100} animationDuration={3000} />
                    <View style={{ 
                        borderRadius: 500,
                        position: 'absolute', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 100, 
                        width: 100, 
                        backgroundColor: `${color}88`,
                    }}>
                        <SvgUri style={{ 
                            backgroundColor: 'white', 
                            height: 50, 
                            width: 50, 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 500,
                            zIndex: -1,
                        }} width="80" height="80" source={this.props.playbackStatus ? require('../assets/interface-icons/pause.svg') : require('../assets/interface-icons/play.svg')} fill={color} fillAll={true}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', paddingLeft: 40, justifyContent: 'center', width: 50, height: 100, paddingRight: 30 }} onPress={() => {this.props.onJumpForward()}}>
                    <SvgUri style={{transform: [{ rotateX: '-180deg' },{ rotate: '-90deg' },{ translateY: 35 }] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                    <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, left: 40 }}>15</Text>
                    {/* <Image style={{ height: 45, width: 45 }} source={require('../assets/skip-ahead.png')}  resizeMode={'center'} /> */}
                </TouchableOpacity>
            </View>
        ) 
    }
}