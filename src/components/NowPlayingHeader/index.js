import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import SvgUri from 'react-native-svg-uri';

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import { EpisodeSnippet } from 'components/EpisodeSnippet';
import playlistIcons from 'assets/newPlaylistIcons'

import * as actions from 'actions'

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
            paddingTop: 20,
            paddingBottom: 10
        }}>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'relative'
          }}>
            {/* <TouchableOpacity style={{
                padding: 10,
                paddingRight: 30,
            }} onPress={() => {
              this.props.onPress()
            }}>
                  <SvgUri style={{transform: [{rotate:'180deg'},{translateY:15}]}} width="20" height="20" source={require('assets/interface-icons/up.svg')} fill={'#EEE'} fillAll={true}/>
            </TouchableOpacity> */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}>
                {
                  this.props.playlist.name &&
                  <SvgUri style={{ width: 15, height: 15, marginRight: 5, marginTop: 3 }}  width="15" height="15" svgXmlData={playlistIcons[this.props.playlist.icon]} fill={'#EEE'} fillAll={true}/>
                }
                <Text style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 17
                }}>{this.props.playlist.name || 'Now Playing'}</Text>
            </View> 
            <View style={{
                position: 'absolute',
                right: 0,
                top: 0
            }}>
            {
              this.props.state.playQueue.length > 1 &&
              <TouchableOpacity onPress={() => {
                this.props.onPlaylistPress()
              }} style={{
                padding: 20,
                paddingRight: 5,
                paddingTop: 0
              }}>
                {/* <Image source={require('assets/playlist.png')} style={{ height: 20, width: 20 }}/> */}
                {
                  <SvgUri style={{ width: 20, height: 20 }}  width="20" height="20" source={require('assets/interface-icons/queue.svg')} fill={'#EEE'} fillAll={true}/>
                }
              </TouchableOpacity>
            }
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
		state: state
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
