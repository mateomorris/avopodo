import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";

import ShowThumbnail from '../components/ShowThumbnail';
import PlaylistThumbnail from '../components/PlaylistThumbnail';
import EpisodeSnippet from '../components/EpisodeSnippet';

import * as actions from '../redux/actions'

class NowPlayingHeader extends React.Component {

  _handleFavoritePress = () => {

  }

  _renderFavorites = (favorites) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', flex: 1}}>
        {favorites.map((item, index) => {
          return (
            <ShowThumbnail art={item.image} key={index} onPress={() => { 
              this.props.nav.push({
                screen: 'example.ShowDetailScreen',
                title: item.title,
                backButtonTitle: '',
                passProps: item
              });
          }}/>
          )
        })}
      </View>
    );
  }

  render() {

    this.state = {

    };

    return (
        <View style={{
            padding: 20,
            paddingTop: 30
        }}>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
          }}>
            <TouchableOpacity style={{
                padding: 10,
            }} onPress={() => {
                Navigation.dismissModal(this.props.componentId).then(() => {
                  Navigation.showOverlay({
                      component: {
                          name: 'example.PlayBar',
                          options: {
                              overlay: {
                                  interceptTouchOutside: false
                              }
                          }
                      }
                  });
                })
            }}>
                <Image source={require('../assets/down-arrow.png')}/>
            </TouchableOpacity>
            <View>
                <Text style={{
                    color: 'white'
                }}>{this.props.label}</Text>
            </View>
            <View style={{
                paddingTop: 0
            }}>
              <TouchableOpacity onPress={() => {
                this.props.onPlaylistPress()
              }} style={{
                padding: 20,
                paddingTop: 0
              }}>
                <Image source={require('../assets/playlist.png')} style={{ height: 20, width: 20 }}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }

}

NowPlayingHeader.defaultProps = {
  label: 'Now Playing'
};

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

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
});
