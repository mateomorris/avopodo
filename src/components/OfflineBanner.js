import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import RequiresConnection from 'react-native-offline-mode';
import SvgUri from 'react-native-svg-uri';

import generalIcons from 'assets/generalIcons';

export class OfflineBanner extends React.Component {

    render() {

        return (
            <View style={{
                // transform: [{ rotate: '45deg'}],
                position: 'absolute',
                top: 25,
                right: -15,
                // left: -50,
                width: 100,
                height: 30,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: 10,
                borderRadius: 15
            }}>
                <SvgUri 
                    style={{ 
                        // width: 20,
                        // height: 20,
                        // padding: 10
                    }} 
                    width="20" 
                    height="20" 
                    svgXmlData={generalIcons['offline']} 
                    fill={'white'} 
                    fillAll={true}
                />
            </View>
        );

    }
}

export class OnlineBanner extends React.Component {

    render() {

        return (
            <View style={{

            }}>

            </View>
        );

    }
}

export default RequiresConnection(OnlineBanner, OfflineBanner) 
