import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, TextInput, ScrollView, TouchableOpacity, Picker, Alert, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import Button from 'antd-mobile-rn/lib/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import IconPanel from '../components/IconPanel'
import Lightbox from '../components/Lightbox';
import * as actions from '../redux/actions';

import playlistIcons from '../assets/playlist-icons'

import SvgUri from 'react-native-svg-uri';

class PlaylistCreationScreen extends Component {

    state = {
        iconPanelExpanded : false,
        selectedPlaylistIcon : Object.keys(playlistIcons)[Math.floor(Math.random()*Object.keys(playlistIcons).length)], // get a random icon
        playlistId : Date.now(),
        playlistName : [
            'Morning Starter',
            'News Brief',
            'Commuting',
            'Late Night Drive',
            'Background Noise',
            'Mindblowers',
            'Sleepy Time',
            'Supper Sounds'
        ][Math.floor(Math.random()*8)],
        shows: [],
        releaseRange: 'week',
        episodeLength: 'ten-minutes',
        playFirst: 'oldest'
    }


    componentWillMount() {

    }

    _addShowToNewPlaylist = (showId) => {
        if (this.state.shows.includes(showId)) {
            this.setState({ shows: this.state.shows.filter((item) => {
                return item != showId
            }) }, () => {

            })
        } else {
            this.setState({ shows: this.state.shows.concat([showId]) }, () => {

            })
        }
    }

    _renderCheckMark = (itemId) => {
        return (
            <View style={{
                backgroundColor: 'rgba(0,0,0,.5)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={require('../assets/checkmark.png')} style={{
                    height: 50, 
                    width: 50
                }}/>
            </View>
        )
    }

    componentDidUpdate = () => {

    }

    _renderShowAddtion() {

        return (
            <ScrollView style={{
                backgroundColor: 'rgba(0,0,0,.3)',
                marginBottom: 10
            }}>
                <FlatList
                horizontal={true}
                data={this.props.subscribedShows}
                renderItem={({item, separators}) => (
                    <TouchableOpacity onPress={() => { this._addShowToNewPlaylist(item.id) }}>
                        <ImageBackground source={{uri: item.image, cache: 'force-cache'}} style={{
                            height: 100, 
                            width: 100,
                            margin: 10,
                            borderRadius: 5
                        }}>

                        </ImageBackground>
                    </TouchableOpacity>
                )}
                />
            </ScrollView>
        )
    }

    _tertiaryExplanation = () => {
        Alert.alert(
            "No se puede conseguir ningunos episodios basado en tus decisiones. Trate de ponerle mas.",
            "",
            [
                {text: 'Esta bien', onPress: () => console.log('Cancel Pressed')}
            ]
        )
    }

    _secondaryExplanation = () => {
        Alert.alert("No episodes could be found based on your criteria, so you'll need to make your criteria less specific to get episodes","",[
            {text: 'Que?', onPress: () => this._tertiaryExplanation()},
            {text: 'Okay', onPress: () => console.log('Cancel Pressed')}
        ])
    }

    _createPlaylist = () => {
        this.props.actions.createPlaylistQueue(this.state).then((response) => {
            if (response) {
                this.props.actions.subscribeToPlaylist(this.state)
                this.props.actions.setPlaylistQueue(this.state.playlistId, response.episodeList, response.episodeListDuration)
                Navigation.dismissOverlay(this.props.componentId)
            } else {
                Alert.alert(
                    'No episodes fit criteria, try casting a wider net',
                    '',
                    [
                        {text: 'What?', onPress: () => this._secondaryExplanation()},
                        {text: 'Okay', onPress: () => console.log('Cancel Pressed')},
                    ],
                )
            }
        })
    }
    

    render() {

        return(
            <KeyboardAvoidingView behavior="padding">
                <Lightbox componentId={this.props.componentId} style={{
                    paddingBottom: 25
                }}>
                    <Text style={{
                        fontSize: 30, 
                        fontWeight: '700',
                        color: 'white',
                        paddingTop: 25,
                        paddingLeft: 25, 
                    }}>Create a Playlist</Text>
                    <View
                        style={{
                            backgroundColor: 'white',
                            height: 5,
                            width: 45,
                            marginTop: 10,
                            marginBottom: 15,
                            borderRadius: 1,
                            marginLeft: 25, 
                        }}
                    ></View>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                    }}>Episodes from which shows?</Text>
                    {/* { this._renderShowAddtion() } */}
                    <ScrollView style={{
                        backgroundColor: 'rgba(0,0,0,.3)',
                        marginBottom: 10,
                        marginTop: 10
                    }}>
                        <FlatList
                        horizontal={true}
                        data={this.props.subscribedShows}
                        extraData={this.state}
                        renderItem={({item, separators}) => (
                            <TouchableOpacity onPress={() => { this._addShowToNewPlaylist(item.id) }}>
                                <ImageBackground source={{uri: item.image, cache: 'force-cache'}} style={{
                                    height: 100, 
                                    width: 100,
                                    margin: 10,
                                    marginRight: 0,
                                    borderRadius: 10,
                                    backgroundColor: item.color
                                }}>
                                    { 
                                        this.state.shows.includes(item.id) &&
                                        this._renderCheckMark(item.id) 
                                    }
                                </ImageBackground>
                            </TouchableOpacity>
                        )}
                        />
                    </ScrollView>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                    }}>Released when?</Text>
                    <View style={{ 
                        backgroundColor: 'rgba(0,0,0,.3)', 
                        flexDirection: 'row',
                        marginTop: 10,
                        marginBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 30,
                        paddingRight: 30
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 2.5
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: '700',
                                fontSize: 20
                            }}>
                                Within the past
                            </Text>
                        </View>
                        <Picker
                        style={{ 
                            flex: 1,
                            paddingLeft: 2.5,
                            marginLeft: 2.5,
                            borderLeftColor: 'rgba(0,0,0,.5)',
                            borderLeftWidth: 3
                        }}
                        selectedValue={this.state.releaseRange}
                        itemStyle={{
                            height: 100, 
                            textAlign: 'left',
                            color: '#eee',
                        }}
                        onValueChange={(value) => { this.setState({ releaseRange: value }) }}>
                            <Picker.Item label="week" value="week" />
                            <Picker.Item label="two weeks" value="two-weeks" />
                            <Picker.Item label="month" value="month" />
                            <Picker.Item label="eternity" value="eternity" />
                        </Picker>
                    </View>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                    }}>How long?</Text>
                    <View style={{ 
                        backgroundColor: 'rgba(0,0,0,.3)', 
                        flexDirection: 'row',
                        marginTop: 10,
                        marginBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 30,
                        paddingRight: 30
                    }}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 2.5
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: '700',
                                fontSize: 20
                            }}>
                                No longer than
                            </Text>
                        </View>
                        <Picker
                        style={{ 
                            flex: 1,
                            paddingLeft: 2.5,
                            marginLeft: 2.5,
                            borderLeftColor: 'rgba(0,0,0,.5)',
                            borderLeftWidth: 3
                        }}
                        selectedValue={this.state.episodeLength}
                        itemStyle={{
                            height: 100, 
                            textAlign: 'left',
                            color: '#eee',
                        }}
                        onValueChange={(value) => { this.setState({ episodeLength: value }) }}>
                            <Picker.Item label="10 minutes" value="ten-minutes" />
                            <Picker.Item label="30 minutes" value="thirty-minutes" />
                            <Picker.Item label="an hour" value="an-hour" />
                            <Picker.Item label="an eternity" value="an-eternity" />
                        </Picker>
                    </View>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                        marginBottom: 10
                    }}>Which play first?</Text>
                    <View style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: 'rgba(0,0,0,.3)', 
                        paddingTop: 20,
                        paddingBottom: 20,
                        flexDirection: 'row'
                    }}>
                        <Button style={{
                            flex: 1,
                            marginRight: 10,
                            fontSize: 10,
                            backgroundColor: this.state.playFirst ==  'oldest' ? '#222' : 'white'
                        }} onClick={() => {
                            this.setState({ playFirst: 'oldest' })
                        }}>
                            <Text style={{
                                color: this.state.playFirst ==  'oldest' ? 'white' : '#222'
                            }}>Oldest First</Text>
                        </Button>
                        <Button style={{
                            flex: 1,
                            fontSize: 10,
                            backgroundColor: this.state.playFirst ==  'newest' ? '#222' : 'white'
                        }} onClick={() => {
                            this.setState({ playFirst: 'newest' })
                        }}>
                            <Text style={{
                                color: this.state.playFirst ==  'newest' ? 'white' : '#222'
                            }}>Newest First</Text>
                        </Button>
                    </View>
                    <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                        marginBottom: 10,
                        marginTop: 10
                    }}>What's it called?</Text>
                    <View style={{
                        paddingLeft: 30,
                        backgroundColor: 'rgba(0,0,0,.3)', 
                        paddingTop: 20,
                        paddingBottom: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingRight: 30
                    }}>
                        <TextInput
                            style={{
                                height: 40, 
                                borderColor: 'gray', 
                                color: 'white',
                                fontSize: 18,
                                fontWeight: '700',
                                fontSize: 20,
                                textDecorationLine: 'underline'
                            }} 
                            onChangeText={(text) => this.setState({playlistName : text})}
                            value={ this.state.playlistName }
                        />
                        <TouchableOpacity 
                            style={{
                                width: 40,
                                height: 40,
                                backgroundColor: 'rgba(0,0,0,.3)',
                                borderRadius: 5,
                                padding: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                this.setState({
                                    iconPanelExpanded : this.state.iconPanelExpanded ? false : true
                                })
                            }}
                            >
                            <SvgUri width="30" height="30" source={playlistIcons[this.state.selectedPlaylistIcon]} fill={'white'} fillAll={true}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        padding: 20,
                        paddingTop: 0,
                        backgroundColor: 'rgba(0,0,0,.3)'
                    }}>
                        {
                            this.state.iconPanelExpanded &&
                            <IconPanel 
                                currentIcon={this.state.selectedPlaylistIcon}
                                icons={playlistIcons} 
                                iconSelected={(icon) => {
                                    this.setState({
                                        selectedPlaylistIcon : icon,
                                        iconPanelExpanded : this.state.iconPanelExpanded ? false : true
                                    })
                                }}/>
                        }
                    </View>
                    {/* <Text style={{
                        fontSize: 20,
                        color: 'white',
                        paddingLeft: 25, 
                        marginBottom: 10,
                        marginTop: 10
                    }}>Ready?</Text> */}
                    <View style={{
                        padding: 20
                    }}>
                        <Button onClick={() => {
                            this._createPlaylist()
                            }}>
                            <Text>
                                Create Playlist
                            </Text>
                        </Button>
                    </View>
                </Lightbox>
            </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistCreationScreen);
