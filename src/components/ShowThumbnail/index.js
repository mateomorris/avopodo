import React from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight, Alert, Dimensions, ImageBackground, Animated } from 'react-native';
import { OfflineImage, OfflineImageStore } from 'react-native-image-offline';
import { animate } from 'helpers/animations'
import { BORDER_RADIUS, SHADOW } from 'constants';

import { TouchableView } from 'components/Button'

const thumbnailSize = ( Dimensions.get('window').width / 3 ) - (10 / 3)

const styles = StyleSheet.create({
    container: {
        ...SHADOW,
        justifyContent: 'center',
        alignItems: 'center',
        width: thumbnailSize,
        height: thumbnailSize,
    },
    thumbnail: { 
        width: '90%',
        height: '90%',
        borderRadius: BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
    },
    featured: {
        width: 120,
        height: 120
    }
});

export default class ShowThumbnail extends React.Component {

    state = {
        reStoreComplete : false,
        pressedScale: new Animated.Value(1),
        shadowOpacity: new Animated.Value(0.75)
    }

    _handlePress = () => {

        animate([
            {
                property : this.state.shadowOpacity,
                toValue : 0.25,
            }, 
            {
                property : this.state.pressedScale,
                toValue : 0.98
            }
        ]);
    }

    _handleRelease = () => {

        this.props.onPress();

        animate([
            {
                property : this.state.pressedScale,
                toValue : 1,
                animation : 'timing',
                duration : 500
            },
            {
                property: this.state.shadowOpacity,
                toValue : 0.75,
                animation : 'timing',
                duration: 500
            }
        ])

    }

    _handleCancel = () => {
        animate([
            {
                property : this.state.pressedScale,
                toValue : 1,
                speed : 10
            },
            {
                property : this.state.shadowOpacity,
                toValue : 0.75,
                animation : 'timing',
                duration : 500
            }
        ])
    }

    componentDidMount() {
        OfflineImageStore.restore(
        {
        name: `show_art`,
        // imageRemoveTimeout: 30, // expire image after 30 seconds, default is 3 days if you don't provide this property.
        // debugMode: true,
        }, () => {
            this.setState({ reStoreCompleted: true });
            OfflineImageStore.preLoad(this.props.art);
        })
    }

    render() {

        const { art, featured, color, newIndicator } = this.props; 

        return (
            <Animated.View 
                underlayColor={color}
                style={[styles.container, this.props.style, { shadowOpacity : this.state.shadowOpacity }]}>
                <TouchableView
                    onInitialPress={() => {
                        this._handlePress()
                    }}
                    onRelease={(completed) => {
                        completed ? this._handleRelease() : this._handleCancel()
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
                    }}>{ this.props.name }</Text>
                    {/* }}>{ this.props.name ? this.props.name.match(/\b(\w)/g).join('') : '' }</Text> */}
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
                </TouchableView>
            </Animated.View>
        );

    }
}