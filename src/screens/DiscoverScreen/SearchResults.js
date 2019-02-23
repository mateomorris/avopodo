import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Headline } from 'components/Headline'
import { ShowRow } from 'components/ShowRow';

export default class SearchResults extends React.Component {

  _renderSearchResults = (items) => {

    if (items) {
      return (
        items.map((item, index) => {
          return (
            <ShowRow 
                index={index}
                item={item}
                subscribed={this.props.checkIfSubscribed(item.id)}
                subscribeToShow={() => {
                  this.props.subscribeToShow(item)
                }}
                onSearchResultPress={() => {
                  this.props.onSearchResultPress(item)
                }}
              />
          );
        })
      );
    } 

  }

  componentDidMount() {
      console.log('Component Mounting')
  }

  componentWillMount() {
      console.log('Component will mount')
  }

    render() {
        return (
            <ScrollView contentContainerStyle={[styles.container, 
            {
            paddingBottom: this.props.active ? 70 : 20
            }]}>
                <View style={{
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    {          
                        this._renderSearchResults(this.props.searchResults) 
                    }
                </View>
                {
                  this.props.children
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
});
