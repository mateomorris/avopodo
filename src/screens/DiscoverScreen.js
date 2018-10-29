import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import Search from 'react-native-search-box';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';
import PlayBar from '../components/PlayBar';
import ShowRow from '../components/ShowRow';
import { LoadingIndicator } from '../components/SimpleComponents'

import * as specialActions from '../redux/actions';

import SearchBar from 'react-native-search-bar';

class DiscoverScreen extends React.Component {

  state = {
    genres: ['blue','red'],
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
    return this.props.actions.checkIfSubscribed(id)
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
            <ShowRow 
                index={index}
                item={item}
                subscribed={this._checkIfSubscribed(item.id)}
                subscribeToShow={() => {
                  this._subscribeToShow(item)
                }}
                onSearchResultPress={() => {
                  this._onSearchResultPress(item)
                }}
              />
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

  _getChildGenres = (parentGenre) => {
    return this.state.genres.filter((genre) => {
      if (genre.parent_id == parentGenre.id) {
        return genre
      }
    })
  }

  _getShowsInGenre = (genre) => {
    // NEXT: 
    // - Middleware to retrieve shows in genre
    return this.props.actions.getShowsInGenre(genre.id).then((shows) => {
      return shows
    })
  }

  componentDidMount() {
    // console.log(this.props.details);
    this.props.actions.getGenres().then(({ genres }) => {
      this.setState({ genres });
    })
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
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
          <FlatList
            data={this.state.genres.filter((genre) => {
              if (genre.id !== 67) {
                return genre
              }
            })}
            renderItem={({item, separators}) => (
                <TouchableOpacity onPress={() => {
                  Navigation.push(this.props.componentId, {
                    component: {
                      name: 'example.GenreDetailScreen',
                      passProps: {
                        genre: item
                      },
                      options: {
                        topBar: {
                          title: {
                            text: item.name
                          }
                        }
                      }
                    }
                  });

                  // Navigation.push(this.props.componentId, {
                  //   component: {
                  //     name: 'example.GenreListScreen',
                  //     passProps: {
                  //       parentGenre: item,
                  //       childGenres: this._getChildGenres(item)
                  //     },
                  //     options: {
                  //       topBar: {
                  //         title: {
                  //           text: item.name
                  //         }
                  //       }
                  //     }
                  //   }
                  // });
                }}>
                  <Card>
                    <CardItem>
                      <Body style={{
                        paddingTop: 10,
                        paddingBottom: 10
                      }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '600'
                        }}>
                          { item.name }
                        </Text>
                      </Body>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
            )}
          />



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
    paddingTop: 10
  },
});
