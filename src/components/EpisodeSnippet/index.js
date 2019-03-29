import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import { BlurView } from 'react-native-blur';
import { OfflineImage, OfflineImageStore } from 'react-native-image-offline';
import { animate } from 'helpers/animations'
import { Circle } from 'react-native-progress';

import icons from 'assets/generalIcons';
import { BORDER_RADIUS, SHADOW, COLORS } from 'constants';

const styles = StyleSheet.create({
    container: {
        margin: 5, 
        ...SHADOW
    },
    thumbnail: { 
        width: 100, 
        height: 100, 
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden'
    }
});

export class EpisodeSnippet extends React.Component {

    state = {
        titleHeight : null,
        SVGs : {
            play : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>button-play</title><path fill="black" d="M12,24A12,12,0,1,0,0,12,12.013,12.013,0,0,0,12,24Zm4.812-11.5a.939.939,0,0,1-.587.824L10.14,16.366a1.185,1.185,0,0,1-.531.133.919.919,0,0,1-.488-.136,1.032,1.032,0,0,1-.459-.911V9.546a.974.974,0,0,1,1.478-.914l6.085,3.043A.939.939,0,0,1,16.812,12.5Z"/></svg>`,
        },
        reStoreCompleted : false,
        pressedScale: new Animated.Value(1)
    }

    _normalizeDuration = (duration) => {
        let durationInHours = parseFloat(duration / (60 * 60)).toFixed(1)
        if (durationInHours < 1) {
            return `${durationInHours * 60}m`
        } else {
            return `${durationInHours}h`
        }
    }

    _getDate = (ms) => {
        const theDate = new Date(ms)
        const currentDate = new Date();
        const yesterday = new Date();

        yesterday.setDate(currentDate.getDate() - 1)

        const month = theDate.toLocaleString('en-us', { month: "long" })
        const day = theDate.getDate()
        const year = theDate.getFullYear();

        // Only show the year if it's past
        if (currentDate.toDateString() == theDate.toDateString()) {
            return 'Today';
        } else if (yesterday.toDateString() == theDate.toDateString()) {
            return 'Yesterday';
        } else if (year == currentDate.getFullYear()) {
            return `${month} ${day}`;
        } else {
            return `${month} ${day}, ${year}`;
        }
    }

    _renderOverlay = (active, duration, playing, downloadProgress = -1) => {
        if (active && downloadProgress >= 0) {
            return (
                <View 
                    style={{ 
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: 9,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                >
                    <BlurView
                        style={{ 
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            zIndex: 9
                        }}
                        viewRef={this.state.viewRef}
                        blurType="dark"
                        blurAmount={2.5}
                    />
                    {
                        <SvgUri style={{
                                zIndex: 10
                            }} width="40" height="40" svgXmlData={playing ? icons.pause : icons.play} fill={'#EEE'} fillAll={true}/>
                    }
                </View>
            )
        } else if (downloadProgress !== null && downloadProgress >= 0 && downloadProgress < .99) { // Download in progress
            return (
                <View 
                    style={{ 
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: 9,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                >
                    <BlurView
                        style={{ 
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            zIndex: 9
                        }}
                        viewRef={this.state.viewRef}
                        blurType="dark"
                        blurAmount={2.5}
                    />
                        <Circle 
                            style={{
                                zIndex: 10,
                                position: 'absolute'
                            }} 
                            indeterminate={downloadProgress == 0 ? true : false}
                            progress={downloadProgress}
                            size={75} 
                            color={'#FAFAFA'}
                            // borderWidth={0}
                            borderColor={downloadProgress == 0 ? 'rgba(250,250,250,0.5)' : 'rgba(250,250,250,0.1)'}
                        />
                        <SvgUri style={{
                                zIndex: 10,
                                position: 'absolute'
                            }} width="40" height="40" svgXmlData={icons.download} fill={'#EEE'} fillAll={true}/>
                </View>
            )
        } else {
            return (
                <View 
                    style={{ 
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: 9,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                >
                    <View 
                        style={{ 
                            backgroundColor: COLORS.black, 
                            borderBottomLeftRadius: 5,
                            borderTopRightRadius: 5,
                            paddingLeft: 5, 
                            paddingRight: 5, 
                            alignSelf: 'flex-start', 
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginLeft: 5 ,
                            position: 'absolute',
                            right: 0,
                            top: 0
                        }}>
                        {
                            downloadProgress > 0.99 &&
                            <SvgUri style={{
                                    paddingRight: 2
                                }} 
                                width="12"
                                height="12" 
                                source={require('assets/interface-icons/download.svg')} fill={'#EEE'} fillAll={true}/>
                        }
                        <Text style={{ color: 'white', fontWeight: '900' }}>{this._normalizeDuration(duration)}</Text>
                    </View>
                    <SvgUri style={
                        {
                            height: 20,
                            width: 20,
                            position: 'absolute',
                            right: 3,
                            bottom: 3,
                            zIndex: 99999
                    }} width="20" height="20" source={require('assets/interface-icons/play.svg')} fill={'#EEE'} fillAll={true}/>
                </View>
            )
        }
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
                OfflineImageStore.preLoad(this.props.data.showImage);
            }
        )
    }

    _handlePress = () => {
        animate([
            {
                property : this.state.pressedScale,
                toValue : 0.95,
                speed : 20
            }
        ])
    }

    _handleRelease = () => {
        this.props.onThumbnailPress();

       animate([
            {
                property : this.state.pressedScale,
                toValue : 1,
                animation: 'timing',
                delay : 1000
            }
        ])
    }

    _handleCancel = () => {
       animate([
            {
                property : this.state.pressedScale,
                toValue : 1,
                animation: 'spring',
                speed : 10
            }
        ])
    }

    render() {

        const { playing } = this.props
        const { title, showImage, showImageHighRes, duration, description, publishDate, showColor } = this.props.data; 

        return (
            <View style={{ flexDirection: 'row', height: 120 }}>
                <Animated.View style={[styles.container, { 
                    transform: [{
                        scale: this.state.pressedScale
                    }]
                }]}
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
                >
                    <View style={styles.thumbnail}>
                        <OfflineImage
                            key={showImage}
                            resizeMode={'contain'}
                            style={[
                                {
                                    height : '100%',
                                    width: '100%',
                                    backgroundColor: showColor,
                                }]
                            }
                            source={{ uri: showImageHighRes || showImage }}
                        /> 
                        <View 
                            style={{ 
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                zIndex: 9,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} 
                        >
                            {
                                this._renderOverlay(this.props.active, duration, this.props.playing, this.props.downloadProgress)
                            }
                        </View>
                    </View>
                </Animated.View>
                <TouchableOpacity style={{ flex: 1, paddingLeft: 10 }} onPress={() => { this.props.onDetailPress() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                        <Text 
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            style={{fontSize: 16, color: COLORS.black, fontWeight: '700', flex: 1}} 
                            onLayout={(e) => {
                                this.setState({
                                    titleHeight : e.nativeEvent.layout.height
                                })
                        }}>{title}</Text>
                    </View>
                    <View>
                        <Text 
                            style={{fontSize: 14, color: '#666666', fontWeight: '500'}}
                            numberOfLines={this.state.titleHeight == 20 ? 5 : 4} // Check if title is taking up more than one line
                            ellipsizeMode={'tail'}>
                            <Text style={{fontSize: 14, color: '#666666', fontWeight: '700'}}>{`${this._getDate(publishDate)}${ description ? ' | ' : ''}`}</Text>
                            {description}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

    }
}