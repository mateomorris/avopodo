import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from "react-native-navigation";

import Lightbox from '../components/Lightbox';

import * as specialActions from '../redux/actions';

class ShowPreviewScreen extends Component {

    state = {
        playing : this.props.playing
    }

    render() {

        const { showColor, showTitle, showImage, title, description, duration, showPublisher, publishDate } = this.props.episode;

        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        return(
            
            <Lightbox componentId={this.props.componentId} height={'auto'}>
                <View style={{
                    flexDirection : 'row'
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
                            <Image source={require('../assets/calendar.png')} style={{
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
                <Text style={{ color: 'whitesmoke', fontSize: 15 }}>
                    { description }
                </Text>
                <View style={{
                    alignItems: 'flex-end',
                    marginTop: 20
                }}>
                    {
                        !this.state.playing &&
                        <TouchableOpacity style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderColor: 'whitesmoke',
                            borderWidth: 2,
                            borderRadius: 35,
                            flexDirection: 'row',
                            marginBottom: 40
                        }} 
                        onPress={() => { 
                            this.setState({
                                playing : this.state.playing ? false : true
                            })
                            this.props.onPlayPress() 
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: '900'
                            }}>Play</Text>
                            <Image style={{
                                height: 15,
                                width: 15,
                                marginTop: 2,
                                marginLeft: 5,
                            }} source={require('../assets/play.png')} />
                        </TouchableOpacity>
                    }
                </View>
            </Lightbox>
        )
    }
}

function mapStateToProps(state, ownProps) {
	return {
		details: state.reducer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(specialActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowPreviewScreen);
