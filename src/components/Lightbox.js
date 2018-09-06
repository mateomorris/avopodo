import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Navigation } from "react-native-navigation";
import { BlurView } from 'react-native-blur';
import * as Animatable from 'react-native-animatable';

export default class LightBox extends Component {

    state = {

    }


    componentWillMount() {

    }


    render() {

        let window = Dimensions.get('window');

        return(
            <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,.5)',
                padding: 10,
                alignItems: 'center'
            }} animation="fadeIn" >
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
                    }} onPress={() => {Navigation.dismissOverlay(this.props.componentId)}}>
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
                        Navigation.dismissOverlay(this.props.componentId)
                    }}>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

LightBox.defaultProps = {
    style: {
        padding: 25
    }
}