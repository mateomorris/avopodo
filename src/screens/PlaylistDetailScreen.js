import React, { Component } from 'react';
import { Platform, View, Text, Image, ImageBackground, TextInput, ScrollView, TouchableOpacity, Picker, Alert, FlatList, KeyboardAvoidingView } from 'react-native';
import Button from 'antd-mobile-rn/lib/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SvgUri from 'react-native-svg-uri';
import { Navigation } from 'react-native-navigation';

import playlistIcons from 'assets/newPlaylistIcons'
import IconPanel from 'components/IconPanel'

import { LightBox } from 'components/LightBox';
import * as actions from 'actions'

class PlaylistDetailScreen extends Component {

    state = {
        playlistId : this.props.playlist.id,
        showPlaylistDetails : false,
        playlistName : this.props.playlist.name,
        checkedShows : this.props.playlist.shows,
        shows: this.props.playlist.shows,
        releaseRange: this.props.playlist.released,
        episodeLength: this.props.playlist.length,
        playFirst: this.props.playlist.playFirst,
        selectedPlaylistIcon: this.props.playlist.icon,
        episodeQueue : this.props.playlist.episodeQueue
    }


    componentWillMount() {

        let { playlist } = this.props

        // let shows = playlist.shows.map((showId) => {
        //     return this.props.state.subscribedShows.find((subscribedShow) => {
        //         return subscribedShow.id == showId
        //     }).map(() => {

        //     })
        // })

        // let restOfSubscribedShows = this.props.state.subscribedShows.filter((show) => {
        //     if (!playlist.shows.find((showId) => {
        //         return showId == show.id
        //     })) {
        //         return show
        //     }
        // })

        // this.setState({
        //     shows: [...shows, ...restOfSubscribedShows]
        // })

        TextInput.defaultProps = { allowFontScaling: false }

    }

    _getShowList = () => {
        let { playlist } = this.props

        let shows = playlist.shows.map((showId) => {
            return this.props.state.subscribedShows.find((subscribedShow) => {
                return subscribedShow.id == showId ? subscribedShow : false
            })
        })

        let restOfSubscribedShows = this.props.state.subscribedShows.filter((show) => {

            if (!playlist.shows.find((showId) => { 
                return showId == show.id;
            })) {
                console.log(show)
                return show
            }
        })

        console.log( shows, restOfSubscribedShows )

        return [...shows, ...restOfSubscribedShows]
    }

    _updatePlaylist = () => {
        return {
            duration : this.state.episodeLength,
            episodeQueue : '',
            length : '',
            name : this.state.playlistName,
            playFirst : this.state.playFirst,
            released : this.state.releaseRange,
            shows : this.state.checkedShows
        }
    }

    _addShowToNewPlaylist = (showId) => {
        if (this.state.checkedShows.includes(showId)) {
            this.setState({ 
                shows: this.state.shows.filter((item) => {
                            return item != showId
                }),
                checkedShows: this.state.checkedShows.filter((item) => {
                    return item != showId
                })
        })} else {
            this.setState({ 
                shows: this.state.shows.concat([showId]),
                checkedShows: this.state.checkedShows.concat([showId])
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
        console.log(this.state)
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
                        <ImageBackground source={{uri: item.image}} style={{
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

    _generateAndSetNewQueue = (playlist) => {
        console.log(playlist, this.state)
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
                        shows : this.state.checkedShows,
                        icon : this.state.selectedPlaylistIcon
                    })
                    Navigation.dismissOverlay(this.props.componentId)
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
                shows : this.state.checkedShows,
                icon : this.state.selectedPlaylistIcon
            })
            Navigation.dismissOverlay(this.props.componentId)
        } else {
            Navigation.dismissOverlay(this.props.componentId)
        }
    }

    _renderPlaylistItem = ({item}) => {
        return <View style={{
            width: '100%',
            borderBottomWidth : 0.5,
            borderBottomColor: '#333',
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection : 'row',
        }}>
            <Image source={{ uri : item.showImage }} 
                style={{
                    width: 45,
                    height: 45,
                    borderRadius: 2.5,
                    marginRight: 10,
                    backgroundColor: item.showColor
                }}
            />
            <View style={{
                flexDirection : 'column',
                alignItems : 'flex-start',
                justifyContent : 'flex-start',
                flex: 1
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 17,
                    height: 20
                }} numberOfLines={1} ellipsizeMode={'tail'}>{ item.title }</Text>
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
                    }} numberOfLines={1} ellipsizeMode={'tail'}>{ this.props.actions.formatDate(item.publishDate).full }</Text>
                </View>
            </View>
        </View>
    }
    

    render() {

        let { playlist } = this.props

        return(
            <KeyboardAvoidingView behavior="padding">
                <LightBox componentId={this.props.componentId} style={{
                    paddingBottom: 25
                }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingTop: 25,
                        paddingLeft: 25,
                        paddingBottom: 5,
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <SvgUri width="30" height="30" svgXmlData={playlistIcons[playlist.icon]} fill={'white'} fillAll={true} style={{ marginRight: 10 }}/>
                        <Text style={{
                            fontSize: 30, 
                            fontWeight: '700',
                            color: 'white',
                        }}>{playlist.name}</Text>
                    </View>
                    {/* <View
                        style={{
                            backgroundColor: 'white',
                            height: 5,
                            width: 45,
                            marginTop: 10,
                            marginBottom: 15,
                            borderRadius: 1,
                            marginLeft: 25, 
                        }}
                    ></View> */}
                    <FlatList
                    keyExtractor={(item, index) => item.id}
                    data={playlist.episodeQueue.episodeList}
                    renderItem={this._renderPlaylistItem}
                    style={{
                        paddingLeft: 25, 
                        paddingRight: 25,
                        paddingBottom: 25,
                        backgroundColor: 'rgba(0,0,0,.3)',
                    }}
                    />
                </LightBox>
            </KeyboardAvoidingView>
        )
    }
}

function mapStateToProps(state, ownProps) {
	return {
        state : state,
		playlists : state.playlists
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetailScreen);
