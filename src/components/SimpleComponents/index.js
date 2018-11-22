import React from 'react';
import { View, Dimensions, Text } from 'react-native';
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