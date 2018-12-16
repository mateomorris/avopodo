import React, { Component } from 'react';
import { Platform, View, Text, Image, ImageBackground, TextInput, ScrollView, TouchableOpacity, Picker, Alert, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';
import Button from 'antd-mobile-rn/lib/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import { MaterialIndicator } from 'react-native-indicators';

import { PlaylistPicker } from 'components/PlaylistPicker'
import IconPanel from 'components/IconPanel'
import { LightBox } from 'components/LightBox';
import StationDetail from 'components/StationDetail';
import * as actions from 'actions';

// import playlistIcons from 'assets/playlist-icons'
import playlistIcons from 'assets/newPlaylistIcons'

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
        playFirst: null,
        creatingPlaylist : false
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
                <Image source={require('assets/checkmark.png')} style={{
                    height: 50, 
                    width: 50
                }}/>
            </View>
        )
    }

    componentDidUpdate = () => {

    }

    componentDidMount() {
        TextInput.defaultProps = { allowFontScaling: false }
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
            "No se puede conseguir ningunos episodios basado en lo que escojistes. Trata algo mas.",
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

    _editPlaylist = () => {
        Navigation.dismissOverlay(this.props.componentId)
    }

    _createPlaylist = (playlist) => {
        this.setState({
            creatingPlaylist : true
        })
        this.props.actions.createPlaylistQueue(playlist).then((response) => {

            this.setState({
                creatingPlaylist : false
            })

            if (response) {
                this.props.actions.subscribeToPlaylist(playlist)
                this.props.actions.setPlaylistQueue(playlist.playlistId, response.episodeList, response.episodeListDuration)
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

        return (
            <KeyboardAvoidingView behavior="padding">
                <LightBox componentId={this.props.componentId} style={{
                    
                }}>
                    {
                        this.props.creatingPlaylist ? 
                        this.renderLoadingScreen() :
                        (this.props.playlist ? this.renderEditingScreen(this.props.playlist) : this.renderCreationScreen()) 
                    }
                </LightBox>
            </KeyboardAvoidingView>
        )
    }

    renderEditingScreen = (playlist) => {
        return (
            <StationDetail
                playlist={playlist}
                editPlaylist={() => {
                    this._editPlaylist()
                }}
            />
        )
    }

    renderCreationScreen = () => {
        return (
            <StationDetail
                createPlaylist={(playlist) => {
                    this._createPlaylist(playlist)
                }}
            />
        )
    }

    renderLoadingScreen = () => {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 20,
                paddingBottom: 30,
                paddingLeft: 20,
                paddingRight: 20
            }}>
                <MaterialIndicator color={ 'white' } size={100} animationDuration={3000} 
                style={{
                    padding: 50
                }}/>
                <Text style={{
                    fontSize: 25,
                    fontWeight: '600',
                    color: 'white'
                }}>Building your station,{`\n`}hang tight</Text>
            </View>
        )
    }
}

function mapStateToProps(state, ownProps) {
	return {
        state : state,
        subscribedShows: state.subscribedShows,
		playlists : state.playlists
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistCreationScreen);
