'use strict';

var React = require('react-native');
var {
  View,
  Text,
  PropTypes,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback
} = React;

var OnClickIcon = "&#x3071;";
var UnOnClickIcon = "&#x3081;";
var Iconfont = require('./AKIconfont.js');
var windowSize = Dimensions.get('window');

var List = React.createClass({
  propTypes: {
    onItemClick: React.PropTypes.func,
    onClickBefore: React.PropTypes.func,
    dataModel: React.PropTypes.shape({
      "value": React.PropTypes.array.isRequired,
      "disabled": React.PropTypes.array,
      "uiTitle": React.PropTypes.string,
      "isMultiple": React.PropTypes.bool,
      "type": React.PropTypes.string,
      "keyValue": React.PropTypes.string,
      "map": React.PropTypes.array
    })
  },
  getDefaultProps() {
    return {
      onItemClick: (e) => { console.log("onItemClick", e) },
      onClickBefore: (e) => { console.log("onClickBefore", e) },
      dataModel: {}
    }
  },
  getInitialState() {
    var {value, disabled, keyValue} = this.props.dataModel
    return {
      totalValue: value || [],
      disabled: disabled || [],
    };
  },
  componentWillReceiveProps(nextProps) {

    var {value, disabled} = nextProps.dataModel
    this.setState({
      totalValue: value || [],
      disabled: disabled || [],
    })
  },
  _renderRow(rowData, rowID) {
    var self = this;
    var leftIconFn, rightIconFn;
    var disabledStyle = null;
    var {isMultiple, type, keyValue} = this.props.dataModel;
    //判断disble
    var isDisabled = this.state.disabled.indexOf(rowData.value) > -1;
    switch (type) {
      case "ItemList":
        leftIconFn = function () {
          if (!!!rowData.leftIcon || rowData.leftIcon.length === 0) {
            return <View style = {styles.listContainerNoLeftIcon}/>
          } else {
            return (
              <View style = {[styles.listContainerLeftIcon, disabledStyle]}>
                <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: rowData.leftIcon }} />
              </View>
            )
          }
        }
        rightIconFn = function () {
          if (!!!rowData.leftIcon || rowData.leftIcon.length === 0) {
            return (
              <View style = {{ width: 30 }}>
                <Iconfont style={{ width: 16, height: 16, alignItems: 'center' }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#b2b2b2', bgColor: 'transparent', fontSize: 16, iconCode: rowData.rightIcon }} />
              </View>
            )

          } else {
            return (
              <View style = {{ width: 60 }}>
                <Iconfont style={{ width: 16, height: 16, alignItems: 'center' }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#b2b2b2', bgColor: 'transparent', fontSize: 16, iconCode: rowData.rightIcon }} />
              </View>
            )
          }
        }
        break;
      case "leftCheck":
        leftIconFn = function () {
          if (typeof isMultiple !== "undefined") {
            if (self.state.totalValue.indexOf(rowData.value) > -1) {
              return (
                <View style = {[styles.listContainerLeftIcon, disabledStyle]}>
                  <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: OnClickIcon }} />
                </View>
              )
            } else {
              return (
                <View style = {[styles.listContainerLeftIcon, disabledStyle]}>
                  <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: UnOnClickIcon }} />
                </View>
              )
            }
          }
        }
        rightIconFn = function () {
          if (!!!rowData.leftIcon || rowData.leftIcon.length === 0) {
            return (
              <View style = {{ width: 30 }}>
                <Iconfont style={{ width: 16, height: 16, alignItems: 'center' }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#b2b2b2', bgColor: 'transparent', fontSize: 16, iconCode: rowData.rightIcon }} />
              </View>
            )

          } else {
            return (
              <View style = {{ width: 60 }}>
                <Iconfont style={{ width: 16, height: 16, alignItems: 'center' }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#b2b2b2', bgColor: 'transparent', fontSize: 16, iconCode: rowData.rightIcon }} />
              </View>
            )
          }
        }
        break;
      case "rightCheck":
        leftIconFn = function () {
          if (!!!rowData.leftIcon || rowData.leftIcon.length === 0) {
            return <View style = {styles.listContainerNoLeftIcon}/>
          } else {
            return (
              <View style = {[styles.listContainerLeftIcon, disabledStyle]}>
                <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: rowData.leftIcon }} />
              </View>
            )
          }
        }
        rightIconFn = function () {
          if (typeof isMultiple !== "undefined") {
            if (rowData.leftIcon) {
              if (self.state.totalValue.indexOf(rowData.value) > -1) {
                return (
                  <View style = {{ width: 70 }}>
                    <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: OnClickIcon }} />
                  </View>
                )
              } else {
                return (
                  <View style = {{ width: 70 }}>
                    <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: UnOnClickIcon }} />
                  </View>
                )
              }
            }else{
              if (self.state.totalValue.indexOf(rowData.value) > -1) {
                return (
                  <View style = {{ width: 38 }}>
                    <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: OnClickIcon }} />
                  </View>
                )
              } else {
                return (
                  <View style = {{ width: 38 }}>
                    <Iconfont style={{ width: 26, height: 26 }} iconfontConfig={{ color: isDisabled ? '#ccc' : '#00c7b2', bgColor: 'transparent', fontSize: 26, iconCode: UnOnClickIcon }} />
                  </View>
                )
              }
            }


          }
        }
        break;
    }

    //目前单选多选勾选框在左边，日后需要在右边写下样式即可
    return (

      <TouchableWithoutFeedback key = {rowID} onPress={(event) => {
        self._onPress(event, rowData.value, rowID, keyValue);
      } }>
        <View style = {[styles.listContainer]}>
          <View style = {[styles.listContainerOuter]}>
            {
              leftIconFn()
            }
            <View style = {[styles.listContainerInner, rowID == 0 ? null : styles.borderTopColor]}>
              <View style = {[disabledStyle,{flex : 1,justifyContent : 'center'}]}>
                <Text style = {[styles.listContainerInnerName, { color: isDisabled ? "#ccc" : '#000' }]}>{rowData.name}</Text>
                {rowData.subtitle && <Text style = {{ fontSize: 12,lineHeight : 16, color: isDisabled ? "#ccc" : '#999' }}>{rowData.subtitle}</Text>}
              </View>

              <View style = {styles.listContainerInnerTitle}>
                    <View style = {{marginRight : 5}}>
                        <Text style = {[{ fontSize: 15, color: isDisabled ? "#ccc" : '#999' }, disabledStyle]}>{rowData.after}</Text>
                    </View>
                    {rightIconFn() }
              </View>
            </View>
          </View>

        </View>
      </TouchableWithoutFeedback>
    );
  },
  render() {
    var self = this;
    var {uiTitle, map} = this.props.dataModel

    var uiTitleFn = function () {
      if (uiTitle) {
        return (
          <View style = {styles.uiTitle}>
            <Text>{uiTitle}</Text>
          </View>
        )
      } else {
        return null
      }
    }
    if (map == null || map.length == 0) {
      return null
    } else {
      return (
        <View style = {this.props.style}>
          <View style = {{
            flex: 1,
            borderBottomWidth: 1,
            borderColor: "#eaeaea",
            borderTopWidth: 1,
            borderTopColor: '#eaeaea',
          }}>
            {
              uiTitleFn()
            }
            {
              map.map(function (rowData, rowID) {
                return self._renderRow(rowData, rowID)
              })
            }
          </View>
        </View>
      );
    }

  },
  _onPress: function (event, rowDataValue, rowID, keyValue) {

    var isMultiple = this.props.dataModel.isMultiple;
    var {totalValue, disabled} = this.state;
    var index = totalValue.indexOf(rowDataValue);
    var disabledIndex = disabled.indexOf(rowDataValue);
    var isSelected = true;
    
    if (disabledIndex > -1) {
      return false;
    }
    //多选
    if (isMultiple) {
      if (index > -1) {
        totalValue.splice(index, 1)
        isSelected = false
      } else {
        isSelected = true;
        totalValue.push(rowDataValue)
      }
    } else {
      //单选
      if (index > -1) {
        totalValue.splice(index, 1)
        isSelected = false
      } else {
        isSelected = true;
        totalValue[0] = rowDataValue
      }
    }
    if (this.props.onClickBefore({ rowDataValue, keyValue, rowID, isSelected }) === false) {
      return;
    }
    this.setState({ totalValue });
    
    if (this.props.onItemClick) {
      
      this.props.onItemClick({ rowDataValue, keyValue, rowID, isSelected });
    }
    event.stopPropagation();
  },
});


var styles = StyleSheet.create({
  uiTitle: {
    height: 24, backgroundColor: '#eee', paddingLeft: 20,
    justifyContent: 'center'
  },
  listContainer: {
    // height: 48,
    justifyContent: 'center',
  },
  listContainerNoLeftIcon: {
    height: 48,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainerLeftIcon: {
    height: 48,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainerOuter: {
    alignItems: 'center',
    backgroundColor: "#fff",
    flexDirection: "row",
    // paddingLeft : 15,
    // paddingRight : 15,
    justifyContent: "space-between"
  },
  listContainerInner: {
    // height: 48,
    paddingTop : 10,
    paddingBottom : 10,
    width: windowSize.width,
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: "row",
  },
  borderTopColor: {
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  listContainerInnerName: {
    fontSize: 17,
  },
  listContainerInnerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  }
})

module.exports = List;
