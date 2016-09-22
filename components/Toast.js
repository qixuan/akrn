/**
 * @providesModule Overlay
 * @flow-weak
 */

'use strict';

var React = require('react-native');
var {
  View,
  Text,
  PropTypes,
  StyleSheet,
  Dimensions,
  requireNativeComponent,
} = React;
var Overlay = require('./overlay');
var window = Dimensions.get('window');
var TimerMixin = require('react-timer-mixin');

var Toast = React.createClass({
  mixins:[TimerMixin],
  propTypes: {
    /**
     * Determines the visibility of the Overlay. When it is not visible,
     * an empty View is rendered.
     */
    isVisible: React.PropTypes.bool,
  },

  getInitialState: function () {
    return {
      isVisible: false,
      overlayCanClose: true,
      content: '',
      duration:null
    }
  },
  _onOverlayPress(){
    if(this.state.overlayCanClose){
      this.setState({
        isVisible: false,
        overlayCanClose: true,
        content: ''
      });
    }  
  },

  render() {
    var {
      isVisible,
    } = this.props;
    if (this.state.isVisible) {
      var self = this;
      if (this.state.duration != null) {
        clearInterval(this.timer);
        this.timer = setTimeout(function () {
          self.setState({
            isVisible: false,
            duration: null
          })
        }.bind(this), this.state.duration)
      }
      return (
        <View style={styles.container}>
            <Overlay
            pageX={0}
            pageY={0}
            overlayStyle={this.state.overlayStyle}
            show={true}
            onPress={ this._onOverlayPress }/>
            <View style={styles.main}>
              <Text style={styles.content}>{this.state.content}</Text>
            </View>
        </View>
      );
    } else {
      return null;
    }
  },
});


var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: window.height,
    backgroundColor: 'transparent'
  },
  main:{
    height: 100,
    width: 260,
    top: window.height / 2 - 50,
    left: window.width / 2 - 130,
    backgroundColor: 'rgba(78,78,78,.8)',
    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: '#fff',
    fontWeight: "800",
    textAlign: 'center',
    justifyContent:'center',
    width: 260,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: 'transparent'
  }
})

module.exports = Toast;
