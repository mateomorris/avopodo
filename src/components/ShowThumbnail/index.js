import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Alert, Dimensions, ImageBackground, Animated } from 'react-native';
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
        reStoreComplete : false,
        pressedScale: new Animated.Value(1)
    }

    _handlePress = () => {
        Animated.spring(            
            this.state.pressedScale,         
            {
                toValue: 0.95, 
                speed: 20,
                useNativeDriver: true
            }    
        ).start(() => {
            // Navigation.dismissOverlay(this.props.componentId)
        });
        // this.props.onPress();
    }

    _handleInitialPress = () => {
        Animated.spring(            
            this.state.pressedScale,         
            {
                toValue: 0.95, 
                speed: 50,
                useNativeDriver: true
            }    
        ).start(() => {
            // Navigation.dismissOverlay(this.props.componentId)
        });
    }

    _handleRelease = () => {
        this.props.onPress();
        Animated.timing(            
            this.state.pressedScale,         
            {
                toValue: 1, 
                duration: 500,
                useNativeDriver: true
            }    
        ).start(() => {
            // this.props.onPress();
        });
    }

    _handleCancel = () => {
        Animated.spring(            
            this.state.pressedScale,         
            {
                toValue: 1, 
                speed: 10,
                useNativeDriver: true
            }    
        ).start(() => {
            // this.props.onPress();
        });
    }

    componentDidMount() {
        OfflineImageStore.restore(
        {
        name: `show_art`,
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
                // onPress={() => {this._handlePress()}} 
                // onResponderGrant={() => {
                //     Alert.alert('yeah')
                // }}
                style={[styles.container, this.props.style]}>
                <Animated.View
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={() => {
                        this._handlePress()
                    }}
                    onResponderRelease={() => {
                        this._handleRelease()
                    }}
                    onResponderTerminate={() => {
                        this._handleCancel()
                    }}
                    style={[
                        styles.thumbnail, 
                        (featured ? styles.featured : ''),
                        {
                            transform: [{
                                scale : this.state.pressedScale
                            }],
                            backgroundColor: color
                        }
                    ]}
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
                </Animated.View>
            </TouchableHighlight>
        );

    }
}