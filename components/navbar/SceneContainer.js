'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  NavigatorIOS,
  View,
} = React;
var Navbar = require('./AKNavbar');
var NavbarWrapper = Navbar.NavbarWrapper;
var NarbarTransitional = Navbar.NarbarTransitional;
var sdk = require('../../lib/SDK');
var DA = require('../../lib/DA');
var Modal = require('../Modal');
var Toast = require('../Toast');
var NavTip = require('../NavTip');
var Alert = require('../Alert');
var Container = React.createClass({
	getInitialState: function() {
		return {
			modalProps:{hide:true},
			renderNum: 0
		};
	},
	onNavBtnPress:function  (nav,btnName) {
	    if (nav.props._navKey) {
	      var index = nav.props._navKey.replace('_nav','');
	      if (this._itemRefs['_content'+index] && this._itemRefs['_content'+index].onNavBtnPress) {
	        this._itemRefs['_content'+index].onNavBtnPress(nav,btnName,this);
	      };
	    };
	},
	_getNavbarView:function  (component) {
	    if (this._itemRefs[component.props._contentKey]) {
	      var key = component.props._contentKey.replace('_content','');
	      var nav =  this._itemRefs['_nav'+key];
	      if (nav) {
	        return nav;
	      }
	    };
	    return null;
	},
	render:function  () {
		this.renderNum++;
		return this.renderScene()
	},
	shouldComponentUpdate: function(nextProps, nextState){//如果没有接受新数据就不重绘
		return !(this.renderNum > 1);
	},
	componentWillMount:function  () {
	    this._itemRefs = {};
	  },
	componentDidMount: function() {
	    DA.registeSceneContainer(this)
	},
	
	componentWillUnmount: function() {
		DA.unRegisteSceneContainer(this)
	},
	didFocus:function  (args) {
		var c = this._itemRefs['_content1'];
		c.didFocus && c.didFocus(args)
	},
	getContent:function(){
		return this._itemRefs['_content1'];
	},
	renderScene: function() {
	    var self = this;
	    var Content = this.state.component || this.props.component;
	    var navbarPassProps;
	    var Nav ;
	    var Navbar = NavbarWrapper;
	    var passProps= this.state.passProps ? this.state.passProps : this.props.passProps ;
	    passProps = passProps || {}
	    //var router = this.props.router();
	    var index = 1;
	    if (Content.navbarPassProps) {
	      navbarPassProps = Content.navbarPassProps;
	      if (navbarPassProps.barType == 'transitional') {
	        Navbar = NarbarTransitional;
	      };
	      
	    }
	    if (navbarPassProps) {
	      passProps.getNavbarView = this._getNavbarView;
	      navbarPassProps._navKey = '_nav'+index;
	      navbarPassProps.onNavBtnPress = this.onNavBtnPress;
	      Nav = <Navbar  {...navbarPassProps} {...passProps.navbarPassProps} ref={function(nav){
	        if (!nav || !nav.props._navKey) {return};
	        self._itemRefs[nav.props._navKey] =  nav;
	      }}/>
	    };
	    
	    return (
	      <View style={[styles.container]}>
	        <Content
	           {...passProps}
	          ref={function(component){
	            if (!component || !component.props._contentKey) {return};
	            self._itemRefs[component.props._contentKey] =  component;
	          }}
	          _contentKey={'_content'+index}
	          route={{...this.props.routerMethods}}
	          
	         />
	          {Nav}
	          <NavTip ref='navTip' isVisible={false}  />
	          <Toast ref="toast" isVisible={false} content=''></Toast>
						<Alert ref='alert' isVisible={false} content=''/>
	          <Modal ref={'modal'} {...this.state.modalProps} />
	      </View>
	    )

  }
});
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
module.exports = Container;