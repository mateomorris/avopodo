import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Dimensions, ImageBackground } from 'react-native';
import { OfflineImage, OfflineImageStore } from 'react-native-image-offline';

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

    state = {
        reStoreComplete : false
    }

    _handlePress = () => {
        this.props.onPress();
    }

    componentDidMount() {
        OfflineImageStore.restore(
        {
        name: `${this.props.id}_gallery`,
        // imageRemoveTimeout: 30, // expire image after 30 seconds, default is 3 days if you don't provide this property.
        // debugMode: true,
        }, () => {
            this.setState({ reStoreCompleted: true });

            // Preload images
            // Note: We recommend call this method on `restore` completion!
            OfflineImageStore.preLoad(this.props.art);
        })
    }

    render() {

        const { art, featured, color, newIndicator } = this.props; 

        return (
            <TouchableHighlight 
                underlayColor={color}
                onPress={() => {this._handlePress()}} 
                style={[styles.container, this.props.style]}>
                <View
                    style={[styles.thumbnail, (featured ? styles.featured : ''), , {backgroundColor: color}]}
                >
                    {
                        newIndicator &&
                        <View 
                            style={{ 
                                backgroundColor: 'black', 
                                borderBottomLeftRadius: 5,
                                borderTopRightRadius: 5,
                                paddingLeft: 5, 
                                paddingRight: 5, 
                                alignSelf: 'flex-start', 
                                marginLeft: 5 ,
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                zIndex: 9
                            }}>
                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 10 }}>New</Text>
                        </View>
                    }
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: '700',
                        textAlign: 'center',
                        padding: 10
                    }}>{ this.props.name ? this.props.name.match(/\b(\w)/g).join('') : '' }</Text>
                    {
                        this.state.reStoreCompleted &&
                        <OfflineImage
                            key={art}
                            resizeMode={'contain'}
                            onLoadEnd={(sourceUri) => {
                                console.log('Loading finished for image with path: ', sourceUri)
                            }}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: 5,
                                overflow: 'hidden',
                                zIndex: 1
                            }}
                            source={{ uri : art }}
                        /> 
                    }
                </View>
            </TouchableHighlight>
        );

    }
}