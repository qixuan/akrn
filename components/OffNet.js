import React, {
    PropTypes,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native';
const RootModal = require('./rootModal/RootModal')
const Iconfont  = require('./AKIconfont')

var ActionSheet = React.createClass({
    getInitialState(){
        return{
            moadlVisible:this.props.visible
        }
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            moadlVisible:nextProps.visible
        })
    },
    renderRow(text,index){
        return(
            <TouchableHighlight underlayColor={'rgba(255,255,255,.3)'} style={{marginTop:10}} onPress={(event) => this.props.onPressButton && this.props.onPressButton(index)}>
                <View style={styles.button}>
                    <Text style={{color:'#00c7b2'}}>{text}</Text>
                </View>
            </TouchableHighlight>
        )
    },
    onPressCircle(){
        this.setState({moadlVisible:false})
        this.props.onPress && this.props.onPress()
    },
    render() {
        var self = this;
        return (
            <RootModal style={styles.rootModal} visible={this.state.moadlVisible} >
            <View style = {styles.topSection}>
                <TouchableWithoutFeedback underlayColor={'rgba(255,255,255,.3)'} activeOpacity={1} onPress={this.onPressCircle}>
                    <View>
                   <View style={styles.iconCircle}><Iconfont style={styles.iconfont} iconfontConfig={{ color: '#00c7b2', bgColor: 'transparent', fontSize: 42, iconCode: '&#xe6a8;' }} /></View>
                        <Text style={{fontSize:14}}>刷新试试</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style = {styles.bottomSection}>
                <View>
                    <Text style={{fontSize:21,color:'#00c7b2'}}>该设备已断开连接！</Text>
                    <View style={{marginTop:10,marginBottom:10}}><Text style={{fontSize:16}}>请将设备连上您的网络，可尝试以下操作</Text></View>
                    <View style={styles.listView}><Text style={styles.listText}>1.点击刷新按钮</Text></View>
                    <View style={styles.listView}><Text style={styles.listText}>2.检查家里的路由器是否成功联网，或尝试重启路由器</Text></View>
                    <View style={styles.listView}><Text style={styles.listText}>3.检查智能设备的电源插头是否插好</Text></View>
                </View>
                <View>
                  {
                     self.props.button && self.props.button.map(function (text, index) {
                        return self.renderRow(text, index)
                    })
                  }
                </View>
            </View>
            </RootModal>
        );
    }

})

var styles = StyleSheet.create({
    rootModal:{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,.9)'
    },
    topSection:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    bottomSection:{
        flex:1,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,
        justifyContent:'space-between'        
    },
    iconfont:{
        width: 45, 
        height: 45, 
    },
    iconCircle:{
        width:60,
        height:60,
        borderWidth:1,
        borderRadius:60,
        borderColor:'#00c7b2',
        justifyContent:'center',
        alignItems: 'center',
        margin:10
    },
    listText:{
        color:'#666',
        fontSize:14
    },
    listView:{
        marginBottom:5
    },
    button:{
        justifyContent:'center',
        alignItems:'center',
        borderColor:'#00c7b2',
        borderWidth:1,
        borderRadius:3,
        height:40
    }
})



module.exports =  ActionSheet;