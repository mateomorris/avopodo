import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import Search from 'react-native-search-box';

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';
import PlayBar from '../components/PlayBar';
import { LoadingIndicator } from '../components/SimpleComponents'


import * as specialActions from '../redux/actions';

import SearchBar from 'react-native-search-bar';

class DiscoverScreen extends React.Component {

  state = {
    showSearchResults: false,
    searching: false,
    search: '',
    searchResults: [],
    subscribedShows: this.props.details.subscribedShows.map((show) => {
      return show.id
    })
  };

  // _subscribeToShow = async (id, title, image, description, itunesId) => {

  //   if (this._checkIfSubscribed(id)) {
  //     this.props.actions.unsubscribeFromShow(id);
  //     console.log(this.props.details);
  //     console.log('unsubscribing');
  //   } else {
  //     let highResArtwork = await this._getHighResArtwork(itunesId).then((artworkUrl) => {
  //       this.props.actions.subscribeToShow(id, title, image, description, artworkUrl);
  //     })
  //   }

  // }

  _subscribeToShow = (show) => {
    // let alreadySubscribed = this.props.details.subscribedShows.find((subscribedShow) => {
    //   return subscribedShow.id == show.id
    // })
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

  _onSearchResultPress = (item) => {

    Navigation.showOverlay({
      component: {
        name: 'example.ShowPreviewScreen',
        passProps: { 
          item,
          subscribed: this._checkIfSubscribed(item.id),
          onSubscribe: () => {this._subscribeToShow(item)}
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
                  source={ (this._checkIfSubscribed(item.id) ? require('../assets/bookmark-black.png'): require('../assets/bookmark.png')) } 
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
        showSearchResults: true
      });
    })
  }

  _searchForTerm = (term) => {

    // this.searchBar.blur();

    this.setState({searching: true, showSearchResults: false });
    this._getSearchResults(term);
  }

  componentDidMount() {
    // console.log(this.props.details);
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <Search
          ref="search_box"
          // placeholder='Search by name, description, or author'
          onChangeText={(text) => {
            return new Promise((resolve, reject) => {
                this.setState({ search: text });
                resolve();
            });
          }}
          onSearch={() => {
            return new Promise((resolve, reject) => {
              this._searchForTerm(this.state.search);
              resolve();
            });
          }}
          onCancel={()=>{ 
            return new Promise((resolve, reject) => {
              this.setState({showSearchResults: false})
              resolve();
            });
          }}
        />
        {/* <SearchBar
          ref={ ref => (this.searchBar = ref) }
          placeholder='Search by name, description, or author'
          text={this.state.search}
          onChangeText={ text => this.setState({ search: text}) }
          onSearchButtonPress={() => this._searchForTerm(this.state.search) }
          onCancelButtonPress={()=>{ this.setState({showSearchResults: false}) }}
        /> */}
        <ScrollView contentContainerStyle={styles.container}>
          { this.state.showSearchResults && this._renderSearchResults(this.state.searchResults) }
          { this.state.searching && <LoadingIndicator /> }
          {/* <Text style={{ color: '#666666', fontWeight: '600', fontSize: 20 }}>Trending Shows</Text>
          { this._renderFavorites(this.state.favorites) }
          { this._renderPlaylists(this.state.playlists) } */}
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

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverScreen);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 0
  },
});
