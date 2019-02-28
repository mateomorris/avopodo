import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export class BackButton extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

        return (
            <Text style={[{ 
                color: '#666666', 
                fontWeight: '600', 
                fontSize: 20,
                marginBottom: 10,
                marginLeft: 5,
                marginTop: 10
            }, this.props.style]}>{this.props.text}</Text>
        );

    }
}