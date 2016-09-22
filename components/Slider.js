/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Slider
 * @flow
 */
'use strict';

// var Image = require('Image');
// var Platform = require('Platform');
// var PropTypes = require('react/lib/ReactPropTypes');
// var StyleSheet = require('StyleSheet');
// var View = require('View');
var React = require('react-native');
//var React = require('React');
var {
  StyleSheet,
  View,
  Image,
  PropTypes,
  Platform,
  requireNativeComponent,
  Text
} = React;

//var requireNativeComponent = require('requireNativeComponent');

type Event = Object;

/**
 * A component used to select a single value from a range of values.
 */
var Slider = React.createClass({

  propTypes: {
    ...View.propTypes,

    /**
     * Used to style and layout the `Slider`.  See `StyleSheet.js` and
     * `ViewStylePropTypes.js` for more info.
     */
    style: View.propTypes.style,

    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, you don't need to update the
     * value during dragging.
     */
    value: PropTypes.number,

    /**
     * Step value of the slider. The value should be
     * between 0 and (maximumValue - minimumValue).
     * Default value is 0.
     */
    step: PropTypes.number,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     * @platform ios
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     * @platform ios
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Assigns a single image for the track. Only static images are supported.
     * The center pixel of the image will be stretched to fill the track.
     * @platform ios
     */
    trackImage: Image.propTypes.source,

    /**
     * Assigns a minimum track image. Only static images are supported. The
     * rightmost pixel of the image will be stretched to fill the track.
     * @platform ios
     */
    minimumTrackImage: Image.propTypes.source,

    /**
     * Assigns a maximum track image. Only static images are supported. The
     * leftmost pixel of the image will be stretched to fill the track.
     * @platform ios
     */
    maximumTrackImage: Image.propTypes.source,

    /**
     * Sets an image for the thumb. Only static images are supported.
     * @platform ios
     */
    thumbImage: Image.propTypes.source,

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * Used to locate this view in UI automation tests.
     */
    testID: PropTypes.string,
  },

  getDefaultProps: function() : any {
    return {
      disabled: false,
      value: 0,
      minimumValue: 0,
      maximumValue: 1,
      step: 0,
      // minimumTrackTintColor:'#00c7b2',
      // maximumTrackTintColor:'#e4e4e4',
      // minimumTrackImage:require('./statics/leftSlider.png'),
      // maximumTrackImage:require('./statics/rightSlider.png'),
      // thumbImage:require('./statics/circle.png')
      minimumTrackImage:{isStatic:true,uri:'AKRNLib.bundle/slider_min@2x.png'},
      maximumTrackImage:{isStatic:true,uri:'AKRNLib.bundle/slider_max@2x.png'},
      thumbImage:{isStatic:true,uri:'AKRNLib.bundle/slider_circle@2x.png'},
    };
  },
  getInitialState:function(){
    var value = this.props.value;
      return {
        value:value
      }
  },
  getValue:function(){
    var self = this;
    return {
      value:self.state.value
    }
  },
  _onValueChange:function(event){
    var value = event.nativeEvent.value || 0;
    this.setState({
      value:value
    });
    this.props.onValueChange && this.props.onValueChange(value);
  },
  render: function() {
    let {style, onValueChange, onSlidingComplete, ...props} = this.props;
    props.style = [styles.slider, style];
    props.onValueChange = this._onValueChange;
    props.onChange = props.onValueChange;
    props.onSlidingComplete = ((event: Event) => {
      onSlidingComplete && onSlidingComplete(event.nativeEvent.value);
    });

    return ( 

      <View style={{padding:20}}>
        <View style={styles.title}>
          <Text style={styles.uiTitle}>{this.props.uiTitle}</Text>
          <Text style={styles.numTitle}>{parseInt(this.state.value)}{this.props.unit}</Text>
        </View>
        <RCTSlider
        {...props}
        enabled={!this.props.disabled}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.minimumValue}{this.props.unit}</Text>
          <Text style={styles.text}>{this.props.maximumValue}{this.props.unit}</Text>
        </View>
      </View> );
  }
});

let styles = StyleSheet.create({
    textContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
    },
    title:{
      flexDirection:'row',
      justifyContent:'space-between',

    },
    text:{
      color:'#666',
      fontSize:15     
    },
    uiTitle:{
      color:'#333',
      fontSize:16
    },
    numTitle:{
      color:'#ff8650',
      fontSize:16
    }

})

if(Platform.OS == 'ios'){
  styles.slider = {
    height:40
  }
}


let options = {};
if (Platform.OS === 'android') {
  options = {
    nativeOnly: {
      enabled: true,
    }
  };
}
const RCTSlider = requireNativeComponent('RCTSlider', Slider, options);

module.exports = Slider;