'use strict';

var React = require('react-native');


//var NavigatorNavigationBarStyles = require('NavigatorNavigationBarStylesIOS');
var Iconfont = require('../AKIconfont');
var NavOptMixin = require('./NavOptMixin')
var loadingIcon = 'loadingIcon';
var {
  StyleSheet,
  View,
  StatusBarIOS,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicatorIOS,

  Platform
} = React;
//var window = Dimensions.get('window');


var NavbarWrapper = React.createClass({
  statics:{
    loadingIcon:loadingIcon
  },
  mixins: [NavOptMixin],
  getInitialState() {
    return {
      barStyle:{},
      btnBgStyle:{},
      iconBtnTransitionColorStyle:'rgb(255,255,255)',
      titleColor:{color:'#fff'},
      buttons:[],
      currentAlpha:null
    };
  },
  getDefaultProps:function  () {
    return {
      buttons:[]
    }
  },
  componentWillMount:function  () {
    this.setState({
      buttons:this.props.buttons,
      title:this.props.title
    })
  },
  onBtnPress:function  (name) {
    this.props.onNavBtnPress(this,name)
  },

  setBarAlpha:function  (alpha) {
    var btnIconColor = this.calculateBtnIconColor(alpha);
    var titleColor = this.calculateTitleColor(alpha)
    this.setState({
      currentAlpha:alpha,
      barStyle:{
        backgroundColor:formatStr.call(barBgColorFormat,alpha),
      borderBottomColor:formatStr.call(barBorderBottomColorFormat,alpha),
      },
      btnBgStyle:{
        backgroundColor:formatStr.call(btnBgCologFormat,this.calculateBtnBgColor(alpha))
      },
      iconBtnTransitionColorStyle:formatStr.call('rgb({0},{1},{2})',btnIconColor.r,btnIconColor.g,btnIconColor.b),
      titleColor:{color:formatStr.call('rgb({0},{1},{2})',titleColor.r,titleColor.g,titleColor.b)}
    });
  },
  calculateBtnBgColor:function  (alpha) {
    return (.5-alpha < 0) ? 0 :.5-alpha
  },
  calculateBtnIconColor:function  (alpha) {
    var r = 0 ,g =199, b = 178,total = 255;
    return {
      r:total-((total-r)*alpha),
      g:total-((total-g)*alpha),
      b:total-((total-b)*alpha)
    }
  },
  calculateTitleColor:function  (alpha) {
    var r = 0 ,g =0, b = 0,total = 255;
    return {
      r:total-((total-r)*alpha),
      g:total-((total-g)*alpha),
      b:total-((total-b)*alpha)
    }
  },
  render() {

   var self = this;  
   // Status bar color
    if (StatusBarIOS) {
      if (this.props.statusBarColor === "black") {
        StatusBarIOS.setStyle(0);
      } else {
        StatusBarIOS.setStyle(1);
      }
    };
   return (<View style={[styles.container,this.props.style,this.state.barStyle]}>
      <View style={[styles.backBtn]}>
        <TouchableOpacity  onPress={function(){self.onBtnPress('back')}}>
          <View style={[styles.backBtnInner,this.state.btnBgStyle]}>
            <Iconfont style={[styles.iconfont,styles.backBtnIcon]} iconfontConfig={{color:this.state.iconBtnTransitionColorStyle,bgColor:'transparent',fontSize:20,iconCode:'&#x3054'}} />
          </View>
          
        </TouchableOpacity>
      </View>
      {this.renderTitle()}
      <View style={[styles.navBtnCt]}>
        {this.state.buttons.map(function(item,index){
            return (
              <TouchableOpacity   key={index} onPress={function(){self.onBtnPress(item.name)}}>
                {self.createRightBtns(item,index)}
              </TouchableOpacity>
              
              )     
        })}
      </View>
    </View>)
  },
  renderTitle:function  () {
    if (this.state.title && this.state.title.trim()) {
      var opacity = this.props.transitionalTitle === true ? 0 : 1;
      if (this.props.transitionalTitle && this.state.currentAlpha != null) {
        opacity = this.state.currentAlpha >= .9 ? 1 : 0;
      };

      return <View style={[styles.title,{opacity:opacity},this.state.btnBgStyle]}>
          <Text style={[styles.titleText,this.state.titleColor]} numberOfLines={1}>{this.state.title}</Text>
        </View>
    }
  },
  createRightBtns:function  (item) {
    var self = this;
    if (item.text) {
      return this.creatTextRightBtn(item)
    }else if(item.iconfont){
      if (item.iconfont == NavbarWrapper.loadingIcon) {
        return this.createLoadingView()
      };
      return (<View style={[styles.rightBtnInner,self.state.btnBgStyle]}>
              <Iconfont style={[styles.iconfont,styles.rightBtn]} iconfontConfig={{color:this.state.iconBtnTransitionColorStyle,bgColor:'transparent',fontSize:20,iconCode:item.iconfont}} /> 
            </View>)
       
    }
    
  },
  creatTextRightBtn:function  (item) {
    return (<View style={[styles.rightBtnInner,this.state.btnBgStyle]}>
            <Text style={[styles.navBtn,styles.rightBtn]}>{item.text}</Text>
          </View>)
  },
  createLoadingView:function  () {
    return (<View style={[styles.rightBtnInner,{backgroundColor:'transparent'}]}>
        <ActivityIndicatorIOS 
          animating={true}
          style={{height: 40}}
          size="small" />
      </View>)
  },
  setButtons:function(arr){
    this.setState({
      buttons:arr
    })
  }
});
function formatStr() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
var barBgColorFormat = 'rgba(252,252,252,{0})'
var barBorderBottomColorFormat = 'rgba(234,234,234,{0})'
var btnBgCologFormat = 'rgba(0,0,0,{0})'
var styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    height:66,
    width: window.width,
    paddingTop:20,
    top:0,
    left:0,
    right:0,
    position:'absolute',
    backgroundColor:formatStr.call(barBgColorFormat,'0'),
    borderBottomColor:formatStr.call(barBorderBottomColorFormat,'0'),
    borderBottomWidth:.5,
  },
  backBtn:{
    alignItems:'flex-start',
    justifyContent:'center',
    flex:1,
  },
  backBtnIcon:{
    position:'relative',
    left:-1,
    top:-1,
  },
  backBtnInner:{

    marginLeft:10,
    flexDirection:'row',
    justifyContent:'center',
    width:30,
    height:30,
    borderRadius:15,
    alignItems:'center',
    backgroundColor:formatStr.call(btnBgCologFormat,.5),
  },
  navBtn:{
    color:'#00c7b2',
    lineHeight:17,
  },
  title:{
    flex:1.5, 
    justifyContent:'center',
    marginTop:10,
    paddingTop:5,
    paddingBottom:5,
    paddingRight:6,
    paddingLeft:6,
    backgroundColor:formatStr.call(btnBgCologFormat,.5),
    borderRadius:15,
    height:30,
  },
  titleText:{
    fontSize:18,
    color:'#fff',
    textAlign:'center'
  },
  iconfont:{
    width:23,height:23,
  },
  navBtnCt:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  rightBtnInner:{
    marginRight:10,
    backgroundColor:formatStr.call(btnBgCologFormat,.5),
    width:30,
    height:30,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15,
  }
});
module.exports = NavbarWrapper
