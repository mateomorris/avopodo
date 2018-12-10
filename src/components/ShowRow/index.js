import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

const styles = StyleSheet.create({

});

export class ShowRow extends React.Component {

  state = {
    subscribed : this.props.subscribed
  }

  _subscribeToShow = () => {

    this.setState({
      subscribed : this.state.subscribed ? false : true
    }, () => {
      this.props.subscribeToShow()
    })

  }
    
    render() {

        return (
            <TouchableOpacity 
              key={this.props.index} 
              style={{ 
                flexDirection: 'row', 
                paddingTop: 15, 
                paddingBottom: 15, 
                borderBottomColor: '#DDD', 
                borderBottomWidth: 1, 
                height: 100, 
                overflow: 'hidden' 
              }} 
              onPress={() => {this.props.onSearchResultPress()}}
            >
              <View style={{ marginRight: 10 }}>
                <Image source={{ uri: this.props.item.image }} style={{ width: 75, height: 75, borderRadius: 5, backgroundColor: '#EEEEEE' }}/>
              </View>
              <View style={{flex: 1}}>
                <Text style={{ fontSize: 15, fontWeight: '700' }} ellipsizeMode={'tail'} numberOfLines={1}>{this.props.item.title}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }} ellipsizeMode={'tail'} numberOfLines={4}>{this.props.item.description}</Text>
              </View>
              <TouchableOpacity style={{ justifyContent: 'center'}} onPress={() => {
                this._subscribeToShow()
              }}>
                <Image 
                  source={ this.state.subscribed ? require('assets/bookmark-black.png') : require('assets/bookmark.png') } 
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
        );

    }
}

ShowRow.defaultProps = {
  item : {
    image: ''
  }
}