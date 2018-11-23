import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';
import * as Animatable from 'react-native-animatable';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import PlayProgressIndicator from 'components/PlayProgressIndicator';
import { MaterialIndicator } from 'react-native-indicators';
import MarqueeText from 'react-native-marquee';

import PlayingScreen from 'screens/PlayingScreen';

import TrackPlayer from 'react-native-track-player';

import trackDetails from 'utilities/tracks';
import * as actions from 'actions'


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
    },
});

class PlayBar extends React.Component {

    state = {
        draggingBar : false,
        window: {},
        triggered: false, 
        visible : false,
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
        initialPlay: null,
        opacity: new Animated.Value(1),
        height : new Animated.Value(Dimensions.get('window').height + 50),
        bottomSpacing : new Animated.Value(0),
        expanded: false,
        tabHeight: 0
    }

    componentDidUpdate() {
        if (this.props.state.active && !this.state.visible) {
            this.setState({
                visible : true
            })
        }
    }

    componentDidMount() {

        this.setState({
            tabHeight: this._getTabHeight(),
            window: Dimensions.get('window')
        }, () => {
            console.log(this.state.tabHeight)
        })

        TrackPlayer.getState().then((state) => {
            if (state == 'paused' && this.props.state.playing) {
                // TODO: Ensure the app knows that the track is paused
                this.props.actions.togglePlayback();
            }
        })
    }

    componentDidUpdate() {
        if (!this.state.visible && this.props.state.active) {
            this._becomeVisible()
        }
    }

    _getTabHeight = () => {
        const isIphoneX = () => {
            let dimensions;
            if (Platform.OS !== 'ios') {
                return false;
            }
            if (Platform.isPad || Platform.isTVOS) {
                return false;
            }
            dimensions = Dimensions.get('window');
            if (dimensions.height === 812 || dimensions.width === 812) { // Checks for iPhone X in portrait or landscape
                return true;
            }
            if (dimensions.height === 896 || dimensions.width === 896) { 
                return true;
            }
            return false;
        }

        if (isIphoneX()) {
            // Tab height is 84
            return 82 * -1
        } else if (Platform.OS === 'ios') {
            // Tab height is 50
            return 48 * -1
        } else {
            return 55 * -1
        }
    }

    _becomeVisible = () => {


        // iPhone X: 375, 812
        // iPhone 8 Plus: 414, 736
        // iPhone 8: 667, 375

        this.state.bottomSpacing.setValue(this.state.tabHeight)


        // Show PlayBar 
        Animated.timing(this.state.height, {
            toValue: this.state.window.height,
            duration: 300,
            delay: 200,
            useNativeDriver: true
        }).start();

        this.setState({
            visible : true
        })
    }

    _closeModal = () => {
        
        // Shrink to normal
        Animated.spring(            
            this.state.height,         
            {
                toValue: this.state.window.height, 
                tension: 0,
                useNativeDriver: true
            }    
        ).start();

        // Add bottom spacing
        Animated.spring(            
            this.state.bottomSpacing,         
            {
                toValue: this.state.tabHeight, 
                tension: 0,
                useNativeDriver: true
            }    
        ).start();

        // Show PlayBar 
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            delay: 200,
            useNativeDriver: true
        }).start(() => {
        this.setState({
            expanded: false,
            triggered: false
        })
    })

    }

    _expandModal = () => {
        this.setState({
            triggered: true
        });

        // Grow to full height
        Animated.spring(            
            this.state.height,         
            {
                toValue:0, 
                tension: 5,
                useNativeDriver: true
            }    
        ).start();

        // Remove bottom spacing
        Animated.spring(            
            this.state.bottomSpacing,         
            {
                toValue: 0, 
                tension: 5,
                useNativeDriver: true
            }    
        ).start();


        // Hide PlayBar 
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
            delay: 200,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                expanded: true
            })
        })
    }

    _removePlayBar = () => {
        this.props.actions.resetQueue()
        this.setState({
            visible : false
        })
    }


    panResponder = PanResponder.create({    
        onStartShouldSetPanResponder : () => true,
        onPanResponderGrant: (evt, gestureState) => {
          this.setState({
            draggingBar : true
          })
        },
        onPanResponderMove : (e, gesture) => {
            if (this.state.expanded) {
                gesture.dy > 0 && this.state.height.setValue(this.state.window.height - gesture.dy) // If swiping down, set `height` 
            } else {
                this.state.height.setValue((this.state.window.height + gesture.dy))
            }
        },
        onPanResponderRelease : (e, gesture) => {

                this.setState({
                    draggingBar : false
                })

                if (!this.state.expanded) { // Unexpanded modal
                    
                    if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5 || gesture.dy < -15 ) { // Detect touch OR release high enough
                        this._expandModal()
                    } else if (gesture.dy > -15 && gesture.dy < 50) { // If released too low, spring back
                        this._closeModal()
                    } else if (gesture.dy >= 50) { // If dragged down far enough
                        this._removePlayBar()
                    }

                } else if (this.state.expanded) { // Expanded modal

                    if (gesture.dy > 50 ) { // If dragged down far enough
                        this._closeModal()
                    } else { 
                        this._expandModal()
                    }

                } 
        } 
    });


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


    _getHeight = () => {
        if (this.state.draggingBar) {
            return this.state.draggingBar
        } else if (this.state.triggered) {
            return 0
        } else if (!this.props.state.active) {
            return Dimensions.get('window').height
        } else {
            return Dimensions.get('window').height - (60);
        }
    }


    handleViewRef = ref => this.view = ref;
    bounce = () => this.view.transitionTo({ height: 200 })
    
    render() {

        // this.state.height.setOffset(50)

        let { nowPlaying, playing, active, bufferingStatus } = this.props.state
        let { togglePlayback } = this.props.actions

        return (
            <Animated.View style={{ 
                position: 'absolute', 
                bottom: 0, 
                top: this._getHeight(),
                width: '100%',
                justifyContent: 'flex-end',
                overflow: 'hidden',
                // backgroundColor: 'rgba(0,0,0,.5)',
                transform: [
                    {
                        translateY: this.state.bottomSpacing
                    }
                ]
                }}>
                <Animated.View 
                style={[{ 
                    width: '100%', 
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    transform: [
                        {
                            translateY: this.state.height
                        }
                    ]
                }]}>
                    <PlayProgressIndicator 
                        color={nowPlaying.showColor}
                    />
                    <Animated.View 
                    style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10, paddingTop: 0, paddingBottom: 0, height: 50, zIndex: 1, backgroundColor: 'black'
                    }} pointerEvents={this.state.expanded ? 'none' : 'auto'}>
                        <View
                            style={{
                                height: '100%',
                                justifyContent: 'center'
                            }}
                            {...this.panResponder.panHandlers} 
                        >
                            <Image 
                                source={{ uri: nowPlaying.showImage, backgroundColor: nowPlaying.showColor }}
                                style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 2
                                }}
                            />
                        </View>
                        <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, overflow: 'hidden', flex: 1, backgroundColor: 'transparent', height: '100%' }}
                            {...this.panResponder.panHandlers} 
                        >
                            <View style={{ alignItems: 'flex-start', flex: 1 }}>
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.title }</Text>
                                <Text style={{ color: '#EEE', fontSize: 10 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.showTitle }</Text>
                            </View>
                        </View>
                        {/* </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => {togglePlayback()}} style={{ justifyContent: 'center', alignItems: 'center', zIndex: 9, paddingTop: 0 }}>
                            <MaterialIndicator color={ bufferingStatus ? nowPlaying.showColor : 'transparent' } size={30} animationDuration={2000} />
                            <View style={{
                                height: 27,
                                width: 27,
                                backgroundColor: `${nowPlaying.showColor}7F`,
                                borderRadius: 100,
                                position: 'absolute'
                            }}></View>
                            <View style={{
                                height: 15,
                                width: 15,
                                backgroundColor: '#FFF',
                                borderRadius: 100,
                                position: 'absolute'
                            }}></View>
                            {
                                <SvgUri style={{height: 25, width: 25, position: 'absolute' }} width="25" height="25" source={(playing ? require('assets/interface-icons/pause.svg') : require('assets/interface-icons/play.svg'))} fill={nowPlaying.showColor} fillAll={true}/>
                            }
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View pointerEvents={this.state.expanded ? 'auto' : 'none'} style={{ height: Dimensions.get('window').height, width: '100%' }}>
                        <PlayingScreen 
                            expanded={this.state.expanded} 
                            onClose={() => {
                                this._closeModal()
                            }}
                        />
                    </Animated.View>
                </Animated.View>
            </Animated.View>

            || null
        );

    }
}

function mapStateToProps(state, ownProps) {
	return {
		state: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);