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

class NowPlayingFooter extends React.Component {

  render() {

    this.state = {

    };

    return (
        <TouchableOpacity style={{
            padding: 10,
            paddingBottom: 0,
            // backgroundColor: `${this.props.color}7F`
        }} onPress={() => {
              this.props.onPress()
        }}>
          <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start'
          }}>
            <View style={{
                padding: 10,
                paddingBottom: 30
            }}>
                {
                  <SvgUri style={{transform: [{rotate:'180deg'}]}} width="20" height="20" source={require('assets/interface-icons/up.svg')} fill={'#EEE'} fillAll={true}/>
                }
            </View>
          </View>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(NowPlayingFooter);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
});
