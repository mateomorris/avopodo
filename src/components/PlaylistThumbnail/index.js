import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, TouchableHighlight } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SvgUri from 'react-native-svg-uri';
import { BlurView } from 'react-native-blur';

const styles = StyleSheet.create({
    containerOuter: { 
        borderRadius: 4, 
        backgroundColor: 'transparent',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 0.75,
        margin: 5,
    },
    containerInner: { 
        // overflow: 'hidden', 
        borderRadius: 10,
        flexDirection: 'row'
    },
    backgroundImages: { 
        flexDirection: 'row-reverse', 
        height: 0,
        position: 'absolute',
        right: 0,
        borderRadius: 20
    },
    backgroundImage: {
        width: 'auto'
    },
    infoContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        alignSelf: 'flex-end',
        paddingTop: 10, 
        paddingBottom: 10, 
        paddingLeft: 20,
        height: 75, 
        paddingRight: 60,
        // backgroundColor: 'black',
        // shadowColor: 'black',
        // shadowOffset: {
        //     width: 30,
        //     height: 0
        // },
        // shadowRadius: 5,
        // shadowOpacity: 1
    },
    icon: { 
        width: 40, 
        height: 40, 
        marginRight: 10
    },
    title: { 
        fontSize: 15, 
        fontWeight: '800', 
        color: 'white' 
    },
    duration: { 
        fontSize: 15, 
        color: 'white' 
    }
});

export default class PlaylistThumbnail extends React.Component {

    state = {
        pressStatus : false,
        containerHeight: 0
    }

    _handleRightPress = () => {
        this.props.onRightPress();
    }

    _handleLeftPress = () => {
        this.props.onLeftPress();
    }

    _setButtonComponentIcon = (label) => {
        if (label == 'Remove') {
            return require('assets/x-black.png');
        } else if (label == 'Revise') {
            return require('assets/edit.png');
        }
    }

    _handlePlaylistButtonPress = (label) => {
        Alert.alert(label);
    }

    buttonComponent = (label) => {
        return (
            <TouchableOpacity style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => {this._handlePlaylistButtonPress(label)}}>
                <Image source={this._setButtonComponentIcon(label)} style={{ height: 25, width: 25, paddingBottom: 5 }}/>
                <Text style={{ fontSize: 10 }}>{ label }</Text>
            </TouchableOpacity>
        )
    }

    _durationLabel = (duration) => {
        if (duration > 40) {
            return `40+ hours`;
        } else if (duration > 24) {
            return `24+ hours`;
        } else if (duration > 10) {
            return `10+ hours`
        } else {
            return `${duration} hours`
        }
    }

    _onHideUnderlay(){
        this.setState({ pressStatus: false });
    }
    _onShowUnderlay(){
        this.setState({ pressStatus: true });
    }

    render() {

        const { icon, title, duration, episodes, testing } = this.props; 

        const playlistButtons = [
            {
                component: this.buttonComponent('Remove'),
                backgroundColor: 'transparent'
            },
            {
                component: this.buttonComponent('Revise'),
                backgroundColor: 'transparent'
            },  
        ]

        return (
            <View style={{ overflow: 'hidden' }}>
                <View style={[styles.containerOuter, { shadowOpacity: this.state.pressStatus ? 0.4 : 0.75 }]}>
                    <View style={[styles.containerInner, {
                        borderRadius: 50,
                        backgroundColor: 'black'
                    }]}
                    onLayout={(e) => {
                        this.setState({
                            containerHeight: e.nativeEvent.layout.height,
                        })
                    }}
                    >
                        <TouchableHighlight
                        activeOpacity={0.5}
                        onPress={() => this._handleRightPress()}
                        style={{ 
                            width: '100%',
                            position: 'absolute',
                            borderRadius: 5,
                            overflow: 'hidden'
                        }}
                        onHideUnderlay={this._onHideUnderlay.bind(this)}
                        onShowUnderlay={this._onShowUnderlay.bind(this)}
                        >
                            <View style={[{ width: '100%', flexDirection: 'row-reverse', justifyContent: 'flex-start' }]}>
                                {
                                    episodes ? episodes.slice(0,3).map((episode, index) => {
                                        return (
                                            <Image source={{uri: episode.showImage, cache: 'force-cache'}} style={[styles.backgroundImage, { height: this.state.containerHeight, width: this.state.containerHeight }]} key={index}/>
                                        )
                                    }) : null
                                }
                            </View>
                        </TouchableHighlight>
                        <LinearGradient style={[styles.infoContainer, {
                            borderRadius: 5,
                            overflow: 'hidden',
                        }]} start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}} colors={['black', 'rgba(0,0,0,0.9)', 'transparent']} locations={[0,0.8,1]}>
                            <TouchableOpacity 
                                onPress={() => this._handleLeftPress()}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                                >
                                <View style={{
                                    paddingRight: 10
                                }}>
                                {
                                    !this.props.testing &&
                                    <SvgUri width="30" height="30" svgXmlData={icon} fill={'white'} fillAll={true}/>
                                }
                                </View>
                                <View>
                                    <Text style={ styles.title }>{ title.toUpperCase() }</Text>
                                    <Text style={ styles.duration }>{ this._durationLabel(duration) }</Text>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>

                        {
                            this.props.currentPlaylist.id == this.props.playlist.id ? 
                            <View pointerEvents="none" style={{ 
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: this.state.containerHeight,
                                borderRadius: 4,
                                overflow: 'hidden'
                            }}>
                                {
                                    !this.props.testing &&
                                    <View style={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                    }}>
                                        <BlurView
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                position: 'absolute'
                                            }}
                                            viewRef={this.state.viewRef}
                                            blurType="dark"
                                            blurAmount={5}
                                        />
                                        <SvgUri style={
                                            {
                                                // position: 'absolute',
                                                // right: 5,
                                                // bottom: 5,
                                                zIndex: 99999
                                        }} width="35" height="35" source={this.props.playing ? require('assets/interface-icons/pause.svg') : require('assets/interface-icons/play.svg') } fill={'#EEE'} fillAll={true}/>
                                    </View>
                                }
                            </View> 
                            :
                            <View pointerEvents="none" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    !this.props.testing &&
                                    <SvgUri style={
                                        {
                                            height: 20,
                                            width: 20,
                                            position: 'absolute',
                                            right: 5,
                                            bottom: 5,
                                            zIndex: 99999
                                    }} width="20" height="20" source={require('assets/interface-icons/play.svg')} fill={'#EEE'} fillAll={true}/>
                                }
                            </View>
                        }

                    </View>
                </View>
            </View>          
        );

    }
}
