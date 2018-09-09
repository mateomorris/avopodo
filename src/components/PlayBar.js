import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Animated, PanResponder, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';
import * as Animatable from 'react-native-animatable';

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
        initialPlay: null,
        opacity: new Animated.Value(1),
        height : new Animated.Value(50),
        bottomSpacing : new Animated.Value(47),
        expanded: false
    }

    panResponder = PanResponder.create({    
        onStartShouldSetPanResponder : () => true,
        // onPanResponderMove : Animated.event([null,{ 
        //     dy : this.state.height 
        // }]),
        // onPanResponderMove :             Animated.event(
        //         [
        //             null, 
        //             {dy: this.state.height}
        //         ]
        //     ),
        onPanResponderMove : (e, gesture) => {
            if (this.state.expanded) {
                this.state.height.setValue(Dimensions.get('window').height + 47 - gesture.moveY)
            } else {
                this.state.height.setValue((gesture.dy - 47) * -1)
            }
        },
        onPanResponderRelease : (e, gesture) => {

            // If released too low, spring back
            if (!this.state.expanded && gesture.dy > -15) {
                Animated.spring(            
                    this.state.height,         
                    {
                        toValue:47, 
                        tension: 5
                    }    
                ).start();
                this.setState({
                    expanded: false
                })
            } else if (!this.state.expanded) {
                // Grow to full height
                Animated.spring(            
                    this.state.height,         
                    {
                        toValue:Dimensions.get('window').height, 
                        tension: 5
                    }    
                ).start();

                // Remove bottom spacing
                Animated.spring(            
                    this.state.bottomSpacing,         
                    {
                        toValue: 0, 
                        tension: 5
                    }    
                ).start();


                // Hide PlayBar 
                Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: 500,
                    delay: 200,
                }).start();

                this.setState({
                    expanded: true
                })
            } else if (this.state.expanded && gesture.dy > 50 ) {
                    // Shrink to normal
                    Animated.spring(            
                        this.state.height,         
                        {
                            toValue:47, 
                            tension: 5
                        }    
                    ).start();
                    this.setState({
                        expanded: false
                    })

                    // Add bottom spacing
                    Animated.spring(            
                        this.state.bottomSpacing,         
                        {
                            toValue: 47, 
                            tension: 5
                        }    
                    ).start();

                    // Show PlayBar 
                    Animated.timing(this.state.opacity, {
                        toValue: 1,
                        duration: 500,
                        delay: 200,
                    }).start();


            } else if (this.state.expanded) {
                // Grow to full height
                Animated.spring(            
                    this.state.height,         
                    {
                        toValue:Dimensions.get('window').height, 
                        tension: 5
                    }    
                ).start();

                // Remove bottom spacing
                Animated.spring(            
                    this.state.bottomSpacing,         
                    {
                        toValue: 0, 
                        tension: 5
                    }    
                ).start();

                // Hide PlayBar 
                Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: 500,
                    delay: 200,
                }).start();

                this.setState({
                    expanded: true
                })
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
        console.log(this.state.height)

        let { nowPlaying, playing, active, bufferingStatus } = this.props.state
        let { togglePlayback } = this.props.actions

        return (
            active
            && 
            <Animated.View 
            {...this.panResponder.panHandlers} 
            style={[{ backgroundColor: 'black', height: this.state.height, position: 'absolute', bottom: this.state.bottomSpacing, width: '100%' }]}>
                <Animated.View style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10, flex: 1, opacity: this.state.opacity
                }}>
                    <TouchableOpacity onPress={() => this._handlePress()}>
                        {/* <Image style={{height: 20, width: 20}} source={require('../assets/up-caret.png')} /> */}
                        <SvgUri style={{ width: 20, height: 20, paddingLeft: 5 }} width="20" height="20" source={require('../assets/interface-icons/up.svg')} fill={'#EEE'} fillAll={true}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}} style={{ paddingLeft: 10, paddingRight: 10, overflow: 'hidden', maxWidth: '80%'}}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 12, height: 16 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.title }</Text>
                            <Text style={{ color: 'white', fontSize: 10 }} numberOfLines={1} ellipsizeMode={'tail'}>{ nowPlaying.showTitle }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {togglePlayback()}} style={{ justifyContent: 'flex-start', alignItems: 'center', zIndex: 9}}>
                        <MaterialIndicator color={ bufferingStatus ? 'rgba(250,250,250,.3)' : 'transparent' } size={35} animationDuration={2000} />
                        <SvgUri style={{height: 25, width: 25, position: 'absolute' }} width="25" height="25" source={(playing ? require('../assets/interface-icons/pause.svg') : require('../assets/interface-icons/play.svg'))} fill={'#FFF'} fillAll={true}/>
                        {/* <Image style={{height: 25, width: 25, position: 'absolute' }} source={(playing ? require('../assets/pause.png') : require('../assets/play.png'))} resizeMode={'center'}/> */}
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
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