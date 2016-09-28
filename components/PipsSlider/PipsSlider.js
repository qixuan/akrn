'use strict';
/**
 * [React description]
 * @type {[type]}
 * <View style={[styles.block,styles.blockTop]}>
            <Text style={styles.blockTitle}>{'色彩'}</Text>
            <MultiSlider ref='slider2'
                  min= {0}
            max= {100}
            name= {"烧色"}
            showTick= {true}
            step= {50}
            value={50}
            disabled={true} //可以不写
            disabledValue={[3,4] //可以不写
            stepDescription={['低','中','高']} 
             />
          </View>
 */
var React = require('react-native');
var {
  PropTypes,
  StyleSheet,
  PanResponder,
  View,
  TouchableHighlight,
  Text,
  NativeModules,
} = React;
var UIManager = NativeModules.UIManager
var converter = require('./converter');
var mockProps = require('./mockProps');

var sliderProps = {
  value: PropTypes.number,
  onValueChangeStart: PropTypes.func,
  onValueChange: PropTypes.func,
  onValueChangeFinish: PropTypes.func,

  width: PropTypes.number,
  sliderOrientation: PropTypes.string,
  touchDimensions: PropTypes.object,
  stepDescription: PropTypes.arrayOf(PropTypes.string),


  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,

  optionsArray: PropTypes.array,

  containerStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  selectedStyle: PropTypes.object,
  unselectedStyle: PropTypes.object,
  markerStyle: PropTypes.object,
  pressedMarkerStyle: PropTypes.object
};

var PipsSlider = React.createClass({

  propTypes: sliderProps,

  getDefaultProps: function () {
    return mockProps;
  },

  getInitialState() {
    this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min, this.props.max, this.props.step);
    return {
      disabled : this.props.disabled,
      disabledValue: this.props.disabledValue
    };
  },
  componentWillMount() {
    var customPanResponder = function (start, move, end) {
        return PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => start(),
          onPanResponderMove: (evt, gestureState) => move(gestureState),
          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => end(gestureState),
          onPanResponderTerminate: (evt, gestureState) => end(gestureState),
          onShouldBlockNativeResponder: (evt, gestureState) => true
        })
    };
   this._panResponderOne = customPanResponder(this.startOne, this.moveOne, this.endOne);
  },
  componentWillReceiveProps: function(nextProps) {
    this.set(nextProps.value);
    this.setState({
      disabled : nextProps.disabled,
      disabledValue : nextProps.disabledValue})
  },

  set(value) {
    this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.state.width / this.optionsArray.length;

    var initialValue = converter.valueToPosition(value, this.optionsArray, this.state.width-30);
    if ((typeof this.props.step == 'number') && this.optionsArray.indexOf(value) == -1) { return };
    this.setState({
      pressedOne: true,
      valueOne: value,
      tickDesc: this.getTickDescription(value),
      pastOne: initialValue,
      positionOne: initialValue,
    });
  },
  getValue: function () {
    return {
      value: this.state.valueOne,
      originData: this.props.originData
    }
  },
  getTickDescription(value) {
    var i = this.optionsArray.indexOf(value);
    var result = value;
    if (i != -1 && this.optionsArray.length == this.props.stepDescription.length) {
      result = this.props.stepDescription[i] || value
    }
    return result;
  },
  startOne() {
    if(this.state.disabled){return;}
    this.props.onValueChangeStart();
    this.setState({
      onePressed: !this.state.onePressed
    });
  },


  moveOne(gestureState) {
    if(this.state.disabled){return;}
    var unconfined = gestureState.dx + this.state.pastOne;
    var bottom = 0;
    var top = this.state.width-30;
    var confined = unconfined < bottom ? bottom : (unconfined > top ? top : unconfined);
    //var value = converter.positionToValue(this.state.positionOne, this.optionsArray, this.state.width);
    if(gestureState.dx > 0){
      var value = this.state.valueOne + 1 > this.props.max ? this.props.max : this.state.valueOne + 1;
      var discrition = "right";
    }else if(gestureState.dx < 0){
      var value = this.state.valueOne  - 1 < 0 ? 0 :this.state.valueOne  - 1;
      var discrition = "left";
    }else{
      var value = this.state.valueOne;
    }
    var slipDisplacement = this.props.touchDimensions.slipDisplacement;
    var positionOne  = (this.state.width - 30) /   (this.props.max / value);
    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      //设置实际UI的滑动位置
      this.setState({
        positionOne: positionOne
      });
    }
    if (value !== this.state.valueOne) {
      this.setState({
        //valueOne: value,
        discrition:discrition,
        tickDesc: this.getTickDescription(value),
      }, function () {
        var change = [this.state.valueOne];

        this.props.onValueChange(change);
      });
    }
  },

  endOne(gestureState) {
    if(this.state.disabled){return;}

    if(this.state.valueOne == this.state.disabledValue){
      var value = this.state.valueOne;
    }

    var positionOne, typeNumber = 'number';
    if(this.state.discrition == 'left'){
      var value = this.state.valueOne  - 1 < 0 ? 0 :this.state.valueOne  - 1;
       if(this.state.disabledValue && value == this.state.disabledValue[this.state.disabledValue.length-1]){
         value = value + 1;
       }
    }else if(this.state.discrition == 'right'){
       var value = this.state.valueOne + 1 > this.props.max ? this.props.max : this.state.valueOne + 1;
       if(this.state.disabledValue && value == this.state.disabledValue[0]){
         value = value - 1;
       }
    }else{
      var value = this.state.valueOne;
    }
    if (typeof this.props.step == typeNumber && this.optionsArray.indexOf(this.props.step) != -1) {
      // 修正position定位
      //var step = this.optionsArray.indexOf(this.state.valueOne) ;

      positionOne = (this.state.width - 30)  / (this.props.max / value);
    };

    var state = {
      valueOne:value,
      pastOne: positionOne,
      onePressed: !this.state.onePressed,
    };

    if (typeof positionOne == typeNumber) {
      state.positionOne = positionOne
    };

    this.setState(state, function () {
      var change = this.state.valueOne;

      this.props.onValueChangeFinish(change);
    });

    this.state.disabledValue && this.setState({tickDesc: this.getTickDescription(value)});
  },
  componentDidMount: function () {
    var handle = React.findNodeHandle(this.refs.ct);
    var self = this;
    setTimeout(function () {
      UIManager.measure(handle, function (x, y, width, height, pageX, pageY) {
        var initialValue = converter.valueToPosition(self.props.value, self.optionsArray, width - 30);
        self.stepLength = width / self.optionsArray.length;
        self.setState({
          pressedOne: true,
          width: width,
          valueOne: self.props.value,
          tickDesc: self.getTickDescription(self.props.value),
          pastOne: initialValue,
          positionOne: initialValue,
        })
      })
    }, 0);


  },
  renderTitle(){
    if(this.props.uiTitle){
     return ( <View style={{marginLeft:20}}><Text style={styles.uiTitle}>{this.props.uiTitle}</Text></View> )
    }
  },
  render() {
    var {positionOne} = this.state;
    var {selectedStyle, unselectedStyle} = this.props;
    var trackOneLength = positionOne;
    var trackOneStyle = selectedStyle;

    var Marker = this.props.customMarker;
    var {slipDisplacement, height, width, borderRadius} = this.props.touchDimensions;
    var touchStyle = {
      height:height,
      width: width,
      left: - width / 2,
      borderRadius: borderRadius || 0,
      bottom: 35,
    };

    if (!this.state.width) {
      return <View ref='ct' style={styles.container}></View>
    };
    return (
      <View style={{backgroundColor:'#fff',paddingTop:15,paddingBottom:15}}>
      {this.renderTitle()}
      <View ref='ct' style={[styles.container, this.props.containerStyle, { width: this.state.width }]}>
        <View style={[styles.fullTrack]}>
          <View style={[this.props.trackStyle, styles.track, trackOneStyle, { width: trackOneLength }]} />
          <View style={styles.tickCt}>
            <View style={[{ width: trackOneLength || 0 }, styles.innerTrack,this.state.disabled && {backgroundColor:'#e4e4e4'}]}></View>
            <View style={styles.tickCtInner}>
              {this.renderTick() }
            </View>
          </View>
          <View
            style={[styles.touch, touchStyle]}
            ref={component => this._markerOne = component}
            {...this._panResponderOne.panHandlers}
            >
            <Marker
              pressed={this.state.onePressed}
              markerStyle={this.props.markerStyle}
              pressedMarkerStyle={this.props.pressedMarkerStyle}
              value={this.state.tickDesc}
              disabled={this.state.disabled}
              />
          </View>

        </View>
        {this.renderStepDescription() }

      </View>
      </View>
    );
  },
  renderStepDescription: function () {
    var results = this.props.stepDescription.map(function (text, index) {
      return <Text key={index} style={styles.stepDescriptionItem}>{text}</Text>
    });

    return (<View style={[styles.stepDescription]}>
      {results}
    </View>)
  },
  renderTick: function () {
    if (!this.props.showTick) { return };
    var len = this.optionsArray.length;
    var step = this.props.step;
    var results = [];
    if (typeof step == 'number') {
      for (var i = 0; i < this.optionsArray.length; i++) {
        results.push(<View key={i} style={[styles.tick,this.state.disabled && {backgroundColor:'#c6c5c5'}]}></View>)
      };
    };
    return results;
  }
});




var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 40,
    marginLeft: 15,
    marginRight: 20,
    paddingLeft:15,
    paddingRight:10,
    flex: 1,
    // paddingTop:40,
    backgroundColor: '#fff'
  },
  fullTrack: {
    flexDirection: 'row',
    flex: 1,
    height: 30,

    // backgroundColor:'red'
  },
  track: {
    justifyContent: 'center'
  },
  touch: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'transparent',

  },
  tickCt: {

    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    flex: 1,
    backgroundColor: '#e4e4e4',
    height: 4,
    borderRadius: 3,
  },
  tickCtInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',

  },
  innerTrack: {
    top: 0, left: 0, right: 0, bottom: 0,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#a7e4de',
    position: 'absolute'
  },
  tick: {
    height: 4, width: 4,
    borderRadius: 2.5,
    backgroundColor: '#00c7b2',
  },
  stepDescription: {
    // marginTop:30,
    // backgroundColor:'blue',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  stepDescriptionItem: {
    color: '#4a4a4a'
  },
  uiTitle:{
    color:'#333',
    fontSize:16
  }

});
module.exports = PipsSlider;