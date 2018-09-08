import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions } from 'react-native';

const thumbnailSize = ( Dimensions.get('window').width / 3 ) - (10 / 3)

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2,
        shadowOpacity: 0.75,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: thumbnailSize,
        height: thumbnailSize,
    },
    thumbnail: { 
        width: '90%',
        height: '90%',
        borderRadius: 4
    },
    featured: {
        width: 120,
        height: 120
    }
});

export default class ShowThumbnail extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

        const { art, featured, color } = this.props; 

        return (
            <TouchableHighlight 
                underlayColor={color}
                onPress={() => {this._handlePress()}} 
                style={[styles.container, this.props.style]}>
              <Image source={{uri: art, cache: force-cache}} style={[styles.thumbnail, (featured ? styles.featured : ''), , {backgroundColor: color}]} />
            </TouchableHighlight>
        );

    }
}