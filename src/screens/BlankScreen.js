import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as specialActions from 'actions'

class BlankScreen extends React.Component {

  render() {

    this.state = {

    };

    return (
      <View>
        <Text style={{ fontSize: 40, textAlign: 'center', marginTop: 20}}>
          This is the blank screen
        </Text>
      </View>
    );
  }

}

function mapStateToProps(state, ownProps) {
	return {
		state: state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(specialActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(BlankScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
});
