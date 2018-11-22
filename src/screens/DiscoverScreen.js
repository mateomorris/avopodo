import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import Search from 'react-native-search-box';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import GridView from 'react-native-super-grid';
import SvgUri from 'react-native-svg-uri';

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import PlayBar from 'components/PlayBar';
import { ShowRow } from 'components/ShowRow';
import { LoadingIndicator } from 'components/SimpleComponents'

import icons from 'assets/genre-icons';

import * as specialActions from 'actions';

import SearchBar from 'react-native-search-bar';

class DiscoverScreen extends React.Component {

  static options(passProps) {
    return {
      topBar: {
        noBorder: true,
        title: {
          text: 'Discover'
        },
        background: {
          color: '#fafafa',
          blur: true
        }
      }
    };
  }

  state = {
    noResultsFound : false,
    genres: [],
    showSearchResults: false,
    searching: false,
    search: '',
    searchResults: [],
    subscribedShows: this.props.details.subscribedShows.map((show) => {
      return show.id
    }),
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

      if (searchResults.length > 0) {
        this.setState({
          searchResults,
          searching: false,
          showSearchResults: true
        });
      } else {
        this.setState({
          noResultsFound : true,
          searching: false,
          showSearchResults: false
        }); 

        setTimeout(() => {
            this.setState({noResultsFound: false}
        )}, 5000)
      }

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

  _getIcon (genre) {
    let name = genre.name.toLowerCase()
    return {
      'arts' : icons.arts, 
      'business' : icons.business,
      'comedy' : icons.comedy,
      'education' : icons.education,
      'games & hobbies' : icons.games,
      'government & organizations' : icons.government,
      'health' : icons.health,
      'kids & family' : icons.family,
      'music' : icons.music,
      'news & politics' : icons.news,
      'personal finance' : icons.finance,
      'religion & spirituality' : icons.religion,
      'science & medicine' : icons.science,
      'society & culture' : icons.society,
      'sports & recreation' : icons.sports,
      'tv & film' : icons.tv,
      'technology' : icons.technology
    }[name] || icons.default
  }

  componentDidMount() {
    // console.log(this.props.details);
    this.props.actions.getGenres().then(({ genres }) => {
      const filteredGenres = genres.filter((genre) => {
          if (genre.id !== 67 && genre.parent_id == 67 && genre.id !== 151) {
            return genre
          }
        }).sort(function(a, b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })
      this.setState({ genres : filteredGenres });
    })
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <Search
          ref={(ref) => { this.myTextInput = ref }}
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
          onDelete={() => {
            return new Promise((resolve, reject) => {
              this.myTextInput.focus()
              resolve();
            });
          }}
        />
        {
          this.state.noResultsFound &&
          <View
          style={{
            width: '100%',
            backgroundColor: 'red',
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              alignItems: 'center',
              color: '#EEE',
              fontWeight: '600'
            }}>No results found</Text>
          </View>
        }

        <ScrollView contentContainerStyle={[styles.container, 
        {
          paddingBottom: this.props.details.active ? 30 : 0
        }]}>
          <View style={{
            paddingLeft: 10,
            paddingRight: 10
          }}>
            { this.state.showSearchResults && this._renderSearchResults(this.state.searchResults) }
            { this.state.searching && <LoadingIndicator /> }
          </View>
          <GridView
            spacing={20}
            itemDimension={130}
            items={this.state.genres}
            renderItem={genre => (
              <TouchableOpacity style={{
                backgroundColor: '#111',
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 5,
              }} onPress={() => {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: 'example.GenreDetailScreen',
                    passProps: {
                      genre
                    },
                    noBorder: false,
                    options: {
                      topBar: {
                        // background : {
                        //   color : '#000000'
                        // },
                        title: {
                          text: genre.name,
                          // color: 'white',
                          // component: {
                          //   name: 'example.TopBar',
                          //   alignment: 'center',
                          //   passProps : {
                          //     title : genre.name
                          //   }
                          // }
                        }
                      }
                    }
                  }
                });
              }}>
                <SvgUri style={{
                  paddingBottom: 5,
                }} width="20" height="20" svgXmlData={this._getIcon(genre)} fill={'#EEE'} fillAll={true}/>
                <Text style={{
                  fontSize: 15,
                  color: 'white',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>{ genre.name }</Text>
              </TouchableOpacity>
            )}
          />
          {/* <FlatList
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
                }}>
                </TouchableOpacity>
            )}
          /> */}



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
    justifyContent: 'flex-start'
  },
});
