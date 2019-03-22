import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView , Alert, Dimensions, FlatList} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import XMLParser from 'react-xml-parser';
import { parseString } from 'react-native-xml2js';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'

import ShowThumbnail from 'components/ShowThumbnail';
import PlaylistThumbnail from 'components/PlaylistThumbnail';
import PlayBar from 'components/PlayBar';

import * as actions from 'actions'

class SubscribedScreen extends React.Component {

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
          console.log(data)

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

                  this.props.actions.importShows(theShows);
                })

            })
            .catch((err) => {
              console.log(err)
              Alert.alert('That file is invalid', `That's all we know`);
            })

        })



      // RNFetchBlob.fs.createFile(`${dirs.CacheDir}/podcast-import.opml`, res.uri, 'uri')
      // .then((something)=>{

      //   console.log(something)

      //   // const dirs = RNFetchBlob.fs.dirs
      //   filePath = `${dirs.CacheDir}/podcast-import.opml`

      //   RNFetchBlob.fs.readFile(filePath, 'base64')
      //   .then((data) => {
      //     // handle the data ..
      //     console.log(data)

      //       parseString(res.uri, (err, { opml }) => {
      //         let showUrls = opml.body[0].outline[0].outline
      //         .map(show => show.$)
      //         .map((show) => show.xmlUrl)

      //         console.log(showUrls)


      //         // this.props.actions.importShows(showUrls);
      //       });

      //   })
        
      // })

    });


    var xml = `
      <opml version="1.0">
        <head>
          <title>Pocket Casts Feeds</title>
        </head>
        <body>
          <outline text="feeds">
            <outline type="rss" text="Embedded" xmlUrl="https://www.npr.org/rss/podcast.php?id=510311" />
            <outline type="rss" text="Revisionist History" xmlUrl="https://feeds.megaphone.fm/revisionisthistory" />
            <outline type="rss" text="Planet Money" xmlUrl="http://www.npr.org/rss/podcast.php?id=510289" />
            <outline type="rss" text="TED Radio Hour" xmlUrl="http://www.npr.org/rss/podcast.php?id=510298" />
            <outline type="rss" text="Radiolab" xmlUrl="http://feeds.wnyc.org/radiolab" />
            <outline type="rss" text="Dan Carlin&apos;s Hardcore History" xmlUrl="http://feeds.feedburner.com/dancarlin/history?format=xml" />
            <outline type="rss" text="99% Invisible" xmlUrl="http://feeds.99percentinvisible.org/99percentinvisible" />
            <outline type="rss" text="The Joe Rogan Experience" xmlUrl="http://joeroganexp.joerogan.libsynpro.com/rss" />
            <outline type="rss" text="You Made It Weird with Pete Holmes" xmlUrl="http://feeds.feedburner.com/YouMadeItWeird" />
            <outline type="rss" text="Timothy Keller Sermons Podcast by Gospel in Life" xmlUrl="https://ginl-podcast.s3.amazonaws.com/0_Resources/Timothy_Keller_Podcasts.xml" />
            <outline type="rss" text="ShopTalk" xmlUrl="https://shoptalkshow.com/feed/podcast" />
            <outline type="rss" text="All Things Comedy Live" xmlUrl="http://feeds.soundcloud.com/users/soundcloud:users:25905339/sounds.rss" />
            <outline type="rss" text="Stay Tuned with Preet" xmlUrl="https://rss.art19.com/stay-tuned-with-preet" />
            <outline type="rss" text="All Songs Considered" xmlUrl="http://www.npr.org/rss/podcast.php?id=510019&amp;uid=n1qe4e85742c986fdb81d2d38ffa0d5d53" />
            <outline type="rss" text="Fresh Air" xmlUrl="https://www.npr.org/rss/podcast.php?id=381444908" />
            <outline type="rss" text="The Daily" xmlUrl="http://rss.art19.com/the-daily" />
            <outline type="rss" text="How I Built This with Guy Raz" xmlUrl="https://www.npr.org/rss/podcast.php?id=510313" />
            <outline type="rss" text="Up First" xmlUrl="https://www.npr.org/rss/podcast.php?id=510318" />
            <outline type="rss" text="Battle Ready | Erwin McManus" xmlUrl="https://battleready.blubrry.net/feed/podcast" />
            <outline type="rss" text="Mosaic - Erwin McManus  (Audio)" xmlUrl="https://mosaicla.blubrry.net/feed/podcast" />
            <outline type="rss" text="The Indicator from Planet Money" xmlUrl="https://www.npr.org/rss/podcast.php?id=510325" />
            <outline type="rss" text="The Daily Show With Trevor Noah: Ears Edition" xmlUrl="https://feeds.megaphone.fm/the-daily-show" />
            <outline type="rss" text="Change Agent" xmlUrl="https://rss.art19.com/change-agent" />
            <outline type="rss" text="Today, Explained" xmlUrl="https://rss.art19.com/today-explained" />
            <outline type="rss" text="WorkLife with Adam Grant" xmlUrl="https://feeds.feedburner.com/WorklifeWithAdamGrant" />
            <outline type="rss" text="Comedy Bang Bang: The Podcast" xmlUrl="https://rss.art19.com/comedy-bang-bang" />
            <outline type="rss" text="Common Sense with Dan Carlin" xmlUrl="http://feeds.feedburner.com/dancarlin/commonsense?format=xml" />
            <outline type="rss" text="10 Minute Writer&apos;s Workshop" xmlUrl="http://feeds.megaphone.fm/PPY4168247956" />
            <outline type="rss" text="Invisibilia" xmlUrl="https://www.npr.org/rss/podcast.php?id=510307" />
            <outline type="rss" text="This American Life" xmlUrl="http://feed.thisamericanlife.org/talpodcast" />
            <outline type="rss" text="Hidden Brain" xmlUrl="https://www.npr.org/rss/podcast.php?id=510308" />
            <outline type="rss" text="The Tim Ferriss Show" xmlUrl="https://rss.art19.com/tim-ferriss-show" />
            <outline type="rss" text="How To Do Everything" xmlUrl="https://www.npr.org/rss/podcast.php?id=510303" />
            <outline type="rss" text="Adam Ruins Everything" xmlUrl="https://maximumfun.org/feeds/are.xml" />
            <outline type="rss" text="The Trip" xmlUrl="http://feeds.megaphone.fm/thetrip" />
            <outline type="rss" text="Freakonomics Radio" xmlUrl="http://feeds.feedburner.com/freakonomicsradio" />
            <outline type="rss" text="Reply All" xmlUrl="HTTP://Feeds.gimletmedia.com/hearreplyall" />
            <outline type="rss" text="Waking Up with Sam Harris" xmlUrl="http://wakingup.libsyn.com/rss" />
            <outline type="rss" text="Monday Morning Podcast" xmlUrl="http://billburr.libsyn.com/rss" />
            <outline type="rss" text="1 Year Daily Audio Bible" xmlUrl="http://feeds.feedburner.com/dailyaudiobible" />
            <outline type="rss" text="1 Year Daily Audio Bible En Espanol" xmlUrl="http://feeds.feedburner.com/dailyaudiobiblespanish" />
            <outline type="rss" text="Radio Ambulante" xmlUrl="https://www.npr.org/rss/podcast.php?id=510315" />
            <outline type="rss" text="Crazy/Genius" xmlUrl="https://feeds.megaphone.fm/crazygenius" />
            <outline type="rss" text="It&apos;s Been a Minute with Sam Sanders" xmlUrl="https://www.npr.org/rss/podcast.php?id=510317" />
            <outline type="rss" text="Varandas ITS" xmlUrl="http://feeds.soundcloud.com/users/soundcloud:users:235636850/sounds.rss" />
            <outline type="rss" text="Rough Translation" xmlUrl="https://www.npr.org/rss/podcast.php?id=510324" />
            <outline type="rss" text="Andy Stanley Leadership Podcast" xmlUrl="http://feeds.feedburner.com/andystanleyleader" />
            <outline type="rss" text="Daily Radio Program with Charles Stanley - In Touch Ministries" xmlUrl="https://www.intouch.org/listen/podcast/today-on-radio" />
            <outline type="rss" text="Welcome to Night Vale" xmlUrl="http://feeds.nightvalepresents.com/welcometonightvalepodcast" />
            <outline type="rss" text="Conversations with People Who Hate Me" xmlUrl="http://feeds.nightvalepresents.com/ConversationsWithPeopleWhoHateMe" />
            <outline type="rss" text="Endless Thread" xmlUrl="https://rss.wbur.org/endlessthread/podcast" />
            <outline type="rss" text="Everything Is Stories" xmlUrl="http://eisradio.libsyn.com/rss" />
            <outline type="rss" text="Here Be Monsters" xmlUrl="http://feeds.feedburner.com/herebemonsterspodcast/" />
            <outline type="rss" text="Science Vs" xmlUrl="http://feeds.gimletmedia.com/sciencevs" />
            <outline type="rss" text="How It Began: A History of the Modern World" xmlUrl="http://howitbeganshow.libsyn.com/rss" />
            <outline type="rss" text="The Third Wave" xmlUrl="http://psychedelia.libsyn.com/rss" />
            <outline type="rss" text="StartUp Podcast" xmlUrl="http://feeds.hearstartup.com/hearstartup" />
            <outline type="rss" text="Bundyville" xmlUrl="https://podcasts.opb.org/rss/bundyville" />
            <outline type="rss" text="Sleep With Me | The Podcast That Puts You To Sleep" xmlUrl="http://feeds.nightvalepresents.com/sleepwithme" />
            <outline type="rss" text="Trumpcast" xmlUrl="https://feeds.megaphone.fm/trumpcast" />
            <outline type="rss" text="ID10T with Chris Hardwick" xmlUrl="https://rss.art19.com/id10t" />
            <outline type="rss" text="Pod Save America" xmlUrl="http://feeds.feedburner.com/pod-save-america" />
            <outline type="rss" text="The Vergecast" xmlUrl="https://feeds.megaphone.fm/vergecast" />
            <outline type="rss" text="NPR Politics Podcast" xmlUrl="https://www.npr.org/rss/podcast.php?id=510310" />
            <outline type="rss" text="FiveThirtyEight Politics" xmlUrl="http://www.espn.com/espnradio/podcast/feeds/itunes/podCast?id=14554755" />
            <outline type="rss" text="Can He Do That?" xmlUrl="http://podcast.posttv.com/itunes-58861635e4b039a652877de6.xml" />
            <outline type="rss" text="Order 9066" xmlUrl="https://feeds.publicradio.org/public_feeds/order-9066/itunes/rss" />
            <outline type="rss" text="The Jordan B. Peterson Podcast" xmlUrl="https://feeds.blubrry.com/feeds/jordanbpeterson.xml" />
            <outline type="rss" text="The RobCast" xmlUrl="https://robbell.podbean.com/feed.xml" />
            <outline type="rss" text="Heston&apos;s Pod &amp; Chips" xmlUrl="https://audioboom.com/channels/4977433.rss" />
          </outline>
        </body>
      </opml>
    `

    // parseString(res.uri, (err, { opml }) => {
    //   let showUrls = opml.body[0].outline[0].outline
    //   .map(show => show.$)
    //   .map((show) => show.xmlUrl)

    //   console.log(showUrls)

    //   // this.props.actions.importShows(showUrls);
    // });

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
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => {
              this.importShows()
            }}>
              <Text>Import your subscribed shows</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.props.clearShows()
            }}>
              <Text>Clear shows</Text>
            </TouchableOpacity>
          </View>
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5
  },
});
