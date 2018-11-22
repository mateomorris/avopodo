import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({
    container: {
        margin: 5, 
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2,
        shadowOpacity: 0.75
    },
    thumbnail: { 
        width: 120, 
        height: 120, 
        borderRadius: 5
    }
});

export default class EpisodeSnippet extends React.Component {

    state = {
        titleHeight : null,
        SVGs : {
            play : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>button-play</title><path fill="black" d="M12,24A12,12,0,1,0,0,12,12.013,12.013,0,0,0,12,24Zm4.812-11.5a.939.939,0,0,1-.587.824L10.14,16.366a1.185,1.185,0,0,1-.531.133.919.919,0,0,1-.488-.136,1.032,1.032,0,0,1-.459-.911V9.546a.974.974,0,0,1,1.478-.914l6.085,3.043A.939.939,0,0,1,16.812,12.5Z"/></svg>`,
        }
    }

    _handlePress = () => {
        this.props.onPress();
    }

    _normalizeDuration = (duration) => {
        let durationInHours = parseFloat(duration / (60 * 60)).toFixed(1)
        if (durationInHours < 1) {
            return `${durationInHours * 60}m`
        } else {
            return `${durationInHours}h`
        }
    }

    _getDate = (ms) => {
        const theDate = new Date(ms)
        const currentDate = new Date();

        const month = theDate.toLocaleString('en-us', { month: "long" })
        const day = theDate.getDate()
        const year = theDate.getFullYear();

        // Only show the year if it's past
        if (year == currentDate.getFullYear()) {
            return `${month} ${day}`;
        } else {
            return `${month} ${day}, ${year}`;
        }
    }

    render() {

        const { title, showImage, showImageHighRes, duration, description, publishDate, showColor } = this.props.data; 

        return (
            <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 10, marginTop: 5, height: 130, overflow: 'hidden' }} onPress={() => {this.props.onPress()}}>
                <TouchableOpacity style={styles.container} onPress={() => { this.props.onThumbnailPress() }}>
                    <Image source={{uri: showImageHighRes || showImage, cache: 'force-cache'}} style={[styles.thumbnail, {backgroundColor: showColor}]} />
                    {
                        <SvgUri style={{
                                height: 20,
                                width: 20,
                                position: 'absolute',
                                right: 5,
                                bottom: 5
                            }} width="20" height="20" svgXmlData={this.state.SVGs.play} fill={'#EEE'} fillAll={true}/>
                    }
                    <View 
                        style={{ 
                            backgroundColor: 'black', 
                            borderBottomLeftRadius: 5,
                            borderTopRightRadius: 5,
                            paddingLeft: 5, 
                            paddingRight: 5, 
                            alignSelf: 'flex-start', 
                            marginLeft: 5 ,
                            position: 'absolute',
                            right: 0,
                            top: 0
                        }}>
                        <Text style={{ color: 'white', fontWeight: '900' }}>{this._normalizeDuration(duration)}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, paddingLeft: 10 }} onPress={() => { this.props.onDetailPress() }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10}}>
                        <Text 
                            numberOfLines={2}
                            ellipsizeMode={'tail'}
                            style={{fontSize: 16, color: 'black', fontWeight: '700', flex: 1}} 
                            onLayout={(e) => {
                                this.setState({
                                    titleHeight : e.nativeEvent.layout.height
                                })
                        }}>{title}</Text>
                        {/* <View style={{ backgroundColor: 'black', borderRadius: 20, paddingLeft: 5, paddingRight: 5, alignSelf: 'flex-start', marginLeft: 5 }}>
                            <Text style={{ color: 'white', fontWeight: '900' }}>{this._normalizeDuration(duration)}</Text>
                        </View> */}
                    </View>
                    <View>
                        <Text 
                            style={{fontSize: 14, color: '#666666', fontWeight: '500'}}
                            numberOfLines={this.state.titleHeight == 20 ? 6 : 5} // Check if title is taking up more than one line
                            ellipsizeMode={'tail'}>
                            <Text style={{fontSize: 14, color: '#666666', fontWeight: '700'}}>{`${this._getDate(publishDate)}${ description ? ' | ' : ''}`}</Text>
                            {description}
                        </Text>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        );

    }
}