import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import ShowDetail from '../components/ShowDetail';
import EpisodeRow from '../components/EpisodeRow';
import PlayBar from '../components/PlayBar';
import { LoadingIndicator, SmallLoadingIndicator } from '../components/SimpleComponents'

import * as actions from '../redux/actions'

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
        firstEpisodeReached: false,
        bufferedPosition: null,
        playingPosition: null,
        episodes: [
            {
                title: 'Episode Title',
                description: 'Epsidode',
                duration: '',
                publishDate: '4/29',
                listenedTo: 0
            },
            {
                title: 'Episode Title',
                description: 'Epsidode',
                duration: '',
                publishDate: '',
                listenedTo: 0
            },
            {
                title: 'Episode Title',
                description: 'Epsidode',
                duration: '',
                publishDate: '',
                listenedTo: 0
            }
        ]
    }

    componentDidMount = () => {
        this._getEpisodeList(this.props.id);
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
                        interceptTouchOutside: true
                    }
                }
            }
        });

      }

    _renderEpisodeList = (title, image, imageHighRes, description, color, episodes) => {
        if (this.state.loadingEpisodes) {
            return <LoadingIndicator />
        } else {
            return episodes.map((episode) => {
                return (
                    <EpisodeRow 
                        info={episode} 
                        onDetailPress={() => { this._handleEpisodeDetailPress(episode) } } 
                        onPlayPress={() => { this._playAudio(title, image, imageHighRes, description, color, episode) }}
                        finished={this.props.state.finishedEpisodes.find(episodeId => episodeId == episode.id) ? true : false}
                    />  
                );
            })
        }
    }

    _handlePress = () => {
        this.props.onPress();
    }

    _fetchNextTenEpisodes = () => {
        const oldestEpisodeDate = this.state.episodes[this.state.episodes.length-1].publishDate
        return this.props.actions.getNextTenEpisodes(this.props.id, oldestEpisodeDate).then(((episodeList) => {
            this.setState({
                episodes : this.state.episodes.concat(episodeList),
                loadingAdditionalEpisodes : false,
                firstEpisodeReached : episodeList.length == 0 ? true : false
            })
        }))
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
              item : show,
              subscribed: this._checkIfSubscribed(show.id),
              onSubscribe: () => {this._subscribeToShow(show)}  
            }, // simple serializable object that will pass as props to the lightbox (optional)
            options: {
                overlay: {
                    interceptTouchOutside: true
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
                        interceptTouchOutside: true
                    }
                }
            }
        });
    }

    render() {

        const { title, image, imageHighRes, description, color  } = this.props

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flexDirection: 'column' }} onScroll={(e) => this._checkIfBottomReached(e)}>
                    <ShowDetail 
                        title={title}
                        image={imageHighRes}
                        description={description}
                        color={color}
                        onPress={() => {this._showShowDetailLightbox(this.props)}}
                    />
                    { this._renderEpisodeList(title, image, imageHighRes, description, color, this.state.episodes) }
                    { this.state.loadingAdditionalEpisodes && <SmallLoadingIndicator /> }
                </ScrollView>
            </View>    
        );

    }
}

function mapStateToProps(state, ownProps) {
	return {
		state: state.reducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowDetailScreen);