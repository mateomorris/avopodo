import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import SvgUri from 'react-native-svg-uri';

import { CircleButton } from 'components/Button';
import icons from 'assets/generalIcons';

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
    thumbnail: { 
        width: 120, 
        height: 120, 
        borderRadius: 4
    }
});

export default class EpisodeRow extends React.Component {

    _getDate = (ms) => {
        const theDate = new Date(ms)
        const currentDate = new Date();

        const month = theDate.toLocaleString('en-us', { month: "long" })
        const day = theDate.getDate()
        const year = theDate.getFullYear();

        // Only show the year if it's past
        if (year == currentDate.getFullYear()) {
            return `${month} ${day}`;
        } else {
            return `${month} ${day}, ${year}`;
        }
    }

    render() {

        const { info, finished, buttonColor, playing } = this.props
        const theDate = this._getDate(info.publishDate);

        return (
            <View opacity={finished ? 0.5 : 1}>
                <TouchableOpacity 
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#CCC',
                    marginLeft: 10,
                    padding: 20,
                    paddingLeft: 10,
                    paddingRight: 10,
                    // marginLeft: 10, 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: 120
                }} onPress={this.props.onDetailPress}>
                    <View style={{
                        paddingRight: 45
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: '#666666'
                        }}>{theDate}</Text>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: '#333'
                        }} ellipsizeMode='tail' numberOfLines={1}>{info.title}</Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: '#666666'
                        }} ellipsizeMode='tail' numberOfLines={3}>{info.description}</Text>
                    </View>
                    <View style={{
                        paddingLeft: 10,
                        paddingRight: 25,
                        position: 'absolute',
                        right: 0,
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        bottom: 0,
                        top: 0,
                        zIndex: 9,
                    }}>
                        <CircleButton 
                            onPress={() => {
                                this.props.onPlayPress()
                            }}
                            icon={playing ? icons.pause : icons.play}
                            size={20}
                            spinner={false}
                            color={buttonColor}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );

    }
}