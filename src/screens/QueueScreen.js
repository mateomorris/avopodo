import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TextInput, ScrollView, TouchableOpacity, Picker, Alert, FlatList } from 'react-native';
import Button from 'antd-mobile-rn/lib/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";

import Lightbox from '../components/Lightbox';
import * as actions from '../redux/actions'

class QueueScreen extends Component {

    state = {
        
    }

    _renderPlaylistItem = ({item}) => {
        return <View style={{
            width: '100%',
            borderBottomWidth : 0.5,
            borderBottomColor: '#333',
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection : 'row',
            height: 65
        }}>
            <Image source={{ uri : item.showImage, cache: 'force-cache' }} 
                style={{
                    width: 45,
                    height: 45,
                    borderRadius: 2.5,
                    marginRight: 10,
                    backgroundColor: '#EEEEEE'
                }}
            />
            <View style={{
                flexDirection : 'column',
                alignItems : 'flex-start',
                justifyContent : 'flex-start'
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 17,
                    height: 20
                }}>{ item.title }</Text>
                <View style={{
                    // borderBottomColor: item.showColor,
                    // borderBottomWidth: 2
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#FAFAFA',
                        fontWeight: '700',
                        padding : 2,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        height: 17,
                        marginTop: 2
                    }}>{ item.showTitle }</Text>
                </View>
            </View>
        </View>
    }

    render() {

        let { playlist, queue } = this.props

        return(
            <Lightbox componentId={this.props.componentId} style={{
                paddingBottom: 25,
                paddingLeft: 25, 
                paddingRight: 25, 
            }}>
                <Text style={{
                    fontSize: 30, 
                    fontWeight: '700',
                    color: 'white',
                    paddingTop: 25,
                }}>{ playlist ? playlist : 'Up Next' }</Text>
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 5,
                        width: 45,
                        marginTop: 10,
                        marginBottom: 15,
                        borderRadius: 1
                    }}
                ></View>
                <FlatList
                data={queue}
                renderItem={this._renderPlaylistItem}
                />
            </Lightbox>
        )
    }
}

function mapStateToProps(state, ownProps) {
	return {
        state : state.reducer,
		playlists : state.reducer.playlists
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(QueueScreen);
