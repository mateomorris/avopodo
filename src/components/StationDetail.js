import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Image, ImageBackground, Alert } from 'react-native';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { animate } from 'helpers/animations'
import { PlaylistPicker } from 'components/PlaylistPicker'
import IconPanel from 'components/IconPanel'
import Button from 'antd-mobile-rn/lib/button';
import playlistIcons from 'assets/newPlaylistIcons'
import * as actions from 'actions';

class StationDetail extends Component {

    state = {
        editing : false,
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
        episodeLength: 'fifteen-minutes',
        playFirst: null,
        creatingPlaylist : false
    }

    componentWillMount() {
        let { playlist } = this.props 

        if (playlist) {
            console.log(playlist)
            this.setState({
                editing: true, 
                playlistName : playlist.name, 
                playlistId: playlist.id,
                episodeLength: playlist.length,
                playFirst : playlist.playFirst,
                releaseRange: playlist.released,
                shows: playlist.shows,
                selectedPlaylistIcon : playlist.icon
            })
        } else {
            console.log('Creating playlist')
        }
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

    _createPlaylist = () => {
        this.props.createPlaylist(this.state)
    }

    _generateAndSetNewQueue = (playlist) => {
        if (
            playlist.released != this.state.releaseRange || 
            playlist.playFirst != this.state.playFirst ||
            playlist.duration != this.state.episodeLength ||
            playlist.shows != this.state.shows 
        ) {
            return this.props.actions.createPlaylistQueue({
                playlistName : this.state.playlistName,
                releaseRange : this.state.releaseRange,
                episodeLength : this.state.episodeLength,
                playFirst : this.state.playFirst,
                shows : this.state.shows
            }).then((response) => {
                if (response) {
                    // this.props.actions.setPlaylistQueue(this.state.playlistId, response.episodeList, response.episodeListDuration)
                    return {
                        episodeQueue : response.episodeList,
                        episodeQueueDuration : response.episodeListDuration
                    }
                } else {
                    return {
                        episodeQueue : [],
                        episodeQueueDuration : 0
                    }
                }
            }, () => {
                console.log('Error creating playlist')
            })
        } else {
            return {
                episodeQueue : playlist.episodeQueue,
                episodeQueueDuration : this.state.episodeLength
            }
        }
    }

    _editPlaylist = () => {
        let { released, playFirst, duration, shows } = this.props.playlist

        if (
            released != this.state.releaseRange || 
            playFirst != this.state.playFirst ||
            duration != this.state.episodeLength ||
            shows != this.state.shows 
        ) {
            this._generateAndSetNewQueue(this.props.playlist).then((response) => {
                if (response.episodeQueue.length > 0) {
                    this.props.actions.editPlaylist({
                        id : this.state.playlistId,
                        duration : this.state.episodeLength,
                        episodeQueue : {
                            episodeList : response.episodeQueue,
                            episodeListDuration : response.episodeQueueDuration
                        },
                        name : this.state.playlistName,
                        playFirst : this.state.playFirst,
                        released : this.state.releaseRange,
                        shows : this.state.shows,
                        icon : this.state.selectedPlaylistIcon
                    })
                    this.props.editPlaylist()
                } else {
                    Alert.alert(
                        'No episodes fit criteria, try casting a wider net',
                        '',
                        [
                            {text: 'Okay', onPress: () => console.log('Cancel Pressed')},
                        ],
                    )
                }
            })
        } else if (this.props.playlist.icon != this.state.selectedPlaylistIcon) {
            this.props.actions.editPlaylist({
                id : this.state.playlistId,
                duration : this.state.episodeLength,
                episodeQueue : this.state.episodeQueue,
                name : this.state.playlistName,
                playFirst : this.state.playFirst,
                released : this.state.releaseRange,
                shows : this.state.shows,
                icon : this.state.selectedPlaylistIcon
            })
            this.props.editPlaylist()
        } else {
            this.props.editPlaylist()
        }
    }


    render() {
        return (
            <View style={{
                paddingBottom: 25
            }}>
                <Text style={{
                    fontSize: 30, 
                    fontWeight: '700',
                    color: 'white',
                    paddingTop: 25,
                    paddingLeft: 25, 
                }}>{ this.state.editing ? `Edit` : `Create a`} Station</Text>
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
                    initialNumToRender={4}
                    renderItem={({item, separators}) => (
                        <TouchableOpacity style={{ 
                            borderRadius: 5,
                            height: 100, 
                            width: 100,
                            margin: 10,
                            marginRight: 0,
                            borderRadius: 5,
                            overflow: 'hidden',
                            backgroundColor: item.color,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}  onPress={() => { this._addShowToNewPlaylist(item.id) }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 16,
                                fontWeight: '800',
                                padding: 10,
                                textAlign: 'center',
                            }}
                            ellipsizeMode='tail' 
                            numberOfLines={3}>
                            { item.title }</Text>
                            <ImageBackground source={{uri: item.imageHighRes, cache: 'force-cache'}} style={{
                                height: '100%', 
                                width: '100%',
                                position: 'absolute',
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
                <PlaylistPicker 
                    title={'Released when?'}
                    label={'Within the past'}
                    items={[
                        {
                            label: 'week',
                            value: 'week'
                        },
                        {
                            label: 'two weeks',
                            value: 'two-weeks'
                        },
                        {
                            label: 'month',
                            value: 'month'
                        },
                        {
                            label: 'eternity',
                            value: 'eternity'
                        }
                    ]}
                    selectedValue={this.state.releaseRange}
                    updateValue={(releaseRange) => {
                        this.setState({
                            releaseRange
                        })
                    }}
                />
                <PlaylistPicker 
                    title={'How long?'}
                    label={'No longer than'}
                    items={[
                        {
                            label: '15 minutes',
                            value: 'fifteen-minutes'
                        },
                        {
                            label: '30 minutes',
                            value: 'thirty-minutes'
                        },
                        {
                            label: 'one hour',
                            value: 'an-hour'
                        },
                        {
                            label: 'an eternity',
                            value: 'an-eternity'
                        }
                    ]}
                    selectedValue={this.state.episodeLength}
                    updateValue={(episodeLength) => {
                        this.setState({
                            episodeLength
                        })
                    }}
                />


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
                    flexDirection: 'row',
                    justifyContent:  'center',
                    alignItems: 'center'
                }}>
                    <Button style={{
                        flex: 1,
                        marginRight: 10,
                        backgroundColor: this.state.playFirst ==  'oldest' ? '#222' : 'white'
                    }} onClick={() => {
                        this.setState({ playFirst: 'oldest' })
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: this.state.playFirst ==  'oldest' ? 'white' : '#222'
                        }}>Oldest</Text>
                    </Button>
                    <Button style={{
                        flex: 1,
                        marginRight: 10,
                        backgroundColor: this.state.playFirst ==  'newest' ? '#222' : 'white'
                    }} onClick={() => {
                        this.setState({ playFirst: 'newest' })
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: this.state.playFirst ==  'newest' ? 'white' : '#222'
                        }}>Newest</Text>
                    </Button>
                    <Button style={{
                        flex: 1,
                        marginRight: 10,
                        backgroundColor: this.state.playFirst ==  'shuffle' ? '#222' : 'white'
                    }} onClick={() => {
                        this.setState({ playFirst: 'shuffle' })
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: this.state.playFirst ==  'shuffle' ? 'white' : '#222'
                        }}>Shuffle</Text>
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
                            textDecorationLine: 'underline',
                            overflow: 'visible',
                            flex: 1
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
                        <SvgUri width="30" height="30" svgXmlData={playlistIcons[this.state.selectedPlaylistIcon]} fill={'white'} fillAll={true}/>
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
                            }}
                        />
                    }
                </View>
                <View style={{
                    padding: 20
                }}>
                    <Button onClick={() => {
                        if (this.state.shows.length > 0 && !this.state.editing) {
                            this._createPlaylist() 
                        } else if (this.state.shows.length > 0 && this.state.editing) {
                            this._editPlaylist()
                        } else {
                            Alert.alert('Add at least one show to the station')
                        }
                        }}>
                        <Text>
                            { this.state.editing ? `Finish Editing` : `Create`} Station
                        </Text>
                    </Button>
                </View> 
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

export default connect(mapStateToProps, mapDispatchToProps)(StationDetail);
