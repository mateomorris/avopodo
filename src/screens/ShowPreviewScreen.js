import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import { LightBox } from 'components/LightBox';
import Button from 'components/Button';

import * as specialActions from 'actions';

class ShowPreviewScreen extends Component {

    state = {
        artwork: this.props.item.image,
        artworkColor: 'transparent',
        subscribed: this.props.subscribed
    }

    _loadArtwork = () => {
        this.props.actions.getDominantColorfromArtwork(encodeURIComponent(this.props.item.image)).then((color) => {
            this.setState({
                artworkColor: color
            })
        }) 
    }

    _goToSubscribed = () => {
        Navigation.dismissOverlay(this.props.componentId);
        this.props.goToSubscribed()
    }    

    componentWillMount() {
        if (this.props.subscribed) {
            const show = this.props.details.subscribedShows.find((show) => {
                return show.id == this.props.item.id
            })
            this.setState({
                artwork : show.image,
                artworkColor: show.color
            })
        } else {
            this._loadArtwork();
        }
    }

    componentWillUnmount = () => {
        if (this.state.subscribed != this.props.subscribed) {
            this.props.onSubscribe()
        }
    }

    render() {
        const { title, publisher, description, image, imageHighRes } = this.props.item;

        const screenDimensions = Dimensions.get('window');
        const screenWidth = screenDimensions.width;
        const screenHeight = screenDimensions.height;

        return(
            
            <LightBox componentId={this.props.componentId}>
                <Image source={{ uri: imageHighRes || image }} 
                    style={{
                        width: screenWidth - 90, // Parent padding + width
                        height: screenWidth - 90, 
                        flex: 1,
                        borderRadius: 5,
                        marginBottom: 15,
                        backgroundColor: this.state.artworkColor
                }} />
                <Text style={{
                    fontSize: 30, 
                    fontWeight: '700',
                    color: 'white'
                }}>
                    { title }
                </Text>
                { title == publisher ? null : <Text style={{
                    fontSize: 20, 
                    color: 'whitesmoke'
                }}>
                    { publisher }
                </Text>}
                <View
                    style={{
                        backgroundColor: this.state.artworkColor,
                        height: 3,
                        width: 45,
                        marginTop: 15,
                        marginBottom: 15,
                        borderRadius: 5
                    }}
                ></View>
                <Text style={{ color: 'whitesmoke', fontSize: 15 }}>
                    { description }
                </Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginBottom: 20,
                    marginTop: 20
                }}>
                        {
                            this.state.subscribed ? 
                            // <Button 
                            //     style={{
                            //         marginRight: 10
                            //     }}
                            //     onPress={() => {
                            //         this.setState({
                            //             subscribed: false
                            //         });
                            //         Navigation.dismissOverlay(this.props.componentId);
                            //     }}
                            //     label={'Unsubscribe'}
                            //     icon={require('assets/bookmark.png')}
                            // />
                            <Button 
                                style={{
                                    marginRight: 10
                                }}
                                onPress={() => {
                                    // this.setState({
                                    //     subscribed: true
                                    // });
                                    this._goToSubscribed();
                                }}
                                label={'Go to Subscribed'}
                                icon={require('assets/next.png')}
                            />
                            : 
                            <Button 
                                onPress={() => {
                                    this.setState({
                                        subscribed: true
                                    });
                                    // Navigation.dismissOverlay(this.props.componentId);
                                }}
                                label={'Subscribe'}
                                icon={require('assets/bookmark.png')}
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
