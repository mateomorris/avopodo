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

export default class Button extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

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
                this._handlePress()
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
        );

    }
}