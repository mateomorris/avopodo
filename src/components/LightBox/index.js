import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { Navigation } from "react-native-navigation";
import { BlurView } from 'react-native-blur';
import * as Animatable from 'react-native-animatable';
import { animate } from 'helpers/animations'

export class LightBox extends Component {

    state = {
        containerHeight : 0, // used to calculate how tall the touchable area under the content is
        viewHeight : 0, // this also
        opacity : new Animated.Value(0),
    }

    componentDidMount() {
        // Fade in
        animate([
            {
                property : this.state.opacity,
                toValue : 1,
                duration : 200,
            }
        ]);
    }

    _closeLightbox = () => {
        animate([
            {
                property : this.state.opacity,
                toValue : 0,
                duration : 200
            }
        ], () => {
            Navigation.dismissOverlay(this.props.componentId)
        });
    }


    render() {

        let window = Dimensions.get('window');

        return(
            <Animated.View style={{
                width: '100%',
                height: '100%',
                // backgroundColor: Platform.OS == 'ios' ?  'rgba(0,0,0,.5)' : 'rgba(0,0,0,.85)',
                padding: 10,
                // paddingTop: 37.5,
                paddingTop: 0,
                paddingBottom: 37.5,
                alignItems: 'center',
                opacity: this.state.opacity
            }}>
                <Image 
                    style={{ 
                        width: 25, 
                        height: 25,
                        position: 'absolute',
                        top: 35,
                        right: 20,
                        zIndex: 9
                    }} 
                    pointerEvents="none"
                    source={require('assets/x.png')} 
                />
                <BlurView
                    style={{
                        position: "absolute",
                        top: 0, left: 0, bottom: 0, right: 0,
                    }}
                    viewRef={this.state.viewRef}
                    blurType="dark"
                    blurAmount={10}
                />
                <View 
                style={{
                    maxHeight: window.height - 30,
                    paddingTop: 70
                }}
                onLayout={(e) => {
                    this.setState({
                        containerHeight : e.nativeEvent.layout.height
                    })
                }}
                >
                    {/* <TouchableOpacity style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        alignItems: 'flex-end'
                    }} onPress={() => {
                        this._closeLightbox()
                    }}>
                        <Image style={{ width: 25, height: 25 }} source={require('assets/x.png')} />
                    </TouchableOpacity> */}
                    <ScrollView style={[{
                        width: window.width - 40,
                        borderRadius: 5
                    }]} pointerEvents="box-none">
                        <View 
                        style={[{
                            backgroundColor: 'rgba(0,0,0,.5)',
                            height: 'auto',
                            width: window.width - 40,
                            borderRadius: 5
                        }, this.props.style]}
                        onLayout={(e) => {
                            this.setState({
                                viewHeight : e.nativeEvent.layout.height
                            })
                        }}
                        >
                            { this.props.children }
                        </View>
                        <View 
                            style={{
                                flex: 1,
                                height: this.state.containerHeight - this.state.viewHeight - 30
                            }}
                            onStartShouldSetResponder={() => {
                                this.background.setOpacityTo(0.2, 0.5);
                                return true
                            }}
                            onResponderRelease={() => {
                                this._closeLightbox()
                            }}
                            onResponderTerminate={() => {
                                this._closeLightbox()
                            }}
                            >
                        </View>
                    </ScrollView>
                    <TouchableOpacity 
                    ref={component => this.background = component}
                    style={{
                        position: 'absolute',
                        left: -50,
                        right: -50,
                        top: 0,
                        bottom: 0,
                        height: window.height,
                        zIndex: -1,
                        opacity: 1,
                        backgroundColor: 'rgba(0,0,0,.5)',
                    }} onPress={() => {
                        this._closeLightbox()
                    }}>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

LightBox.defaultProps = {
    style: {
        padding: 25
    }
}