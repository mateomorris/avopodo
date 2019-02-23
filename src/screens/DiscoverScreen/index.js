import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import Search from 'react-native-search-box';
import { Container, Header, Content, Card, CardItem, Body } from 'native-base';
import GridView from 'react-native-super-grid';
import SvgUri from 'react-native-svg-uri';
import Tabs from 'react-native-tabs';

import { DiscoverButton } from 'components/Button';
import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import { ShowRow } from 'components/ShowRow';
import { LoadingIndicator } from 'components/SimpleComponents'

import SearchResults from './SearchResults';
import { Headline } from 'components/Headline'

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
    page: 'podcast',
    activeSearchResults : 'shows',
    noResultsFound : false,
    genres: [],
    showSearchResults: null,
    showGenres : true,
    searching: false,
    search: '',
    searchResults: [],
    subscribedShows: this.props.details.subscribedShows.map((show) => {
      return show.id
    }),
    typeAheadShows: [],
  };

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
    return this.props.actions.checkIfSubscribed(id)
  }

  _goToSubscribed = () => { 
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
          subscribed: this._checkIfSubscribed(item.id),
          goToSubscribed: () => {this._goToSubscribed()},
          onSubscribe: () => {
            this._subscribeToShow(item)
          }
        }, // simple serializable object that will pass as props to the lightbox (optional)
        options: {
          overlay: {
            interceptTouchOutside: false
          }
        }
      }
    });
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

  _getShowDetails = (show) => {
    this.props.actions.getShowDetails(show.id).then((result) => {
      Navigation.showOverlay({
        component: {
          name: 'example.ShowPreviewScreen',
          passProps: { 
            item : result,
            subscribed: this._checkIfSubscribed(result.id),
            onSubscribe: () => {this._subscribeToShow(result)},
          }, // simple serializable object that will pass as props to the lightbox (optional)
          options: {
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
    })
  }

  _getSearchResults = (term, type) => {
    return this.props.actions.getSearchResults(term, type).then((searchResults) => {

      let perfectMatch = searchResults.find((result) => {
          return result.title.toLowerCase() == term.toLowerCase()
      })

      // Move the perfect match to the top, if there is one
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

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa', marginTop: 10 }}>
        <Search
          style={{

          }}
          ref={(ref) => { this.myTextInput = ref }}
          onChangeText={(text) => {
            return new Promise((resolve, reject) => {
                clearTimeout(this.change);

                // 
                if (!this.state.showSearchResults && !this.state.searching) {
                  this.setState({ search: text }, () => {
                    if (text.length > 5) {
                      this.setState({
                        searching: true,
                        showGenres: false,
                        showSuggestions : true,
                        // showSuggestions: this.state.showSuggestions === true ? false : null
                      })
                      this.change = setTimeout(() => {
                        this.props.actions.getTypeAhead(text).then((result) => {
                          this.setState({
                            typeAheadShows : result,
                            searching: false,
                            showSuggestions: this.state.showSuggestions === false ? null : true
                          }, () => {
                            this.setState({
                              noResultsFound : this.state.typeAheadShows.length > 0 ? false : true
                            })
                          })
                        })
                      }, 500)
                    }
                  });
                } else {
                  this.setState({ search : text })
                  console.log('________', !this.state.showSearchResults, !this.state.searching)
                }

                resolve();
            });
          }}
          onSearch={() => {
            return new Promise((resolve, reject) => {
              this.setState({
                searching : true,
                showSearchResults : false,
                showSuggestions: this.state.showSuggestions === true ? false : null
              }, () => {
                this._getSearchResults(this.state.search);
                resolve();
              })
            });
          }}
          onCancel={()=>{ 
            return new Promise((resolve, reject) => {
              this.setState({
                showSearchResults: false,
                showGenres: true,
                showSuggestions: null,
                typeAheadShows : []
              })
              resolve();
            });
          }}
          onDelete={() => {
            return new Promise((resolve, reject) => {
              this.setState({
                typeAheadShows : []
              })
              this.myTextInput.focus()
              resolve();
            });
          }}
        />
        {
          this.state.showSearchResults &&
          <View>
              <Tabs 
                selected={this.state.page} 
                style={{backgroundColor:'white', position: 'relative', zIndex: 99}}
                selectedStyle={{color:'red'}} 
                onSelect={(el)=>{
                  console.log('TAB SELECTED')
                  this.setState({
                    page:el.props.name,
                  }, () => {
                    this._getSearchResults(this.state.search, this.state.page)
                  })
              }}>
                  <Text name="podcast" selectedIconStyle={{borderBottomWidth:2,borderTopColor:'red'}}>Shows</Text>
                  <Text name="episode" selectedIconStyle={{borderBottomWidth:2,borderTopColor:'red'}}>Episodes</Text>
              </Tabs>
              <SearchResults 
                active={this.props.details.active}
                searchResults={this.state.searchResults} 
                subscribeToShow={(show) => { 
                  this._subscribeToShow(show) 
                }}
                onSearchResultPress={(result) => {
                  this._onSearchResultPress(result)
                }}
                checkIfSubscribed={(itemId) => {
                  this._checkIfSubscribed(itemId)
                }}
              > 
                    <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                        <Image 
                        resizeMode={'contain'}
                        source={require('assets/listen-notes.png')} style={{
                            width: 200,
                            height: 20,
                        }}/>
                    </View>
              </SearchResults> 
          </View>
        }

        <ScrollView contentContainerStyle={[styles.container, 
        {
          paddingBottom: this.props.details.active ? 70 : 20
        }]}>
          <View style={{
            paddingLeft: 10,
            paddingRight: 10
          }}>
            {
              this.state.typeAheadShows.length > 0 &&
              this.state.showSuggestions > 0 &&
              <View style={{
                flexDirection : 'column',
                paddingBottom: 20
              }}>
                <Headline text={'Search Suggestions'}/>
                <View
                  style={{
                    flexDirection: 'row'
                  }}
                  onLayout={(e) => {
                      this.setState({
                          containerWidth: e.nativeEvent.layout.width,
                      })
                  }}
                >
                  {
                    this.state.typeAheadShows.map((show) => {
                      return (
                        <ShowThumbnail
                        style={{
                          height: this.state.containerWidth / 5,
                          width: this.state.containerWidth / 5,
                          opacity: this.state.containerWidth > 0 ? 1 : 0
                        }}
                        art={show.thumbnail}
                        color={'black'}
                        onPress={() => {
                          this._getShowDetails(show)
                        }}
                        />  
                      )
                    })
                  }
                </View>
              </View>
            }
            { 
              this.state.searching && 
              <LoadingIndicator /> 
            }
          </View>
          {
            this.state.showGenres &&
            <GridView
              itemContainerStyle={{
              //   backgroundColor: 'red',
              //   padding: 0,
              //   margin: 0
              }}
              style={{
                // backgroundColor: 'yellow'
              }}
              spacing={10}
              itemDimension={130}
              items={this.state.genres}
              renderItem={genre => (
                <DiscoverButton 
                  genre={genre} 
                  icon={this._getIcon(genre)}
                  onPress={() => {
                    Navigation.push(this.props.componentId, {
                    component: {
                        name: 'example.GenreDetailScreen',
                        passProps: {
                        componentId: this.props.componentId,
                        genre
                        },
                        noBorder: false,
                        options: {
                        topBar: {
                            title: {
                            text: genre.name,
                            }
                        }
                        }
                    }
                    });
                  }}
                  style={{

                  }}
                />
              )}
            />
          }
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                  <Image 
                  resizeMode={'contain'}
                  source={require('assets/listen-notes.png')} style={{
                      width: 200,
                      height: 20,
                  }}/>
              </View>
        </ScrollView> 

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

        {/* <ScrollView contentContainerStyle={[styles.container, 
        {
          paddingBottom: this.props.details.active ? 70 : 20
        }]}>
          <View style={{
            paddingLeft: 10,
            paddingRight: 10
          }}>
            {
              this.state.typeAheadShows.length > 0 &&
              this.state.showSuggestions > 0 &&
              <View style={{
                flexDirection : 'column',
                paddingBottom: 20
              }}>
                <Headline text={'Search Suggestions'}/>
                <View
                  style={{
                    flexDirection: 'row'
                  }}
                  onLayout={(e) => {
                      this.setState({
                          containerWidth: e.nativeEvent.layout.width,
                      })
                  }}
                >
                  {
                    this.state.typeAheadShows.map((show) => {
                      return (
                        <ShowThumbnail
                        style={{
                          height: this.state.containerWidth / 5,
                          width: this.state.containerWidth / 5,
                          opacity: this.state.containerWidth > 0 ? 1 : 0
                        }}
                        art={show.thumbnail}
                        color={'black'}
                        onPress={() => {
                          this._getShowDetails(show)
                        }}
                        />  
                      )
                    })
                  }
                </View>
              </View>
            }
            { 
              this.state.showSearchResults && 
              <View>
                <Headline 
                  text={'Search Results'}
                  style={{
                    marginBottom: 0
                  }}
                />
                {              
                  this._renderSearchResults(this.state.searchResults) 
                }
              </View>
            }
            { 
              this.state.searching && 
              <LoadingIndicator /> 
            }
          </View>
          {
            this.state.showGenres &&
            <GridView
              itemContainerStyle={{
              //   backgroundColor: 'red',
              //   padding: 0,
              //   margin: 0
              }}
              style={{
                // backgroundColor: 'yellow'
              }}
              spacing={10}
              itemDimension={130}
              items={this.state.genres}
              renderItem={genre => (
                <DiscoverButton 
                  genre={genre} 
                  icon={this._getIcon(genre)}
                  onPress={() => {
                    Navigation.push(this.props.componentId, {
                    component: {
                        name: 'example.GenreDetailScreen',
                        passProps: {
                        componentId: this.props.componentId,
                        genre
                        },
                        noBorder: false,
                        options: {
                        topBar: {
                            title: {
                            text: genre.name,
                            }
                        }
                        }
                    }
                    });
                  }}
                  style={{

                  }}
                />
              )}
            />
          }
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                  <Image 
                  resizeMode={'contain'}
                  source={require('assets/listen-notes.png')} style={{
                      width: 200,
                      height: 20,
                  }}/>
              </View>
        </ScrollView>  */}
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
