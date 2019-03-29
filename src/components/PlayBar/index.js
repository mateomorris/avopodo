import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';
import * as Animatable from 'react-native-animatable';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import tinycolor from 'tinycolor2'
import { OfflineImage, OfflineImageStore } from 'react-native-image-offline';

import PlayProgressIndicator from 'components/PlayProgressIndicator';
import { MaterialIndicator } from 'react-native-indicators';
import MarqueeText from 'react-native-marquee';

import PlayingScreen from 'screens/PlayingScreen';

import TrackPlayer from 'react-native-track-player';

import trackDetails from 'utilities/tracks';
import * as actions from 'actions'

import { CircleButton } from 'components/Button'
import { animate } from 'helpers/animations'
import { TAB_HEIGHT, DIMENSIONS } from 'helpers/constants'
import icons from 'assets/generalIcons';

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
        height : new Animated.Value(DIMENSIONS.height + 50),
        bottomSpacing : new Animated.Value(0),
        expanded: false,
        tabHeight: 0,
        reStoreCompleted : false
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
            tabHeight: TAB_HEIGHT,
            window: DIMENSIONS
        }, () => {
            console.log(this.state.tabHeight)
        })

        TrackPlayer.getState().then((state) => {
            if (state == 'paused' && this.props.state.playing) {
                // TODO: Ensure the app knows that the track is paused
                this.props.actions.togglePlayback();
            }
        })

        OfflineImageStore.restore(
            {
                name: `show_art`,
                // imageRemoveTimeout: 30, // expire image after 30 seconds, default is 3 days if you don't provide this property.
                // debugMode: true,
            }, () => {
                this.setState({ reStoreCompleted: true });

                // Preload images
                // Note: We recommend call this method on `restore` completion!
                OfflineImageStore.preLoad(this.props.state.nowPlaying.showImage);
            }
        )
    }

    componentDidUpdate() {
        if (!this.state.visible && this.props.state.active) {
            this._becomeVisible()
        }
    }

    _becomeVisible = () => {

        this.state.bottomSpacing.setValue(this.state.tabHeight)

        animate([
            {
                property : this.state.height,
                toValue: this.state.window.height,
                duration: 300,
                delay: 200,  
                animation : 'timing'
            }
        ], () => {
            this.setState({
                visible : true
            })
        })
    }

    _closeModal = () => {

        this.setState({
            expanded: false,
            triggered: false
        })

        animate([
            {
                property : this.state.height,
                toValue: this.state.window.height
            },
            {
                property : this.state.bottomSpacing,
                toValue: this.state.tabHeight
            },
            {
                property : this.state.opacity,
                animation : 'timing',
                duration: 500,
                delay: 200,
            }
        ])

    }

    _resetModal = () => {
        animate([
            {
                property : this.state.height,
                toValue : 0,
                speed : 20,
                bounciness : 0
            },
            {
                property : this.state.bottomSpacing,
                toValue : 0,
                speed : 20,
                bounciness : 0
            },
        ])
    }

    _expandModal = () => {
        this.setState({
            triggered: true
        }, () => {
            animate([
                {
                    property : this.state.height,
                    toValue : 0,
                    speed : 20,
                    bounciness : 0
                },
                {
                    property : this.state.bottomSpacing,
                    toValue : 0,
                    speed : 20,
                    bounciness : 0
                },
            ], () => {
                this.setState({
                    expanded: true
                }, () => {
                    animate([
                        {
                            property: this.state.opacity,
                            toValue : 0,
                            animation : 'timing',
                            duration : 500
                        }
                    ])
                })
            })
        });

    }

    _handlePlayBarTouch = () => {
        animate([
            {
                property : this.state.height,
                toValue: this.state.window.height + 5
            },
            {
                property : this.state.bottomSpacing,
                toValue: this.state.tabHeight
            },
            {
                property : this.state.opacity,
                animation : 'timing',
                duration: 500,
                delay: 200,
            }
        ], () => {

        })
    }

    _resetPlayBar = () => {
        animate([
            {
                property : this.state.height,
                toValue: this.state.window.height
            },
            {
                property : this.state.bottomSpacing,
                toValue: this.state.tabHeight
            },
            {
                property : this.state.opacity,
                animation : 'timing',
                duration: 500,
                delay: 200,
            }
        ], () => {

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
            !this.state.expanded && this._handlePlayBarTouch()
            this.setState({
                draggingBar : true
            })
        },
        onPanResponderMove : (e, gesture) => {
            if (this.state.expanded && gesture.dy > 0) {
                animate([
                        {
                            property : this.state.height,
                            toValue : gesture.moveY
                        }
                ])
            } else {
                // Could hook up functionality to scroll down on playing screen from here
                // this.state.height.setValue((this.state.window.height + gesture.dy))
            }
        },
        onPanResponderRelease : (e, gesture) => {

                this.setState({
                    draggingBar : false
                }, () => {

                })

                    if (!this.state.expanded) { // Unexpanded modal
                        
                        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5 || gesture.dy < -15) { // Detect touch 
                            console.log('Expanding modal')
                            this._expandModal();
                        } else if (gesture.dy > -15 && gesture.dy < 50) { // If released too low, spring back
                            console.log('Closing modal')
                            this._closeModal()
                        } else if (gesture.dy >= 50) { // If dragged down far enough
                            console.log('Removing play bar')
                            this._removePlayBar()
                        }

                    } else if (this.state.expanded) { // Expanded modal

                        if (gesture.dy > 50 ) { // If dragged down far enough
                            console.log('Closing modal')
                            this._closeModal()
                        } else { 
                            console.log('Already expanded, expanding modal again')
                            // this._expandModal()
                            this._resetModal()
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
            return DIMENSIONS.height
        } else {
            return DIMENSIONS.height - (60);
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
                    borderTopLeftRadius : 7,
                    borderTopRightRadius: 7,
                    backgroundColor: 'transparent',
                    overflow: 'visible',
                    shadowColor: 'black',
                    shadowOffset: {
                        width: 0,
                        height: 0
                    },
                    shadowRadius: 3,
                    shadowOpacity: 0.5,
                    transform: [
                        {
                            translateY: this.state.height
                        }
                    ]
                }]}
                {...this.panResponder.panHandlers} 
                >
                    <PlayProgressIndicator 
                        color={nowPlaying.showColor}
                    />
                    <View style={{
                        paddingRight: 10, 
                        paddingLeft: 7, 
                        paddingTop: 0, 
                        paddingBottom: 0, 
                        height: 50, 
                        zIndex: 1, 
                        backgroundColor: '#111',
                        flexDirection: 'row'
                    }}>
                        <View 
                        style={{
                            flexDirection: 'row', 
                            justifyContent: 'flex-start', 
                            alignItems: 'center', 
                            paddingRight: 40,
                            flex: 1,
                        }} pointerEvents={this.state.expanded ? 'none' : 'auto'}>
                            <View
                                style={{
                                    height: '100%',
                                    justifyContent: 'center',
                                }}
                            >
                                <View style={{
                                    backgroundColor: nowPlaying.showColor,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}>
                                    {
                                        this.state.reStoreCompleted &&
                                        <OfflineImage
                                            key={nowPlaying.showImage}
                                            resizeMode={'contain'}
                                            style={{
                                                height: 35,
                                                width: 35,
                                                backgroundColor: nowPlaying.showColor
                                            }}
                                            source={{ uri: nowPlaying.showImage }}
                                        /> 
                                    }
                                </View>
                            </View>
                            <View style={{ paddingLeft: 5, paddingRight: 10, paddingTop: 10, overflow: 'hidden', backgroundColor: 'transparent', height: '100%' }}>
                                <View style={{ alignItems: 'flex-start', flex: 1 }}>
                                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.title }</Text>
                                    <Text style={{ color: '#EEE', fontSize: 10 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.showTitle }</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%',
                        }}>
                            <CircleButton 
                                onPress={() => {
                                    togglePlayback()
                                }}
                                icon={playing ? icons.pause : icons.play}
                                size={30}
                                spinner={this.props.state.bufferingStatus}
                                color={nowPlaying.showColor}
                            />
                        </View>
                    </View>
                    <View pointerEvents={this.state.expanded ? 'auto' : 'none'} style={{ height: DIMENSIONS.height, width: '100%' }}>
                        <PlayingScreen 
                            expanded={this.state.expanded} 
                            onClose={() => {
                                this._closeModal()
                            }}
                        />
                    </View>
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