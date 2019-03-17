import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";
import Autolink from 'react-native-autolink';

import { LightBox } from 'components/LightBox';
import { GhostButton } from 'components/Button';

import * as specialActions from 'actions';

class ShowPreviewScreen extends Component {

    state = {
        playing : this.props.playing
    }

    _getDownloadLabel = (downloadProgress = { progress : -1 }) => {
        if (downloadProgress.progress >= 0.99 ) {
            console.log('REMOVE DOWNLOAd')
            return 'Remove Download';
        } else if (downloadProgress.progress >= 0) {
            return 'Cancel Download'
        } else {
            console.log('DOWNLOAD')
            return 'Download'
        }
    }

    render() {

        const { showColor, showTitle, showImage, title, description, duration, showPublisher, publishDate } = this.props.episode;

        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        console.log(this.props)

        return(
            
            <LightBox componentId={this.props.componentId} height={'auto'}>
                <View style={{
                    flexDirection : 'row',
                }}>
                    <Image source={{ uri : showImage }} 
                        style={{
                            width: 100, // Parent padding + width
                            height: 100, 
                            borderRadius: 5,
                            marginBottom: 15,
                            marginRight: 10,
                            backgroundColor: showColor
                    }} />
                    <View style={{
                        flexDirection: 'column',
                        flex: 1
                    }}>
                        <Text style={{
                            fontSize: 18, 
                            color: 'white',
                            fontWeight: '900'
                        }}>
                            { title }
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            marginTop: 3
                        }}>
                            <Image source={require('assets/calendar.png')} style={{
                                width: 15,
                                height: 15,
                                marginTop: 1,
                                marginRight: 4
                            }}/>
                            <Text style={{
                                fontSize: 15, 
                                color: 'whitesmoke',
                                fontWeight: '700'
                            }}>
                                {this.props.actions.formatDate(this.props.episode.publishDate).full}
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: showColor,
                        height: 3,
                        width: 50,
                        marginTop: 5,
                        marginBottom: 15,
                        borderRadius: 5
                    }}
                ></View>
                <Autolink
                    style={{
                        color: '#fafafa'
                    }}
                    linkStyle={{
                        color: 'skyblue',
                        textDecorationLine: 'underline'
                    }}
                    text={description}
                    hashtag="instagram"
                    mention="twitter" />
                <Text style={{ color: 'whitesmoke', fontSize: 15 }}>
                    {/* { description } */}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    // flexDirection: 'column',
                    // justifyContent: 'center',
                    // alignItems: 'flex-end',
                    marginTop: 20
                }}>
                    <GhostButton 
                        label={this._getDownloadLabel(this.props.downloadProgress)}
                        icon={require('assets/download.png')}
                        onPress={() => {
                            Navigation.dismissOverlay(this.props.componentId)
                            this.props.onDownloadPress()
                        }}
                        style={{
                            marginRight: 10
                            // marginBottom: 10
                        }}
                    />
                    {
                        !this.state.playing &&
                        <GhostButton 
                            label={'Play'}
                            icon={require('assets/play.png')}
                            onPress={() => { 
                                this.setState({
                                    playing : this.state.playing ? false : true
                                })
                                Navigation.dismissOverlay(this.props.componentId)
                                this.props.onPlayPress() 
                            }}
                        />
                    }
                </View>
            </LightBox>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowPreviewScreen);
