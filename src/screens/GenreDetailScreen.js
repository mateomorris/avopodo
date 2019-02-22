import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert, RefreshControl } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import Search from 'react-native-search-box';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import PlayBar from 'components/PlayBar';
import { LoadingIndicator } from 'components/SimpleComponents'
import { ShowRow } from 'components/ShowRow';
import { SmallLoadingIndicator } from 'components/SimpleComponents'

import * as specialActions from 'actions';

import SearchBar from 'react-native-search-bar';

class GenreDetailScreen extends React.Component {

  state = {
    loading : true,
    shows: [],
    showSearchResults: false,
    searching: false,
    search: '',
    searchResults: [],
    subscribedShows: this.props.details.subscribedShows.map((show) => {
      return show.id
    }),
    genreShowsPage : 2,
    refreshing : false,
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
  };

  componentDidMount() {

  }

  _subscribeToShow = (show) => {

    let alreadySubscribed = this.state.subscribedShows.find((subscribedShowId) => {
      return subscribedShowId == show.id
    })

    if (alreadySubscribed) {
      this.setState({
        subscribedShows : this.state.subscribedShows.filter((showId) => {
          return showId != show.id
        })}, () => {
          this.props.actions.unsubscribeFromShow(show.id)
        })
    } else {
      this.setState({
        subscribedShows : this.state.subscribedShows.concat([show.id])
      }, () => {
        this.props.actions.getDetailsAndSubscribe(show)
      })
    }

  }

  _checkIfSubscribed = (id) => {
    if (this.state.subscribedShows.find(item => item == id)) {
      return true
    } else {
      return false
    }
  }

  // _getHighResArtwork = ( itunesId ) => {
  //   return getHighResArtwork( itunesId );
  // }

  _testSubscribe = () => {
    Alert.alert('test');
  }

  _goToSubscribed = () => { 
    console.log(this.props.componentId)
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: 2
      }
    });
  }


  _onSearchResultPress = (item) => {

    Navigation.showOverlay({
      component: {
        name: 'example.ShowPreviewScreen',
        passProps: { 
          item,
          subscribed: this.props.actions.checkIfSubscribed(item.id),
          goToSubscribed: () => {this._goToSubscribed()},
          onSubscribe: () => {
          this._subscribeToShow(item)}
        }, // simple serializable object that will pass as props to the lightbox (optional)
        options: {
          overlay: {
            interceptTouchOutside: false
          }
        }
      }
    });
  }

  _renderSearchResults = (items) => {

    if (items) {
      return (
        items.map((item, index) => {
          return (
            <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 15, borderBottomColor: '#DDD', borderBottomWidth: 1, height: 100, overflow: 'hidden' }} key={index} onPress={() => {this._onSearchResultPress(item)}}>
              <View style={{ marginRight: 10 }}>
                <Image source={{ uri: item.image }} style={{ width: 75, height: 75, borderRadius: 5, backgroundColor: '#EEEEEE' }}/>
              </View>
              <View style={{flex: 1}}>
                <Text style={{ fontSize: 15, fontWeight: '700' }} ellipsizeMode={'tail'} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }} ellipsizeMode={'tail'} numberOfLines={4}>{item.description}</Text>
              </View>
              <TouchableOpacity style={{ justifyContent: 'center'}} onPress={() => {
                this._subscribeToShow(item)
              }}>
                <Image 
                  source={ this._getSubscribeStatus(item.id) } 
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })
      );
    } 

  }

  _getSearchResults = (term) => {
    return this.props.actions.getSearchResults(term).then((searchResults) => {
      let perfectMatch = searchResults.find((result) => {
          return result.title.toLowerCase() == term.toLowerCase()
      })

      if (perfectMatch) {
          searchResults = searchResults.filter(item => item.title !== perfectMatch.title);
          searchResults.unshift(perfectMatch);
      }

      this.setState({
        searchResults,
        searching: false,
        showSearchResults: true,
      });
    })
  }

  _searchForTerm = (term) => {

    // this.searchBar.blur();

    this.setState({searching: true, showSearchResults: false });
    this._getSearchResults(term);
  }


  _checkIfBottomReached = (e) => {
      let paddingToBottom = 100;
      paddingToBottom += e.nativeEvent.layoutMeasurement.height;
      if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
          if (!this.state.firstEpisodeReached) {
              this.setState({loadingAdditionalEpisodes : true})
              this.props.actions.getShowsInGenre(this.props.genre.id, this.state.genreShowsPage).then((moreShows) => {
                if (moreShows) {
                  this.setState({ 
                    shows : this.state.shows.concat(moreShows),
                    genreShowsPage : this.state.genreShowsPage + 1
                  })
                } else {
                  this.setState({
                    loadingAdditionalEpisodes : false
                  })
                }
              })
          }
      }
  }

  componentWillMount() {
    this.props.actions.getShowsInGenre(this.props.genre.id).then((shows) => {
      this.setState({ 
        shows,
        loading: false
      })
    })
  }

  render() {


    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        { this.state.loading && <LoadingIndicator /> }
        <ScrollView 
          contentContainerStyle={styles.container}
          onScroll={(e) => this._checkIfBottomReached(e)}
        >
          { this.state.showSearchResults && this._renderSearchResults(this.state.searchResults) }
          { this.state.searching && <LoadingIndicator /> }
          <FlatList
            data={this.state.shows}
            onPress={() => {
              
            }}
            initialNumToRender={7}
            renderItem={({item, separators}) => (
              <ShowRow 
                key={item.id}
                item={item}
                subscribed={this._checkIfSubscribed(item.id)}
                subscribeToShow={() => {
                  this._subscribeToShow(item)
                }}
                onSearchResultPress={() => {
                  this._onSearchResultPress(item)
                }}
              />
            )}
          />
          { this.state.loadingAdditionalEpisodes && <SmallLoadingIndicator /> }
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
	return {
		details: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(specialActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GenreDetailScreen);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 10
  },
});
