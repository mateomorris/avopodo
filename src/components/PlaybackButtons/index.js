import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import SvgUri from 'react-native-svg-uri';
import tinycolor from 'tinycolor2'
import { MaterialIndicator } from 'react-native-indicators';

import icons from 'assets/generalIcons';
import { CircleButton } from 'components/Button'

export class PlaybackButtons extends Component {

    state = {
        playing: null,
    }

    render() {

        let { color, buffering, playbackStatus } = this.props;

        return(
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CircleButton 
                    onPress={() => {
                        this.props.onJumpBack()
                    }}
                    icon={icons.seekBack}
                    size={60}
                    spinner={false}
                    color={color}
                    style={{
                        marginRight: 25
                    }}
                />
                <CircleButton 
                    onPress={() => {
                        this.props.onPlayPause()
                    }}
                    size={90}
                    icon={playbackStatus ? icons.pause : icons.play}
                    spinner={buffering}
                    color={color}
                    playbackStatus={playbackStatus}
                />
                <CircleButton 
                    onPress={() => {
                        this.props.onJumpForward()
                    }}
                    icon={icons.seekForward}
                    size={60}
                    spinner={false}
                    color={color}
                    style={{
                        marginLeft: 25
                    }}
                />
            </View>
        ) 
    }
}