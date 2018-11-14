import React, { Component } from 'react';
import { Platform, View, Text, Image, ImageBackground, TextInput, ScrollView, TouchableOpacity, Picker, Alert, FlatList, KeyboardAvoidingView } from 'react-native';
import Button from 'antd-mobile-rn/lib/button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SvgUri from 'react-native-svg-uri';
import { Navigation } from 'react-native-navigation';

import playlistIcons from '../assets/newPlaylistIcons'
import IconPanel from '../components/IconPanel'

import Lightbox from '../components/Lightbox';
import * as actions from '../redux/actions'

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
                <Image source={require('../assets/checkmark.png')} style={{
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
                <Lightbox componentId={this.props.componentId} style={{
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
                    {
                        this.state.showPlaylistDetails &&
                        <View>
                            <Text style={{
                                fontSize: 20,
                                color: 'white',
                                paddingLeft: 25, 
                                paddingTop: 10
                            }}>Episodes from which shows?</Text>
                            <ScrollView style={{
                                backgroundColor: 'rgba(0,0,0,.3)',
                                marginBottom: 10,
                                marginTop: 10
                            }}>
                                <FlatList
                                horizontal={true}
                                data={this._getShowList()}
                                extraData={this.props.state}
                                renderItem={({item, separators}) => (
                                    <TouchableOpacity onPress={() => { this._addShowToNewPlaylist(item.id) }}>
                                        <ImageBackground source={{uri: item.imageHighRes}} style={{
                                            height: 100, 
                                            width: 100,
                                            margin: 10,
                                            marginRight: 0,
                                            borderRadius: 10
                                        }}>
                                            { 
                                                this.state.checkedShows.includes(item.id) &&
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
                        </View>
                    }
                    <View style={{
                        padding: 20,
                        flexDirection: 'row'
                    }}>
                        {   this.state.showPlaylistDetails &&
                            <Button 
                            onClick={() => {
                                    Alert.alert(
                                        'Are you sure you want to delete this station?',
                                        '(no take-backs)',
                                        [
                                            {text: 'No', onPress: () => {}},
                                            {text: 'Yes', onPress: () => {
                                                this.props.actions.removePlaylist(this.state.playlistId)
                                                Navigation.dismissOverlay(this.props.componentId)
                                            }}
                                        ]
                                    )
                            }} 
                            style={{
                                backgroundColor: 'red',
                                borderColor: 'transparent',
                                marginRight: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                    <Image source={require('../assets/x.png')} style={{
                                    flex: 1,
                                    height: '100%',
                                    width: 50
                                    }} resizeMode={'contain'}/>
                            </Button>
                        }
                        <Button 
                        onClick={() => {
                                this.state.showPlaylistDetails ? 
                                this._editPlaylist(this._updatePlaylist()) :
                                this.setState({
                                    showPlaylistDetails : true
                                })
                        }}
                        style={{
                            flex: 1
                        }}>
                            <Text>
                                { this.state.showPlaylistDetails ? 'Save' : 'Edit' } Station
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
