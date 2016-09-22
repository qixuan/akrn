'use strict';

var React = require('react-native');
var {
  PropTypes,
  View,
  Text,
} = React;

var BasicMarker = React.createClass({

  propTypes: {
    pressed: PropTypes.bool,
    pressedMarkerStyle: PropTypes.object,
    markerStyle: PropTypes.object,
    value:PropTypes.string
  },
  getDefaultProps: function() {
    return {
      value:''
    };
  },
  getInitialState: function() {
    return {
      value:'',
      disabled:this.props.disabled 
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      value: nextProps.value,
      disabled:nextProps.disabled
    });
  },
  render: function () {
    return (
      <View style={this.props.markerStyle}>
          <View style={mockProps.markerTipTextStyle}>  
            <Text style={[{ color:'#00c7b2',fontSize:11},this.state.disabled && {color:'#c6c5c5'}]}>
            {this.state.value||this.props.value}
            </Text>
          </View>
          <View style={[mockProps.markerTipStyle, this.props.pressed && this.props.pressedMarkerStyle,this.state.disabled && {backgroundColor:'#c6c5c5',borderWidth:3,borderColor:'#fff'}]}></View>
      </View>
    );
  }
});

var mockProps = {
  value: 0,
  onValueChangeStart: function () {
    console.log('press started');
  },
  onValueChange: function (values) {
    // console.log('changing', values);
  },
  onValueChangeFinish: function (values) {
    console.log('changed', values);
  },
  showTick:false,
  step: 1,
  min:0,
  max:10,
  selectedStyle: {
    backgroundColor: '#00c7b2'
  },
  unselectedStyle: {
    backgroundColor: 'rgba(0,199,178,1)'
  },
  trackStyle: {
    height:6,
    borderRadius: 3.5,
  },
  touchDimensions: {
    height: 55,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 30,
  },
  markerStyle: {
    width: 50,
    alignItems: 'center',
  },

  customMarker: BasicMarker,
  pressedMarkerStyle: {
    backgroundColor:'#009383',
  },
  markerTipStyle:{
    height:30,
    width: 30,
    borderRadius: 15,
    backgroundColor:'#00c7b2',
    position:"absolute",
    top:25,
    left: 10,
  },
  markerTipTextStyle:{
    justifyContent: 'center',
    alignItems: 'center',
    
  }
};

module.exports = mockProps;
