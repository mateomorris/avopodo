import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';
import * as Animatable from 'react-native-animatable';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { MaterialIndicator } from 'react-native-indicators';
import MarqueeText from 'react-native-marquee';

import PlayingScreen from '../screens/PlayingScreen';

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
    },
});

class PlayBar extends React.Component {

    state = {
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
        onPanResponderMove : (e, gesture) => {
            if (this.state.expanded) {
                console.log('EXPANDED', gesture)
                gesture.dy > 0 && this.state.height.setValue(this.state.window.height - gesture.dy) // If swiping down, set `height` 
            } else {
                console.log('unexpanded', gesture.dy)
                this.state.height.setValue((this.state.window.height + gesture.dy))
            }
        },
        onPanResponderRelease : (e, gesture) => {

            if (!this.state.expanded && gesture.dy > 0 && gesture.dy < 50) { // If released too low, spring back
                this._closeModal()
            } else if (!this.state.expanded && gesture.dy > -15 ) { // If it's dragged far enough
                this._closeModal()

            } else if (!this.state.expanded && gesture.dy < -15 ) { // If it's dragged far enough
                this._expandModal()

            } else if (this.state.expanded && gesture.dy > 50 ) { // If it's expanded and gets dragged down
                this._closeModal()

            } else if (this.state.expanded) { // If it's expanded and doesn't get dragged down far enough
                this._expandModal()
            } else {
                console.log('No matching conditions', gesture.dy)
               if (gesture.dy >= 50) {
                    console.log('removing play bar', gesture)
                //    this._removePlayBar(gesture)
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
                top: active ? (this.state.triggered ? 0 : Dimensions.get('window').height - (75)) : Dimensions.get('window').height,
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
                    <Animated.View 
                    style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10, paddingTop: 0, paddingBottom: 0, height: 50, zIndex: 1, backgroundColor: 'black'
                    }} pointerEvents={this.state.expanded ? 'none' : 'auto'}>
                        <TouchableOpacity onPress={() => this._expandModal() } style={{ backgroundColor: 'transparent', paddingTop: 10 }}>
                            {/* <Image style={{height: 20, width: 20}} source={require('../assets/up-caret.png')} /> */}
                        {
                            <SvgUri style={{ width: 30, height: 20, paddingLeft: 5 }} width="20" height="20" source={require('../assets/interface-icons/up.svg')} fill={'#EEE'} fillAll={true}/>
                        }
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => { this._expandModal() }} style={{ paddingLeft: 10, paddingRight: 10, overflow: 'hidden', maxWidth: '80%'}}> */}
                        <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10, overflow: 'hidden', flex: 1, backgroundColor: 'transparent', height: '100%' }}
                            {...this.panResponder.panHandlers} 
                        >
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.title }</Text>
                                <Text style={{ color: 'white', fontSize: 10 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.showTitle }</Text>
                            </View>
                        </View>
                        {/* </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => {togglePlayback()}} style={{ justifyContent: 'flex-start', alignItems: 'center', zIndex: 9, paddingTop: 0 }}>
                            <MaterialIndicator color={ true ? nowPlaying.showColor : 'transparent' } size={30} animationDuration={2000} />
                            {
                                <SvgUri style={{height: 25, width: 25, position: 'absolute', top: 13 }} width="25" height="25" source={(playing ? require('../assets/interface-icons/pause.svg') : require('../assets/interface-icons/play.svg'))} fill={'#FFF'} fillAll={true}/>
                            }
                            {/* <Image style={{height: 25, width: 25, position: 'absolute' }} source={(playing ? require('../assets/pause.png') : require('../assets/play.png'))} resizeMode={'center'}/> */}
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