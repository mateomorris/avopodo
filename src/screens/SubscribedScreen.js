import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions, FlatList} from 'react-native';
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
      favorites: [],
      playlists: [],
      homeFeed: []
    };
    
    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: this.props.state.active ? 50 : 5 }]}>
          {/* { this._renderFavorites(this.props.state.subscribedShows) } */}
          <FlatList 
            numColumns={3}
            data={this.props.state.subscribedShows}
            initialNumToRender={15}
            renderItem={({item}) => {
              return (
                <ShowThumbnail 
                  style={{

                  }}
                  art={item.imageHighRes} 
                  color={item.color} 
                  // key={index} 
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
            }}
            />
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(SubscribedScreen);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5
  },
});
