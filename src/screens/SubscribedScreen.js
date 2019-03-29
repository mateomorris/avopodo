import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions, FlatList} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import XMLParser from 'react-xml-parser';
import { parseString } from 'react-native-xml2js';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import SvgUri from 'react-native-svg-uri';
import styled from 'styled-components/native'

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import PlayBar from 'components/PlayBar';
import icons from 'assets/generalIcons';

import * as actions from 'actions'


const FooterButton = styled(TouchableOpacity).attrs(({ icon, onPress, color, label, children }) => ({
    // we can define static props
    icon : icon || 'download',
    color: '#222',
    children : (
      children ? 
      children : 
      <View style={{
        flexDirection: 'row'
      }}>
        <SvgUri width={30} height={30} svgXmlData={icons[icon]} fill={color} fillAll={true}/>
        <Text style={{ color, fontSize: 20, fontWeight: '600', paddingLeft: 10 }}>{ label }</Text>
      </View>
    )
  }))`
    opacity : ${props => props.opacity};
    border-radius: 10;
    margin-top: 10;
    margin-bottom: 10;
    margin-left: 10;
    margin-right: 10;
    justify-content: center;
    align-items: center;
    background-color: lightgray;
    padding-top: 20;
    padding-bottom: 20;
`;

class SubscribedScreen extends React.Component {

  state = {
    importingShows : false
  }

  static options(passProps) {
    return {
      topBar: {
        noBorder: true,
        title: {
          text: 'Subscribed'
        },
        background: {
          color: '#fafafa',
          blur: true
        }
      }
    };
  }

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
              newIndicator={item.newEpisodesAvailable}
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

  importShows = () => {

    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error,res) => {
      // Android
      console.log(
         res.uri,
         res.type, // mime type
         res.fileName,
         res.fileSize
      );

        const dirs = RNFetchBlob.fs.dirs

        let downloadId = Math.random() * 9999999

        this.setState({
          importingShows : true
        })

        let THE_DOWNLOAD = RNFetchBlob
        .config({
            // add this option that makes response data to be stored as a file,
            // this is much more performant.
            // path: `${dirs.MainBundleDir}/${episode.id}.mp3`,
            path: `${dirs.CacheDir}/${downloadId}.xml`,
            fileCache : true,
            appendExt : 'xml'
        })
        // .fetch('GET', 'https://content.production.cdn.art19.com/episodes/3bd93e04-1373-4737-b877-c8236061bb45/33ee05ed7b83dfe04a5d8ece7f33be550daa2554d695560398ad22d93bde6c98904b9472d45cdf479f85812a7e852f941e16d520ba538a1a9ce34a1f91df42a9/Change%20Agent_TRAILER_MIX%20BF.mp3', {
        .fetch('GET', res.uri)
        .then(({ data }) => {

            let arr = data.split('/')
            filePath = `${dirs.CacheDir}/${arr[arr.length - 1]}`

            RNFetchBlob.fs.readFile(filePath, 'utf8')
            .then((data) => {
              // handle the data ..

                parseString(data, (err, { opml }) => {
                  
                  let theShows = eachRecursive(opml.body)
                  .map(node => node.$.xmlUrl)

                  function eachRecursive(obj) {
                      for (var k in obj) {
                        if (typeof obj[k] == "object" && obj[k] !== null && (k == 0 || k == 'outline')){
                          if (Array.isArray(obj) && obj.length > 2) {
                            return obj
                          } else {
                            return eachRecursive(obj[k]);
                          }
                        } 
                      }
                  }

                  this.props.actions.importShows(theShows).then(() => {
                    this.setState({
                      importingShows : false
                    })     
                  })
                })

            })
            .catch((err) => {
              console.log(err)
              this.setState({
                importingShows : false
              })
              Alert.alert('That file is invalid', `That's all we know`);
            })

        })
    });


  }

  render() {
    
    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: this.props.state.active ? 50 : 5 }]}>
          {/* { this._renderFavorites(this.props.state.subscribedShows) } */}
          {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
              this.props.clearShows()
            }}>
              <Text>Clear shows</Text>
            </TouchableOpacity>
          </View> */}
          <FlatList 
            numColumns={3}
            data={this.props.state.subscribedShows}
            initialNumToRender={15}
            renderItem={({item}) => {
              return (
                <ShowThumbnail 
                  style={{

                  }}
                  newIndicator={item.newEpisodesAvailable}
                  name={item.title}
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
            ListFooterComponent={
              <FooterButton 
                icon={'export'}
                label={this.state.importingShows ? 'Importing Shows' : 'Import Shows'}
                opacity={this.state.importingShows ? 0.5 : (this.props.haveSubscribed ? 0.75 : 1) }
                disabled={this.state.importingShows ? true : false}
                onPress={() => {
                  this.importShows()
                }}
              />
            }
            />
        </ScrollView>
      </View>
    );
  }

}

function mapStateToProps(state, ownProps) {
	return {
    haveSubscribed : state.subscribedShows.length > 0 ? true : false,
		state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
    clearShows : () => {
      dispatch({
        type : 'Clear shows'
      })
    }
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscribedScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
  },
});
