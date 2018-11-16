import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import SvgUri from 'react-native-svg-uri';

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

        const { info, finished } = this.props
        const theDate = this._getDate(info.publishDate);

        return (
            <View opacity={finished ? 0.5 : 1}>
                <TouchableOpacity 
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#CCC',
                    padding: 20,
                    paddingRight: 10,
                    marginLeft: 10, 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: 75
                }} onPress={this.props.onDetailPress}>
                    <View style={{
                        paddingRight: 35
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: '#666666'
                        }}>{theDate}</Text>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: '#222'
                        }} ellipsizeMode='tail' numberOfLines={1}>{info.title}</Text>
                    </View>
                    <TouchableOpacity style={{
                        paddingLeft: 10,
                        paddingRight: 30,
                        position: 'absolute',
                        right: 15,
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        bottom: 0,
                        top: 0,
                        zIndex: 9,
                    }} onPress={() => {
                        this.props.onPlayPress()
                    }}>
                        {/* <Image
                            source={require('assets/play-gray.png')}
                            resizeMode={'center'}
                            style={{
                                position: 'absolute',
                                width: 20,
                                height: 20,
                                padding: 10
                            }}
                        /> */}
                        <SvgUri 
                            style={{ 
                                position: 'absolute',
                                // width: 20,
                                // height: 20,
                                // padding: 10
                            }} 
                            width="20" 
                            height="20" 
                            source={require('assets/interface-icons/play.svg')} 
                            fill={info.showColor} 
                            fillAll={true}
                        />
                        <Progress.Circle 
                            style={{
                                position: 'absolute',
                                opacity: 0.5
                                // top: -2,
                                // bottom: 0,
                                // left: -2,
                                // right: 0
                            }}
                            borderWidth={0}
                            size={24} 
                            color={info.showColor} 
                            progress={this.props.playProgress}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );

    }
}