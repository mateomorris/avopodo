import React from 'react'
import { View, Text, StyleSheet, Picker, Platform } from 'react-native'

export default class PlaylistPicker extends React.Component {
    state = {
        value: this.props.items[0]['value']
    }

    _renderIOS = () => {
        return (
            <View>
                <Text style={{
                    fontSize: 20,
                    color: 'white',
                    paddingLeft: 25, 
                }}>{ this.props.title }</Text>
                <View style={{ 
                    backgroundColor: 'rgba(0,0,0,.3)', 
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 30,
                    paddingRight: 30
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: 2.5
                    }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: 20
                        }}>
                            { this.props.label }
                        </Text>
                    </View>
                    <Picker
                    style={{ 
                        flex: 1,
                        paddingLeft: 2.5,
                        marginLeft: 2.5,
                        borderLeftColor: 'rgba(0,0,0,.5)',
                        borderLeftWidth: 3
                    }}
                    selectedValue={this.state.value}
                    itemStyle={{
                        height: 100, 
                        textAlign: 'left',
                        color: '#eee',
                    }}
                    onValueChange={(value) => { 
                        this.props.updateValue(value)
                        this.setState({ value }) 
                    }}>
                        {
                            this.props.items.map((item, index) => {
                                return <Picker.Item label={item.label} value={item.value} key={index}/>
                            })
                        }  
                    </Picker>
                </View> 
            </View>
        )
    }

    _renderAndroid = () => {
        return (
            <View>
                <Text style={{
                    fontSize: 20,
                    color: 'white',
                    paddingLeft: 25, 
                }}>{ this.props.title }</Text>
                <View style={{ 
                    backgroundColor: 'rgba(0,0,0,.3)', 
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 30
                }}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: 2.5
                    }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: 20
                        }}>
                            { this.props.label }
                        </Text>
                    </View>
                    <Picker
                    style={{ 
                        flex: 1,
                        paddingLeft: 2.5,
                        marginLeft: 10,
                        borderLeftColor: 'rgba(0,0,0,.5)',
                        borderLeftWidth: 3,
                        backgroundColor: 'white'
                    }}
                    selectedValue={this.state.value}
                    itemStyle={{
                        height: 100, 
                        textAlign: 'left',
                        color: '#eee',
                    }}
                    onValueChange={(value) => { 
                        this.props.updateValue(value)
                        this.setState({ value }) 
                    }}>
                        {
                            this.props.items.map((item) => {
                                return <Picker.Item label={item.label} value={item.value} />
                            })
                        }  
                    </Picker>
                </View> 
            </View>
        )
    }


    render() {
        return (
            Platform.OS == 'ios' ? 
            this._renderIOS() : 
            this._renderAndroid()
        )
    }
}