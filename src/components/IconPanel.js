import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({

});

export default class IconPanel extends React.Component {

    state = {
        selectedIcon : this.props.currentIcon || null
    }

    render() {

        let iconsWidth = Dimensions.get('window').width / 4 - 40
        let { icons } = this.props

        return (
            <View style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start'
            }}>
                {
                    Object.keys(icons).map((icon) => {
                        return (
                            <View opacity={this.state.selectedIcon == icon ? 0.5 : 1}>
                                <TouchableOpacity style={{
                                    margin: 10,
                                    width: iconsWidth,
                                    height: iconsWidth,
                                    padding: 10
                                }} onPress={() => {
                                    this.props.iconSelected(icon)
                                    this.setState({
                                        selectedIcon : icon
                                    })
                                }}>
                                    {/* {
                                        Platform.OS == 'ios' &&
                                        <SvgUri width="100%" height="100%" source={icons[icon]} fill={'white'} fillAll={true}/>
                                    } */}
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
        );

    }
}