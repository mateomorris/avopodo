import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

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
        borderRadius: 4
    }
});

export class ShowDetail extends React.Component {

    _handlePress = () => {
        this.props.onPress();
    }

    render() {

        const { title, image, description, color } = this.props; 

        return (
            // TODO: Subtly show shadow on scroll
            <TouchableOpacity onPress={this._handlePress} style={{ flexDirection: 'row', with: '30%', shadowRadius: 2, shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, paddingLeft: 10, paddingRight: 10, backgroundColor: 'black', paddingTop: 10, paddingBottom: 10 }}> 
                <View style={styles.container}>
                    <Image source={{uri: image, cache: 'force-cache'}} style={[styles.thumbnail, {backgroundColor: color}]} />
                </View>
                <View style={{ paddingLeft: 10, width: '65%' }}>
                    <View style={{ height: 130 }}>
                        <Text 
                            style={{fontSize: 15, color: '#fefefe', fontWeight: '500'}} 
                            ellipsizeMode='tail' 
                            numberOfLines={7}>
                            {description}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );

    }
}