import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions, ImageBackground } from 'react-native';

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
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
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
                <View
                    style={[styles.thumbnail, (featured ? styles.featured : ''), , {backgroundColor: color}]}
                >
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: '700',
                        textAlign: 'center',
                        padding: 10
                    }}>{ this.props.name }</Text>
                    <Image 
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: 5
                        }}
                        source={{uri: art, cache: 'force-cache'}} 
                    />
                </View>
            </TouchableHighlight>
        );

    }
}