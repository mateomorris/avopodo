import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

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
                    marginLeft: 10, 
                    marginRight: 10,
                    flexDirection: 'row',
                    height: 75
                }} onPress={this.props.onDetailPress}>
                    <View style={{
                        paddingRight: 10
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: '#666666'
                        }}>{theDate}</Text>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "600"
                        }} ellipsizeMode='tail' numberOfLines={1}>{info.title}</Text>
                    </View>
                    <TouchableOpacity style={{
                        paddingLeft: 20,
                        position: 'absolute',
                        right: 5,
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        bottom: 0,
                        top: 0,
                        zIndex: 9
                    }} onPress={() => {
                        this.props.onPlayPress()
                    }}>
                        <Image 
                            source={require('../assets/play-gray.png')}
                            style={{
                                width: 20,
                                height: 20
                            }}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        );

    }
}