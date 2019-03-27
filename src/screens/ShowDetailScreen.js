import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import { ShowDetail } from 'components/ShowDetail';
import EpisodeRow from 'components/EpisodeRow';
import PlayBar from 'components/PlayBar';
import { LoadingIndicator, SmallLoadingIndicator } from 'components/SimpleComponents'

import * as actions from 'actions'

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

class ShowDetailScreen extends React.Component {

    state = {
        loaded: false,
        refreshing : false,
        firstEpisodeReached: false,
        bufferedPosition: null,
        playingPosition: null,
        episodes: []
    }

    componentDidMount = () => {
        this.props.actions.setShowAsNew(this.props.id, false)
        this._getEpisodeList(this.props.id);
        this._onRefresh()
        this.setState({
            loaded : true
        })
    }

    _handleEpisodeThumbnailPress = (episode) => {

        let show = {
            title: episode.showTitle,
            image: episode.showImage,
            color: episode.showColor,
            description: episode.showImageHighRes,
            imageHighRes: episode.showImageHighRes
        }
        
        this.props.actions.addToQueueFrontAndPlayEpisode(show, episode);

    }

    _playAudio = async (title, image, imageHighRes, description, color, episode) => {

        let show = { title, image, imageHighRes, description, color }

        this.props.actions.addToQueueFrontAndPlayEpisode(show, episode);
    
    }

    _getEpisodeList = (id) => {
        this.setState({
            episodes: this.props.state.subscribedShows.find((show) => {
                return show.id == id
            }).episodeList
        });
    }

    _handleEpisodeDetailPress = (episode) => {

        Navigation.showOverlay({
            component: {
                name: 'example.EpisodeDetailScreen',
                passProps: { 
                    episode,
                    playing : this.props.state.nowPlaying.id == episode.id ? true : false,
                    onPlayPress : () => {this._handleEpisodeThumbnailPress(episode)}
                }, // simple serializable object that will pass as props to the lightbox (optional)
                options: {
                    overlay: {
                        interceptTouchOutside: false
                    }
                }
            }
        });

      }

    _getPlayProgress = (episode) => {

        const playProgressInSeconds = this.props.state.episodePlaybackPositions[episode.id];

        if (playProgressInSeconds) {
            return playProgressInSeconds / episode.duration
        } else {
            return 0
        }
    }

    // _renderEpisodeList = (title, image, image, description, color, episodes) => {
    //     if (this.state.loadingEpisodes) {
    //         return <LoadingIndicator />
    //     } else {
    //         return episodes.map((episode) => {
    //             return (
    //                 <EpisodeRow 
    //                     info={episode} 
    //                     onDetailPress={() => { this._handleEpisodeDetailPress(episode) } } 
    //                     onPlayPress={() => { this._playAudio(title, image, image, description, color, episode) }}
    //                     finished={this.props.state.finishedEpisodes.find(episodeId => episodeId == episode.id) ? true : false}
    //                     playProgress={this._getPlayProgress(episode)}
    //                     playing={}
    //                 />  
    //             );
    //         })
    //     }
    // }

    _handlePress = () => {
        this.props.onPress();
    }

    _fetchNextTenEpisodes = () => {
        if (this.state.episodes) {
            const oldestEpisodeDate = this.state.episodes[this.state.episodes.length-1].publishDate
            return this.props.actions.getNextTenEpisodes(this.props.id, oldestEpisodeDate).then(((episodeList) => {
                this.setState({
                    episodes : this.state.episodes.concat(episodeList),
                    loadingAdditionalEpisodes : false,
                    firstEpisodeReached : episodeList.length == 0 ? true : false
                })
            }))
        } else {
            this.setState({
                loadingAdditionalEpisodes : false,
            })
        }

    }

    _checkIfBottomReached = (e) => {
        let paddingToBottom = 0;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            if (!this.state.firstEpisodeReached) {
                this.setState({loadingAdditionalEpisodes : true})
                this._fetchNextTenEpisodes()
            }
        }
    }

    _checkIfSubscribed = (id) => {
        if (this.props.state.subscribedShows.find(item => item.id == id)) {
          return true
        } else {
          return false
        }
      }

      _subscribeToShow = (show) => {
        let alreadySubscribed = this.props.state.subscribedShows.find((subscribedShow) => {
          return subscribedShow.id == show.id
        })
    
        if (alreadySubscribed) {
          this.props.actions.unsubscribeFromShow(show.id)
        } else {
          this.props.actions.getDetailsAndSubscribe(show)
        }
      }
    

    _showShowDetailLightbox = (show) => {

        Navigation.showOverlay({
        component: {
            name: 'example.ShowPreviewScreen',
            passProps: { 
              canUnsubscribe: true,
              item : show,
              subscribed: this._checkIfSubscribed(show.id),
              onSubscribe: () => {this._subscribeToShow(show)}  
            }, // simple serializable object that will pass as props to the lightbox (optional)
            options: {
                overlay: {
                    interceptTouchOutside: false
                }
            }
        }
        });
        
    }

    _handleEpisodeDetailPress = (episode) => {
        Navigation.showOverlay({
            component: {
                name: 'example.EpisodeDetailScreen',
                passProps: { 
                    episode,
                    playing : this.props.state.nowPlaying.id == episode.id ? true : false,
                    onPlayPress : () => {this._handleEpisodeThumbnailPress(episode)}
                }, // simple serializable object that will pass as props to the lightbox (optional)
                options: {
                    overlay: {
                        interceptTouchOutside: false
                    }
                }
            }
        });
    }

    _onRefresh = () => {
        this.setState({refreshing: true});

        let thisShow = this.props.state.subscribedShows.find(show => show.id == this.props.id)

        this.props.actions.checkIfNewEpisode(thisShow).then((result) => {
            if (result.newEpisodeAvailable) {
                this.props.actions.getEpisodeListForShow(result.show.id).then(({ episodeList }) => {
                    this.props.actions.setEpisodeListForShow(result.show.id, episodeList)
                    this.setState({
                        episodes: this.props.state.subscribedShows.find((show) => {
                            return show.id == result.show.id
                        }).episodeList
                    }, () => {
                        this.setState({
                            refreshing : false
                        });
                    });

                })
            } else {
                console.log('No new episodes')
                setTimeout(() => {
                    this.setState({refreshing: false}
                )}, 1000)
            }
        });
    }

    render() {

        const { title, image, imageHighRes, description, color  } = this.props

        return (
            <View style={{ flex: 1 }}>
                <ShowDetail 
                    title={title}
                    image={imageHighRes}
                    description={description}
                    color={color}
                    onPress={() => {this._showShowDetailLightbox(this.props)}}
                />
                {
                    !this.state.episodes &&
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        height: '100%'
                    }}>
                        <Text style={{
                            color : 'white',
                            fontWeight: '600',
                            fontSize: 18,
                            textAlign: 'left',
                            color: '#555',
                            textAlign: 'center'
                        }}>This show hasn't published any episodes, isn't that strange</Text>
                    </View>
                }
                {
                    this.state.loaded &&
                    <ScrollView 
                        style={{ flexDirection: 'column' }} 
                        onScroll={(e) => this._checkIfBottomReached(e)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                    >
                        {/* { this._renderEpisodeList(title, image, image, description, color, this.state.episodes) } */}
                        {
                            this.state.loadingEpisodes ? 
                            <LoadingIndicator /> : 
                            <FlatList
                                data={this.state.episodes}
                                onPress={() => {
                                
                                }}
                                initialNumToRender={7}
                                renderItem={({item, separators}) => (
                                    <EpisodeRow 
                                        info={item} 
                                        onDetailPress={() => { this._handleEpisodeDetailPress(item) } } 
                                        onPlayPress={() => { this._playAudio(title, image, imageHighRes, description, color, item) }}
                                        finished={this.props.state.finishedEpisodes.find(episodeId => episodeId == item.id) ? true : false}
                                        playProgress={this._getPlayProgress(item)}
                                        buttonColor={color}
                                        playing={this.props.state.nowPlaying.id == item.id ? true : false}
                                    />  
                                )}
                            />
                        }

                        { this.state.loadingAdditionalEpisodes && <SmallLoadingIndicator /> }
                    </ScrollView>
                }
            </View>    
        );

    }
}

function mapStateToProps(state, ownProps) {
	return {
		state: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowDetailScreen);