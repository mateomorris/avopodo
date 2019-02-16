import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform, Animated, PanResponder , Alert } from 'react-native';
import { animate } from 'helpers/animations';
import { TouchableView } from 'components/Button'

const styles = StyleSheet.create({

});

export default class CustomSlider extends React.Component {

    state = {
        width: 0,
        position: this.props.position,
    }

    _panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return true
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
            this.props.onScrubStart();
            // gestureState.d{x,y} will be set to zero now
        },
        onPanResponderMove: (evt, gestureState) => {
            // The most recent move distance is gestureState.move{X,Y}

            let scrubPosition = gestureState.moveX - ((Dimensions.get('window').width - this.state.width) / 2)

            if (this._normalizePosition(scrubPosition) <= 0) {
                this.props.onScrub(0);
            } else if (this._normalizePosition(scrubPosition) >= this.state.width) {
                this.props.onScrub(this.state.width);
            } else {
                this.props.onScrub(scrubPosition);
            }

        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {

            this.props.onScrubComplete();

        },
        onPanResponderTerminate: (evt, gestureState) => {
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
            return true;
        },
    });

  onLayout = (e) => {
    this.setState({
      width: e.nativeEvent.layout.width
    })
  }

  _normalizePosition = (position) => {
    if (position < 0) {
        return 0;
    } else if (position > this.state.width) {
        return this.state.width
    } else {
        return position;
    }
  }

    render() {

        // console.log(this.props.position._value === null ? 'Is null' : 'NOT NULL')
        console.log(this.props.buffered)

        return (
            <View style={{
                height: 3,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `rgba(250,250,250,0.1)`,
                zIndex: 9999
            }} onLayout={this.onLayout}>
                {/* <Text style={{ color: 'white' }}>{this.props.position}</Text> */}
                <Animated.View 
                    {...this._panResponder.panHandlers}
                    style={{
                        padding: 20,
                        borderRadius: 500,
                        position: 'absolute',
                        left : this._normalizePosition(this.props.position) - 20,
                        zIndex: 999999,
                        opacity: this.props.buffered ? 1 : 0.5
                    }}
                >
                    <View style={{
                        borderRadius: 500,
                        padding: 5,
                        backgroundColor: this.props.color,  
                    }}>
                    
                    </View>
                </Animated.View>
                <Animated.View style={{
                    height: '100%',
                    width: this._normalizePosition(this.props.position),
                    backgroundColor: this.props.color,
                    position: 'absolute',
                    left : 0,
                    borderRadius: 500,
                }}>
                </Animated.View>
                <Animated.View style={{
                    height: '100%',
                    width: this._normalizePosition(this.props.buffered),
                    backgroundColor: `${this.props.color}40`,
                    position: 'absolute',
                    left : 0,
                    borderRadius: 500,
                }}>
                </Animated.View>
            </View>
        );

    }
}