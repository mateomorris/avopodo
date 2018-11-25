import React from 'react';
import { View, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { DotIndicator } from 'react-native-indicators';

export const LoadingIndicator = () => {
    return (
        <View style={{ height: Dimensions.get('window').height - 200 }}>
            <DotIndicator color='gray' />
        </View>
    )
}

export const SmallLoadingIndicator = () => {
    return (
        <View style={{ height: 100 }}>
            <DotIndicator color='gray' />
        </View>
    )
}

export const SimpleButton = () => {
    return (
        <TouchableOpacity style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderColor: 'whitesmoke',
            borderWidth: 2,
            borderRadius: 35,
            flexDirection: 'row'
        }} onPress={() => {
            this.props.onPress
        }}>
            <Text style={{
                color: 'white',
                fontWeight: '900'
            }}>{ this.props.label }</Text>
            <Image style={{
                height: 20,
                width: 20,
                marginLeft: 3
            }} source={this.props.icon} />
        </TouchableOpacity>
    )
}