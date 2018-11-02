import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import SvgUri from 'react-native-svg-uri';

import { MaterialIndicator } from 'react-native-indicators';

export default class PlaybackButton extends Component {

    state = {
        playing: null,
        SVGs: {
            pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="#ffffff"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M14,19c0,0.552-0.448,1-1,1 s-1-0.448-1-1v-8c0-0.552,0.448-1,1-1s1,0.448,1,1V19z M18,19c0,0.552-0.448,1-1,1s-1-0.448-1-1v-8c0-0.552,0.448-1,1-1s1,0.448,1,1 V19z" fill="#ffffff"/></svg>`,
            play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="#ffffff"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M20.304,15.402l-7.608,4.392 C12.313,20.015,12,19.834,12,19.392v-8.785c0-0.442,0.313-0.623,0.696-0.402l7.608,4.392C20.687,14.819,20.687,15.181,20.304,15.402 z" fill="#ffffff"/></svg>`
        }
    }

    render() {

        let { color, buffering }= this.props;

        return(
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity style={{ alignItems: 'flex-end', justifyContent: 'center', width: 100, height: 100, marginTop: 20 }} onPress={() => {this.props.onJumpBack()}}>
                    {/* <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, right: 40 }}>15</Text> */}
                    {/* <Image style={{ height: 40, width: 40 }} source={require('../assets/skip-back.png')} /> */}
                    <SvgUri style={{}} width="50" height="50" source={require('../assets/interface-icons/seek-back.svg')} fill={'#EEE'} fillAll={true}/>
                    {/* {
                        <SvgUri  style={{transform: [{ rotate: '90deg'}] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                    } */}
                </TouchableOpacity>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 150, height: 150 }} onPress={() => {this.props.onPlayPause()}}>
                    <MaterialIndicator color={ buffering ? color : 'transparent' } size={110} animationDuration={3000} style={{
                        position: 'absolute',
                        top: 20,
                    }}/>
                    <View style={{ 
                        borderRadius: 500,
                        // position: 'absolute', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 110, 
                        width: 110, 
                        backgroundColor: `${color}7F`,
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
                            }} width="110" height="110" svgXmlData={this.props.playbackStatus ? this.state.SVGs.pause : this.state.SVGs.play } fill={color} fillAll={true}/>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'flex-start', justifyContent: 'center', width: 100, height: 100, paddingRight: 30, marginTop: 20 }} onPress={() => {this.props.onJumpForward()}}>
                    {/* {
                        <SvgUri style={{transform: [{ rotateX: '-180deg' },{ rotate: '-90deg' }] }} width="50" height="50" source={require('../assets/interface-icons/seek.svg')} fill={'#EEE'} fillAll={true}/>
                    } */}
                    {/* <Text style={{ color: 'gainsboro', fontSize: 14, fontWeight: '800', position: 'absolute', zIndex: -1, left: 44 }}>15</Text> */}
                    {/* <Image style={{ height: 40, width: 40 }} source={require('../assets/skip-ahead.png')} /> */}
                    <SvgUri style={{}} width="50" height="50" source={require('../assets/interface-icons/seek-forward.svg')} fill={'#FFF'} fillAll={true}/>
                </TouchableOpacity>
            </View>
        ) 
    }
}