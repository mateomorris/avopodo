import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { Navigation } from "react-native-navigation";
import { BlurView } from 'react-native-blur';
import * as Animatable from 'react-native-animatable';

export default class LightBox extends Component {

    state = {
        opacity : new Animated.Value(0)
    }

    componentDidMount() {
        // Shrink to normal
        Animated.timing(            
            this.state.opacity,         
            {
                toValue:1, 
                duration: 200,
                useNativeDriver: true
            }    
        ).start();
    }

    _closeLightbox = () => {
        Animated.timing(            
            this.state.opacity,         
            {
                toValue:0, 
                duration: 200,
                useNativeDriver: true
            }    
        ).start(() => {
            Navigation.dismissOverlay(this.props.componentId)
        });
    
    }


    render() {

        let window = Dimensions.get('window');

        return(
            <Animated.View style={{
                width: '100%',
                height: '100%',
                backgroundColor: Platform.OS == 'ios' ?  'rgba(0,0,0,.5)' : 'rgba(0,0,0,.85)',
                padding: 10,
                paddingTop: 37.5,
                paddingBottom: 37.5,
                alignItems: 'center',
                opacity: this.state.opacity
            }}>
                <BlurView
                    style={{
                        position: "absolute",
                        top: 0, left: 0, bottom: 0, right: 0,
                    }}
                    viewRef={this.state.viewRef}
                    blurType="dark"
                    blurAmount={10}
                />
                <View style={{
                    maxHeight: window.height - 30
                }}>
                    <TouchableOpacity style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        alignItems: 'flex-end'
                    }} onPress={() => {
                        this._closeLightbox()
                    }}>
                        <Image style={{ width: 25, height: 25 }} source={require('../assets/x.png')} />
                    </TouchableOpacity>
                    <ScrollView style={[{
                        backgroundColor: 'rgba(0,0,0,.5)',
                        width: window.width - 40,
                        borderRadius: 5
                    }, this.props.style]}>
                        { this.props.children }
                    </ScrollView>
                    <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        left: -50,
                        right: -50,
                        height: window.height,
                        zIndex: -1
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