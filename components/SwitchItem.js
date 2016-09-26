
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Switch,
  Dimensions,
  TouchableWithoutFeedback
} = React;
var windowSize = Dimensions.get('window');

var Iconfont = require('./AKIconfont');
var SwitchItem = React.createClass({
	propTypes: {
		changed   :React.PropTypes.func,
		value : React.PropTypes.bool,
		disabled : React.PropTypes.bool,
		leftIcon :React.PropTypes.object,
		text : React.PropTypes.shape({
		  title : React.PropTypes.string,
		  subtitle : React.PropTypes.string
		}),
	},
	getDefaultProps: function() {
		return {
			text:{
				title:null,
				subtitle:null,
			},
			value:false,
			disabled:false
		};
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({
			value:nextProps.value
		})
	},
	getInitialState:function(){
		return {
			value:this.props.value
		}
	},
	click_switch:function(value){
		this.setState({
        	value: !this.state.value,
      	});

	    this.props.changed && this.props.changed(value);
	},
	createTitle:function(){
		if(this.props.text.subtitle){
			return (	
					<View>
		            	<Text style={{fontSize:16}}>{this.props.text.title}</Text>
		           		<Text style={{fontSize:12,color:'#999',lineHeight:18}}>{this.props.text.subtitle}</Text>
				    </View>
				)
		}
		else{
			return (
		        <Text style={{fontSize:16}}>{this.props.text.title}</Text>
			)
		}
	},
	render:function(){
		return (	
			<TouchableWithoutFeedback onPress={this.click_switch}>
				<View style={styles.container} >
			        <View style={styles.leftItem}>
			          {this.props.leftIcon && <Iconfont  style={styles.icon} iconfontConfig={this.props.leftIcon} /> }
			          {this.createTitle()}
			        </View>
			        <Switch onValueChange={this.click_switch} value={this.state.value} disabled={this.props.disabled} onTintColor="#00c7b2"/>
		        </View>
		    </TouchableWithoutFeedback> 
		)
	}
});


var styles = StyleSheet.create({
	container:{
	  width:windowSize.width,
      backgroundColor:'#fff',
      borderColor:'#eaeaea',
      borderWidth:.5,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingLeft:20,
      paddingRight:20,
      paddingTop:12,
      paddingBottom:12,
	},
    icon:{
      width: 24, 
      height: 24,
      marginTop:2,
      marginLeft:3,
      marginRight:5,
      lineHeight:80,
    },
    leftItem:{
      flexDirection:'row',
      alignItems:'center'
    }
})
module.exports = SwitchItem;