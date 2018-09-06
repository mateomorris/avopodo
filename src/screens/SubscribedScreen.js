import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';
import PlayBar from '../components/PlayBar';

import * as actions from '../redux/actions'

class SubscribedScreen extends React.Component {

  _handleFavoritePress = () => {

  }

  _renderFavorites = (favorites) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', flex: 1 }}>
        {favorites.map((item, index) => {
          return (
            <ShowThumbnail 
              style={{

              }}
              art={item.imageHighRes} 
              color={item.color} 
              key={index} 
              onPress={() => { 
                Navigation.push(this.props.componentId, {
                  component: {
                    name: 'example.ShowDetailScreen',
                    passProps: item,
                    options: {
                      topBar: {
                        title: {
                          text: item.title
                        }
                      }
                    }
                  }
                });
          }}/>
          )
        })}
      </View>
    );
  }

  render() {

    this.state = {
      favorites: [
        {
          title: 'This American Life',
          art: 'https://media.npr.org/images/podcasts/primary/icon_381444650-04c1bad8586e69edf04b78ea319846614c4a6a6b-s800-c15.png',
        },
        {
          title: 'Planet Money',
          art: 'https://secureimg.stitcher.com/feedimagesplain328/7668.jpg',
        },
        {
          title: 'Pod Save America',
          art: 'https://secureimg.stitcher.com/feedimagesplain328/127661.jpg',
        }
      ],

      playlists: [
        {
          title: 'All NPR',
          duration: '5 Hours',
          icon: require('../assets/radio.png'),
          episodes: [
            {
              art: 'https://media.npr.org/images/podcasts/primary/icon_381444650-04c1bad8586e69edf04b78ea319846614c4a6a6b-s800-c15.png'
            },
            {
              art: 'https://secureimg.stitcher.com/feedimagesplain328/127661.jpg'
            },
            {
              art: 'https://secureimg.stitcher.com/feedimagesplain328/7668.jpg'
            }
          ]
        },
        {
          title: 'Trending',
          duration: '3 Hours',
          icon: require('../assets/trending.png'),
          episodes: [
            {
              art: 'https://secureimg.stitcher.com/feedimagesplain328/7668.jpg'
            },
            {
              art: 'https://secureimg.stitcher.com/feedimagesplain328/127661.jpg'
            },
            {
              art: 'https://media.npr.org/images/podcasts/primary/icon_381444650-04c1bad8586e69edf04b78ea319846614c4a6a6b-s800-c15.png'
            }
          ]
        }
      ],

      homeFeed: [
        {
          title: 'Telling the Truth',
          art: 'https://secureimg.stitcher.com/feedimagesplain328/127661.jpg',
          duration: '32m',
          description: 'Every time it rains, Marisa stays up all night wondering if anyone will show up to work the next day. She runs a bike messenger company, but not one wants to ride a bike when it’s pouring...'
        },
        {
          title: 'Gerrymandering',
          art: 'https://secureimg.stitcher.com/feedimagesplain328/7668.jpg',
          duration: '53m',
          description: `The way we draw our political districts has a huge effect on U.S. politics, but the process is also greatly misunderstood. Gerrymandering has become a scapegoat for what's wrong with the...`
        }
      ]
    };
    
    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <ScrollView contentContainerStyle={styles.container}>
          { this._renderFavorites(this.props.state.subscribedShows) }
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

export default connect(mapStateToProps, mapDispatchToProps)(SubscribedScreen);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
});
