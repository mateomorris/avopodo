import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { MaterialIndicator } from 'react-native-indicators';
import MarqueeText from 'react-native-marquee';

import TrackPlayer, { ProgressComponent } from 'react-native-track-player';

import trackDetails from '../utilities/tracks';
import * as actions from '../redux/actions'


const styles = StyleSheet.create({
    container: {
        margin: 5, 
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2,
        shadowOpacity: 0.75
    },
    thumbnail: { 
        width: 120, 
        height: 120, 
        borderRadius: 4
    }
});

class PlayBar extends React.Component {

    state = {
        active: false,
        playing: false, 
        nowPlaying: {
            episode: {
                title: null
            },
            show: {
                title: null
            }
        },
        initialPlay: null
    }

    _handlePress = () => {

        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'example.PlayingScreen',
                        passProps: {},
                        options: {
                            statusBar: {
                                visible : true,
                                style: 'light'
                            },
                            topBar: {
                                visible: false
                            }
                        }
                    }
                }]
            }
        });
        
        Navigation.dismissOverlay(this.props.componentId)

    }

    render() {

        let { nowPlaying, playing, active, bufferingStatus } = this.props.state
        let { togglePlayback } = this.props.actions

        return (
            active
            && 
            // <View style={{ 
            //     backgroundColor: 'black', 
            //     position: 'absolute', 
            //     bottom: 0, 
            //     width: '100%', 
            //     paddingTop: 8, 
            //     paddingBottom: 8, 
            //     flexDirection: 'row', 
            //     justifyContent: 'space-between',
            //     alignItems: 'center',
            //     paddingRight: 10,
            //     paddingLeft: 10,
            //     flex: 1
            //   }}>
            <GestureRecognizer
            onSwipeUp={() => { this._handlePress() }}
            style={{ 
                backgroundColor: 'black', 
                position: 'absolute', 
                bottom: 46, 
                width: '100%', 
                paddingTop: 8, 
                paddingBottom: 8, 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: 10,
                paddingLeft: 10,
                flex: 1
            }}>
                <TouchableOpacity onPress={() => this._handlePress()}>
                    {/* <Image style={{height: 20, width: 20}} source={require('../assets/up-caret.png')} /> */}
                    <SvgUri style={{ width: 20, height: 20, paddingLeft: 5 }} width="20" height="20" source={require('../assets/interface-icons/up.svg')} fill={'#EEE'} fillAll={true}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this._handlePress()} style={{ paddingLeft: 10, paddingRight: 10, overflow: 'hidden', maxWidth: '80%'}}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }}>{ nowPlaying.title }</Text>
                        {/* <MarqueeText
                        style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }}
                        marqueeOnStart
                        loop={true}
                        marqueeDelay={5000}
                        marqueeResetDelay={1000}
                        >
                            {nowPlaying.title}
                        </MarqueeText> */}
                        <Text style={{ color: 'white', fontSize: 10 }}>{ nowPlaying.showTitle }</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {togglePlayback()}} style={{ justifyContent: 'center', alignItems: 'center', zIndex: 9}}>
                    <MaterialIndicator color={ bufferingStatus ? 'rgba(250,250,250,.3)' : 'transparent' } size={35} animationDuration={2000} />
                    <SvgUri style={{height: 25, width: 25, position: 'absolute' }} width="25" height="25" source={(playing ? require('../assets/interface-icons/pause.svg') : require('../assets/interface-icons/play.svg'))} fill={'#FFF'} fillAll={true}/>
                    {/* <Image style={{height: 25, width: 25, position: 'absolute' }} source={(playing ? require('../assets/pause.png') : require('../assets/play.png'))} resizeMode={'center'}/> */}
                </TouchableOpacity>
            {/* </View> */}
            </GestureRecognizer>
            || null
        );

    }
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);