import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import { MaterialIndicator } from 'react-native-indicators';

export default class PlaybackButton extends Component {

    state = {
        playing: null,
        SVGs: {
            pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>button-pause-1</title><path fill="black" d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm5,16a1,1,0,0,1-1,1H14a1,1,0,0,1-1-1V8a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1ZM11,8v8a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8A1,1,0,0,1,8,7h2A1,1,0,0,1,11,8Z"/></svg>`,
            play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>button-play</title><path fill="black" d="M12,24A12,12,0,1,0,0,12,12.013,12.013,0,0,0,12,24Zm4.812-11.5a.939.939,0,0,1-.587.824L10.14,16.366a1.185,1.185,0,0,1-.531.133.919.919,0,0,1-.488-.136,1.032,1.032,0,0,1-.459-.911V9.546a.974.974,0,0,1,1.478-.914l6.085,3.043A.939.939,0,0,1,16.812,12.5Z"/></svg>`
        }
    }

    render() {

        let { color, buffering }= this.props;

        return(
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity style={{ alignItems: 'center', paddingRight: 40, justifyContent: 'center', width: 50, height: 100, paddingLeft: 30 }} onPress={() => {this.props.onJumpBack()}}>
                    <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, right: 40 }}>15</Text>
                    {
                        <SvgUri  style={{transform: [{ rotate: '90deg'},{ translateY: 35 }] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 150, height: 150 }} onPress={() => {this.props.onPlayPause()}}>
                    <MaterialIndicator color={ buffering ? color : 'transparent' } size={150} animationDuration={3000} style={{
                        position: 'absolute',
                        top: 0,
                    }}/>
                    <View style={{ 
                        borderRadius: 500,
                        // position: 'absolute', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 110, 
                        width: 110, 
                        backgroundColor: `${color}`,
                        position: 'absolute',
                        top: 20,
                    }}>
                        {
                            <SvgUri style={{ 
                                backgroundColor: 'white', 
                                height: 50, 
                                width: 50, 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                borderRadius: 500,
                                zIndex: 0,
                            }} width="90" height="90" svgXmlData={this.props.playbackStatus ? this.state.SVGs.pause : this.state.SVGs.play } fill={color} fillAll={true}/>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', paddingLeft: 40, justifyContent: 'center', width: 50, height: 100, paddingRight: 30 }} onPress={() => {this.props.onJumpForward()}}>
                    {
                        <SvgUri style={{transform: [{ rotateX: '-180deg' },{ rotate: '-90deg' },{ translateY: 35 }] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                    }
                    <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, left: 40 }}>15</Text>
                    {/* <Image style={{ height: 45, width: 45 }} source={require('../assets/skip-ahead.png')}  resizeMode={'center'} /> */}
                </TouchableOpacity>
            </View>
        ) 
    }
}