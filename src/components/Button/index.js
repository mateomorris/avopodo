import React from 'react';
import { PanResponder, StyleSheet, Text, View, Image, TouchableOpacity, Animated, Alert } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import SvgUri from 'react-native-svg-uri';
import tinycolor from 'tinycolor2';
import { animate } from 'helpers/animations';

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
});

export class DiscoverButton extends React.Component {

    state = {
        pressedScale : new Animated.Value(1)
    }

    _onPress = () => {
        this._resetButton();
        this.props.onPress();
    }

    _animateButton = () => {
        animate([
            {
                property : this.state.pressedScale,
                toValue : 0.95
            }
        ])
    }

    _resetButton = () => {
        animate([
            {
                property : this.state.pressedScale,
                toValue : 1
            }
        ])
    }

    render () {

        let { genre, icon, style } = this.props 

        return (
            <TouchableView style={[{
                alignItems: 'center',
                justifyContent: 'center',
                height: 100,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 5,
                backgroundColor: '#111',
                transform : [{ scale : this.state.pressedScale }]
            }, style]} 
            onInitialPress={() => {
                this._animateButton()
            }}
            onRelease={(completed) => {
                completed ? 
                this._onPress() : 
                this._resetButton()
            }}>
                <SvgUri style={{
                paddingBottom: 5,
                }} width="20" height="20" svgXmlData={this.props.icon} fill={'#EEE'} fillAll={true}/>
                <Text style={{
                fontSize: 15,
                color: 'white',
                fontWeight: '600',
                textAlign: 'center'
                }}>{ genre.name }</Text>
            </TouchableView>
        )
    }
}

export class TouchableView extends React.Component {
    onLayout = (e) => {
        this.props.onLayout(e.nativeEvent.layout)
    }

    render() {
        return (
            <Animated.View
                onLayout={this.onLayout.bind(this)}
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => {
                    this.props.onInitialPress()
                }}
                onResponderRelease={() => {
                    this.props.onRelease(true)
                    this.props.onPress()
                }}
                onResponderTerminate={() => {
                    this.props.onRelease(false)
                }}
                style={this.props.style}
                { ...this.props.panHandlers }
            >
                { this.props.children }
            </Animated.View>
        )
    }
}

TouchableView.defaultProps = {
    panHandlers : PanResponder.create({}),
    onLayout : () => {

    },
    onInitialPress : () => {

    },
    onRelease : () => {

    },
    onPress : () => {

    }
}

export default class Button extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

        return (
            <TouchableOpacity style={[{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderColor: 'whitesmoke',
                borderWidth: 2,
                borderRadius: 35,
                flexDirection: 'row'
            }, this.props.style]} onPress={() => {
                this._handlePress()
            }}>
                <Text style={{
                    color: 'white',
                    fontWeight: '900'
                }}>{ this.props.label }</Text>
                <Image style={{
                    height: 20,
                    width: 20,
                    marginLeft: 3
                }} source={this.props.icon} />
            </TouchableOpacity>
        );

    }
}

export class CircleButton extends React.Component {

    state = {
        pressed : false,
        pressedInnerScale : new Animated.Value(1),
        pressedOuterScale : new Animated.Value(1)
    }

    _handlePress = () => {

        this.setState({
            pressed : true
        })

        animate([
            {
                property: this.state.pressedInnerScale,
                toValue : 1.1,
                tension: 1000,
                friction: 100000
            }, 
            {
                property: this.state.pressedOuterScale,
                toValue : 0.9,
                tension: 1000,
                friction: 100000
            }
        ], () => {

        })
    }

    _handleRelease = () => {

        this.setState({
            pressed : false
        })


        animate([
            {
                property: this.state.pressedInnerScale,
                toValue : 1,
                tension: 1000,
                friction: 100000
            }, 
            {
                property: this.state.pressedOuterScale,
                toValue : 1,
                tension: 1000,
                friction: 100000
            }
        ], () => {

        })

        this.props.onPress();

    }

    _handleCancel = () => {

        this.setState({
            pressed : false
        })

        animate([
            {
                property: this.state.pressedInnerScale,
                toValue : 1,
                tension: 1000,
                friction: 100000
            }, 
            {
                property: this.state.pressedOuterScale,
                toValue : 1,
                tension: 1000,
                friction: 100000
            }
        ], () => {

        })
    }


    render() {

        let { spinner, color, size, icon, style } = this.props

        let { pressed } = this.state

        return (
            <View style={[
                style,
                {justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: size, height: size }]} 
                onPress={this._handlePress}>
                <Animated.View style={{ 
                    borderRadius: 500,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    backgroundColor: `${color}7F`,
                    position: 'absolute',
                    padding: size / 10,
                    transform: [
                        {
                            scale: this.state.pressedOuterScale
                        }
                    ]
                }}
                onStartShouldSetResponder={() => true}
                onResponderGrant={() => {
                    this._handlePress()
                }}
                onResponderRelease={() => {
                    this._handleRelease()
                }}
                onResponderTerminate={() => {
                    this._handleCancel()
                }}
                >
                    {
                        spinner &&
                        <MaterialIndicator color={ color } size={size * 1.2} animationDuration={3000} 
                        style={{
                            position: 'absolute',
                            zIndex: 10
                        }}/>
                    }
                    <Animated.View style={{
                        height: size, 
                        width: size, 
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: color, 
                        borderRadius: 500,
                        zIndex: 20,
                        transform: [
                            {
                                scale: this.state.pressedInnerScale
                            }
                        ]
                    }}>
                    {
                        !this.props.testing &&
                        <SvgUri style={{ 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            borderRadius: 500,
                            zIndex: 0,
                        }} width={size * 0.5} height={size * 0.5} svgXmlData={icon} fill={tinycolor(color).isLight() ? 'black' : 'white'} fillAll={true}/>
                    } 
                    {
                        !icon &&
                        <Text style={{
                            color: tinycolor(color).isLight() ? 'black' : 'white',
                            fontSize: 20,
                            fontWeight: '500'
                        }}>
                            15
                        </Text>
                    }
                    </Animated.View>
                </Animated.View>
            </View>
        );

    }
}

CircleButton.defaultProps = {
    color : '#555555',
    spinner : false,
    size : 100,
    style : {}
}