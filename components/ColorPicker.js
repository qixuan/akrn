'use strict';
import React,{  
  AppRegistry,
  PanResponder,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  NativeModules,
  PixelRatio,
  processColor,
} from 'react-native';

const DA = require('../lib/DA')
const AKRCTColorPicker = NativeModules.AKRCTColorPicker;

var ColorPicker = React.createClass({
 _panResponder: {},
  _previousLeft: 0,
 _previousTop: 0,
 _circleStyles: {},
  circle: (null : ?{ setNativeProps(props: Object): void }),

  componentWillMount: function() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt,gestureState) => true,
      onMoveShouldSetPanResponder: (evt,gestureState) => true,
      // onPanResponderGrant: this._handlePanResponderGrant,
    // onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 50;//初始化属性值
    this._previousTop = 100;
    this._circleStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop
      }
    };
  },

  componentDidMount: function() {
    this._updatePosition();
  },

  render: function() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <View>
        <TouchableHighlight style={styles.circlestyle} ref = "colorcircle">
          <Image style={styles.container1} source={{uri: 'https://img.alicdn.com/tps/TB1VfYjLpXXXXcrXVXXXXXXXXXX-500-500.png'}} {...this._panResponder.panHandlers} />
        </TouchableHighlight>
        <View ref={(circle) => { this.circle = circle}} style={styles.circle} ></View>
        </View>
      </View>
    );
  },
 _pickColor: function(evt) {
    var self = this;
    var element = this.refs.colorcircle;
    var tag = React.findNodeHandle(element);

    AKRCTColorPicker.pick(tag,PixelRatio.get()*evt.x0 ,PixelRatio.get()*evt.y0 ,function(colorOB:Object){//所传坐标值需要换算为px
      console.log('colorOB:',colorOB)
      self.props.onValueChange && self.props.onValueChange(colorOB);
    });
  },
  _updatePosition: function() {
    this.circle && this.circle.setNativeProps(this._circleStyles);
  },
  _handlePanResponderEnd: function(evt:Object,gestureState:Object) {
    this._circleStyles.style.left = evt.nativeEvent.locationX ;
    this._circleStyles.style.top = evt.nativeEvent.locationY;
    this._updatePosition();
    this._pickColor(gestureState);
  },
});

var styles = StyleSheet.create({  
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    position: 'absolute',
    borderColor:'#fff',
    borderWidth:2
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
container1: {
    flex: 1,
    paddingTop: 0,
  },
  circlestyle: {
     width: 200,
    height: 200,
  },
});

module.exports = ColorPicker;
