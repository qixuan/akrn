import React, {
    Component,
    PropTypes,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    TouchableHighlight,
    Dimensions,
    LayoutAnimation
} from 'react-native';
const RootModal = require('./rootModal/RootModal')

const windowSize = Dimensions.get('window');

var ActionSheet = React.createClass({
    renderRow(data,index){
        const {cancelButtonIndex}  = this.props
        return(
            <ActionSheetCell
            data = {data}
            key = {index}
            index = {index}
            cancelButtonIndex = {cancelButtonIndex}
            onActionSheetPress = {this.onPress}
            />
        )
    },
    getInitialState(){
        return{
            actionSheetVisible:this.props.actionSheetVisible || false
        }
    },
    
    onPress(index){
        this.props.onPress(index,this.props.config);
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            actionSheetVisible:nextProps.actionSheetVisible
        })
    },
    render() {
        const self = this;
        const {title, options} = this.props;
        LayoutAnimation.easeInEaseOut()
        return (
            <RootModal onPressModal={this.props.onPressModal} style={styles.rootModal} visible={this.state.actionSheetVisible} >
            <View style = {styles.actionSheetContainer}>
                <View style = {styles.itemView}>
                    <Text style ={{ fontSize: 16, color: '#999' }}>
                        {title}
                    </Text>
                </View>
                {
                    this.props.options.map(function (data, index) {
                        return self.renderRow(data, index)
                    })
                }
            </View>
            </RootModal>
        );
    }

})


var ActionSheetCell = React.createClass({
    render(){
        const {data,index,cancelButtonIndex} = this.props;
        if(index == cancelButtonIndex){
            return(
            <TouchableHighlight
            underlayColor = {'#ccc'}
            onPress = {(event) => this.props.onActionSheetPress(index)}>
            <View style = {styles.cancelButton}>
                <View style = {styles.itemView}>
                    <Text style ={{ fontSize: 16, color: '#999' }}>
                        {data}
                    </Text>
                </View>
            </View>
            </TouchableHighlight>
            )
        }
        return(
        <TouchableHighlight
        underlayColor = {'#ccc'}  
        onPress = {(event) => this.props.onActionSheetPress(index)}>
            <View style = {styles.itemView}>
                <Text style ={{ fontSize: 16, color: '#999' }}>
                    {data}
                </Text>
            </View>
        </TouchableHighlight>
        )
    }
})

const styles = StyleSheet.create({
    itemView: {
        height: 48,
        width: windowSize.width - 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eaeaea'
    },
    actionSheetContainer: {
        // flex : 1  ,
        width: windowSize.width - 16,
        alignItems: 'center',
        // height: 300,
        backgroundColor: 'rgba(255,255,255,0.95)',
        position: 'absolute',
        bottom: 0,
        left: 8,
        right: 0,
        borderRadius: 5
    },
    cancelButton : {
        // paddingTop : 8,
        // paddingBottom : 8
    },
    rootModal:{
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});

module.exports =  ActionSheet;