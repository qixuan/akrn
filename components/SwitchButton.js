
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform
} = React;
var isIOS = Platform.OS == 'ios';
var Iconfont = require('./AKIconfont');
var windowSize = Dimensions.get('window');

var SwitchButton =  React.createClass({
	propTypes: {
		clickLeftButton : React.PropTypes.func,
		changed         : React.PropTypes.func,
		leftButton      : React.PropTypes.shape({
				  onText   : React.PropTypes.string,
				  offText  : React.PropTypes.string
		})
	},
	getInitialState:function(){
		return{
			switchText     : this.props.switchText || '关闭',
			value          : this.props.value,
			leftButtonText : this.props.leftButton && this.props.leftButton.offText
		}
	},
	getDefaultProps:function(){
		return {
			value : true,
		}
	},
	componentWillReceiveProps(nextProps){
		this.setState({
			value:nextProps.value
		})
	},
	clickSwitchButton:function(){
		var value = !this.state.value;
		if(this.state.value){
			var switchText = '开启';
			var leftButtonText = this.props.leftButton && this.props.leftButton.offText;
		}
		else{
			var switchText = '关闭';
			var leftButtonText = this.props.leftButton && this.props.leftButton.onText;
		}
		this.setState({
			switchText     : switchText,
			value          : value,
			leftButtonText : leftButtonText			
		});
		if(this.props.changed){
			this.props.changed(this.state.value);
		}
	},
	createleftButton:function(){
		if(this.props.leftButton){
			return (
					<TouchableOpacity onPress={this.props.clickLeftButton && this.props.clickLeftButton} style={[styles.leftButton,{width:windowSize.width*0.3},this.state.value && styles.activeLeftBtn]}>
	           			<Text style={[styles.text,{color:'#ff8650'},this.state.value && styles.activeleftText]}>{this.state.leftButtonText}</Text>
	        		</TouchableOpacity>
			)
		}
	},
	render:function(){
		return (
			<View style={[styles.container,!this.state.value && styles.activeOverlay,this.state.value && styles.overlay]}>
			<View style={styles.content}>
				<View style={{marginBottom:30}}>
					<Iconfont style={{width:52,height:52}} iconfontConfig={{color: "#00c7b2", bgColor: 'transparent', fontSize: 52, iconCode: '&#xe620;' }}/> 
				</View>	
				<Text style={styles.centerText}>当前设备在关闭状态</Text><Text style={styles.centerText}>请先开启，才能操作</Text></View>
				<View style={styles.buttonSection}>
					{ this.createleftButton() }
					<TouchableOpacity onPress={this.clickSwitchButton} style={[styles.button,{flex:1},this.props.leftButton && styles.halfWitdh,this.state.value && styles.activeRtBtn]}>
						<Iconfont  style={styles.icon} iconfontConfig={{color: "#fff", bgColor: 'transparent', fontSize: 16, iconCode: '&#xe629;' }}/>
	           			<Text style={styles.text}>{this.state.switchText}</Text>
	        		</TouchableOpacity>
	    		</View>
    		</View>
		)
	}
});

var styles = StyleSheet.create({
	container:{
		position:'absolute',
		bottom: 0,
		left:0,
		width: windowSize.width,
	},
	content:{
		height:windowSize.height-60,
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center'
	},
	centerText:{
		fontSize:16,
		color:'#00c7b2',
		lineHeight:24
	},
	activeOverlay:{
		backgroundColor:'rgba(255,255,255,.8)',
		height: windowSize.height
	},
	overlay:{
		height:Platform.OS == 'ios'?60:80,
	},
	buttonSection:{
		flexDirection:'row',
		flex:1,
		justifyContent:'space-between',
		alignItems:'center',
		width:windowSize.width,
		padding:10,
		backgroundColor:'#fff',
		position:'absolute',
		bottom:0,
		left:0
	},
	button:{
		flexDirection:'row',
		height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        backgroundColor:'#ff8650'
	},
	leftButton:{
		height:40,
        borderRadius:5,
        justifyContent:'center',
		backgroundColor:'#fff0ea',        
	},
    icon:{
      width: 20, 
      height: 16,
    },
    text:{
    	color:'#fff',
    	fontSize:16,
    	textAlign:'center'
    },
    activeLeftBtn:{
    	backgroundColor:'#dbf9f6',
    },
    leftButtonText:{
    	color:'#ff8650'
    },
    activeRtBtn:{
    	backgroundColor:'#00c7b2'
    },
    activeleftText:{
    	color:'#00c7b2'
    },
    halfWitdh:{
    	flex:0,
    	width:windowSize.width*0.6,
    }

})

module.exports = SwitchButton;