import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

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
});

export default class TopBar extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

        return (
            <View>
                <Text style={{
                    fontWeight: '700',
                    fontSize: 18,
                    color: 'black'
                }}>{ this.props.title }</Text>
            </View>
        );

    }
}