import React from 'react';
import { StyleSheet, PanResponder, Text, View, Image, TouchableOpacity, Alert, Animated, TouchableHighlight } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SvgUri from 'react-native-svg-uri';
import { BlurView } from 'react-native-blur';
import { OfflineImage, OfflineImageStore } from 'react-native-image-offline';

import { TouchableView } from 'components/Button';
import { animate } from 'helpers/animations';

const styles = StyleSheet.create({
    containerOuter: { 
        backgroundColor: 'transparent',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 0.75,
    },
    containerInner: { 
        // overflow: 'hidden', 
        borderRadius: 10,
        flexDirection: 'row'
    },
    backgroundImages: { 
        flexDirection: 'row-reverse', 
        height: 0,
        position: 'absolute',
        right: 0,
        borderRadius: 4
    },
    backgroundImage: {
        width: 'auto'
    },
    infoContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        alignSelf: 'flex-end',
        paddingTop: 15, 
        paddingBottom: 15, 
        paddingLeft: 20,
        height: 80, 
        paddingRight: 60,
        // backgroundColor: 'black',
        // shadowColor: 'black',
        // shadowOffset: {
        //     width: 30,
        //     height: 0
        // },
        // shadowRadius: 5,
        // shadowOpacity: 1
    },
    icon: { 
        width: 40, 
        height: 40, 
        marginRight: 10
    },
    title: { 
        fontSize: 15, 
        fontWeight: '800', 
        color: 'white' 
    },
    duration: { 
        fontSize: 15, 
        color: 'white' 
    }
});

export default class PlaylistThumbnail extends React.Component {

    state = {
        pressStatus : false,
        containerHeight: 0,
        reStoreCompleted: false,
        buttonOpacity : new Animated.Value(0.75),
        buttonScale : new Animated.Value(1),
        moveLeft : new Animated.Value(0),
        stuckLeft : false,
        containerHeight: 0
    }

    _handleRightPress = () => {
        this._resetButton();
    }

    _handleLeftPress = () => {
        this.props.onLeftPress();
    }

    _setButtonComponentIcon = (label) => {
        if (label == 'Remove') {
            return require('assets/x-black.png');
        } else if (label == 'Revise') {
            return require('assets/edit.png');
        }
    }

    _handlePlaylistButtonPress = (label) => {
        Alert.alert(label);
    }

    buttonComponent = (label) => {
        return (
            <TouchableOpacity style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {this._handlePlaylistButtonPress(label)}}>
                <Image source={this._setButtonComponentIcon(label)} style={{ height: 25, width: 25, paddingBottom: 5 }}/>
                <Text style={{ fontSize: 10 }}>{ label }</Text>
            </TouchableOpacity>
        )
    }

    _durationLabel = (duration) => {
        if (duration > 40) {
            return `40+ hours`;
        } else if (duration > 24) {
            return `24+ hours`;
        } else if (duration > 10) {
            return `10+ hours`
        } else {
            return `${duration} hours`
        }
    }

    _onHideUnderlay(){
        this.setState({ pressStatus: false });
    }
    _onShowUnderlay(){
        this.setState({ pressStatus: true });
    }

    componentDidMount() {
        OfflineImageStore.restore(
            {
                name: `show_art`,
                // imageRemoveTimeout: 30, // expire image after 30 seconds, default is 3 days if you don't provide this property.
                // debugMode: true,
            }, () => {
                this.setState({ reStoreCompleted: true });

                // Preload images
                // Note: We recommend call this method on `restore` completion!
                if (this.props.episodes) {
                    OfflineImageStore.preLoad(this.props.episodes.map(episode => episode.showImage));
                }
            }
        )
    }

    _handleInitialButtonPress = () => {
        animate([
            {
                property : this.state.buttonOpacity,
                toValue : 0.15
            },
            {
                property : this.state.buttonScale,
                toValue : 0.99
            },    
        ])
    }

    _resetButton = () => {
        animate([
            {
                property : this.state.buttonOpacity,
                toValue : 0.75
            },
            {
                property : this.state.buttonScale,
                toValue : 1
            },    
        ])
    }

    _panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return true
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
            // The gesture has started. Show visual feedback so the user knows
            // what is happening!
            this._handleInitialButtonPress()
            // gestureState.d{x,y} will be set to zero now
        },
        onPanResponderMove: (evt, gestureState) => {
            // The most recent move distance is gestureState.move{X,Y}

            if (this.state.stuckLeft && gestureState.dx > 0) {
                this.state.moveLeft.setValue(-160 + gestureState.dx)
            } else if (!this.state.stuckLeft && (gestureState.dx < -160 || gestureState.dx > 0)) {
                return false
            } else if (this.state.stuckLeft && gestureState.dx < 0) {
                return false
            } else {
                this.state.moveLeft.setValue(gestureState.dx)
            }

            // The accumulated gesture distance since becoming responder is
            // gestureState.d{x,y}
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            // The user has released all touches while this view is the
            // responder. This typically means a gesture has succeeded
            this._resetButton()

            if (!this.state.stuckLeft && Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
                this.props.onPress()
            } else if (gestureState.dx < -40) {
                this.props.onSwipe()
                this.setState({
                    stuckLeft : true
                })
                animate([
                    {
                        property : this.state.moveLeft,
                        toValue : -160
                    }
                ])
            } else {
                this.setState({
                    stuckLeft : false
                })
                animate([
                    {
                        property : this.state.moveLeft,
                        toValue : 0
                    }
                ])
            }

        },
        onPanResponderTerminate: (evt, gestureState) => {
            // Another component has become the responder, so this gesture
            // should be cancelled
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // Returns whether this component should block native components from becoming the JS
            // responder. Returns true by default. Is currently only supported on android.
            return true;
        },
    });

    _resetSwipe = () => {
        animate([
            {
                property: this.state.moveLeft,
                toValue : 0
            }
        ])
    }

    componentDidUpdate() {
        if (!this.props.swipeStatus && this.state.stuckLeft) {
            this.setState({
                stuckLeft : false
            }, () => {
                this._resetSwipe()
            })
        }
    }

    render() {

        const { icon, title, duration, episodes, testing } = this.props; 

        const playlistButtons = [
            {
                component: this.buttonComponent('Remove'),
                backgroundColor: 'transparent'
            },
            {
                component: this.buttonComponent('Revise'),
                backgroundColor: 'transparent'
            },  
        ]

        return (
            <View style={[{
                backgroundColor: '#222',
                height: this.state.containerHeight,
                width: '100%',
                marginBottom: 10,
                borderRadius: 5,
                position: 'relative',
                overflow : this.state.containerHeight ? 'visible' : 'hidden'
            }]}>
                <View style={{
                    width: 160,
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    top: 0,
                    borderRadius: 5,
                    padding: 10,
                    overflow: 'hidden',
                    zIndex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}>
                    {/* <TouchableOpacity
                        style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}
                        onPress={() => {
                            Alert.alert('Remove')
                        }}
                    >
                        <Text style={{
                            color: '#fafafa',
                            fontWeight: '600'
                        }}>Delete</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}
                        onPress={() => {
                            this.props.onEditPress()
                        }}
                    >
                        <Text style={{
                            color: '#fafafa',
                            fontWeight: '600'
                        }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}
                        onPress={() => {
                            this.props.onQueuePress()
                        }}
                    >
                        <Text style={{
                            color: '#fafafa',
                            fontWeight: '600'
                        }}>Queue</Text>
                    </TouchableOpacity>
                </View>
                <TouchableView 
                onLayout={(layout) => {
                    this.setState({
                        containerHeight : layout.height
                    })
                }}
                style={[styles.containerOuter, {
                    width: '100%',
                    position: 'absolute',
                    shadowOpacity: this.state.buttonOpacity,
                    transform : [{ 
                        scale : this.state.buttonScale 
                    }, {
                        translateX : this.state.moveLeft
                    }],
                }]}
                panHandlers={this._panResponder.panHandlers}
                >
                    <View style={[styles.containerInner, {
                        borderRadius: 4,
                        backgroundColor: 'black'
                    }]}
                    onLayout={(e) => {
                        this.setState({
                            containerHeight: e.nativeEvent.layout.height,
                        })
                    }}
                    >
                        <View
                        style={[{ 
                            width: '100%',
                            position: 'absolute',
                            borderRadius: 5,
                            overflow: 'hidden',
                        }]}>
                            <View style={[{ width: '100%', flexDirection: 'row-reverse', justifyContent: 'flex-start' }]}>
                                {
                                    episodes ? episodes.slice(0,3).map((episode, index) => {
                                        return (
                                            <Image source={{uri: episode.showImage, cache: 'force-cache'}} style={[styles.backgroundImage, { height: this.state.containerHeight, width: this.state.containerHeight }]} key={index}/>
                                            // <OfflineImage
                                            //     key={index}
                                            //     resizeMode={'contain'}
                                            //     style={[styles.backgroundImage, { height: this.state.containerHeight, width: this.state.containerHeight }]}
                                            //     source={{ uri: episode.showImage }}
                                            // /> 
                                        )
                                    }) : null
                                }
                            </View>
                        </View>
                        <LinearGradient style={[styles.infoContainer, {
                            borderRadius: 5,
                            overflow: 'hidden',
                        }]} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['black', 'rgba(0,0,0,0.9)', 'transparent']} locations={[0,0.8,1]}>
                            <View 
                                // onPress={() => this._handleLeftPress()}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                                >
                                <View style={{
                                    paddingRight: 10
                                }}>
                                {
                                    !this.props.testing &&
                                    <SvgUri width="30" height="30" svgXmlData={icon} fill={'white'} fillAll={true}/>
                                }
                                </View>
                                <View>
                                    <Text style={ styles.title }>{ title.toUpperCase() }</Text>
                                    <Text style={ styles.duration }>{ this._durationLabel(duration) }</Text>
                                </View>
                            </View>
                        </LinearGradient>

                        {
                            this.props.currentPlaylist.id == this.props.playlist.id ? 
                            <View pointerEvents="none" style={{ 
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: this.state.containerHeight,
                                borderRadius: 4,
                                borderTopLeftRadius : 0,
                                borderBottomLeftRadius: 0,
                                overflow: 'hidden'
                            }}>
                                {
                                    !this.props.testing &&
                                    <View style={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                    }}>
                                        <BlurView
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute'
                                            }}
                                            viewRef={this.state.viewRef}
                                            blurType="dark"
                                            blurAmount={5}
                                        />
                                        <SvgUri style={
                                            {
                                                zIndex: 99999
                                        }} width="35" height="35" source={this.props.playing ? require('assets/interface-icons/pause.svg') : require('assets/interface-icons/play.svg') } fill={'#EEE'} fillAll={true}/>
                                    </View>
                                }
                            </View> 
                            :
                            <View pointerEvents="none" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    !this.props.testing &&
                                    <SvgUri style={
                                        {
                                            height: 20,
                                            width: 20,
                                            position: 'absolute',
                                            right: 5,
                                            bottom: 5,
                                            zIndex: 99999
                                    }} width="20" height="20" source={require('assets/interface-icons/play.svg')} fill={'#EEE'} fillAll={true}/>
                                }
                            </View>
                        }

                    </View>
                </TouchableView>
            </View>
        );

    }
}

PlaylistThumbnail.defaultProps = {

    onSwipe : () => {
        return false
    }
}