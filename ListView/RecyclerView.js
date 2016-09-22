'use strict';

var React = require('react-native');
var {
    AppRegistry,
    requireNativeComponent,
    ToastAndroid,
    Dimensions,
    View,
    Text,
    StyleSheet,
    Alert
} = React;
var Dimensions = React.Dimensions;
var window = Dimensions.get('window');
const RecyclerView = require('./RecyclerView_Android');
const ActionSheet = require('../components/ActionSheet')
const SwipeRefresh = requireNativeComponent('SwipeRefresh');
const SwipeRefreshRef = "SwipeRefresh_Tag";
var AKCollectionViewAndroid = React.createClass({
    propTypes: {
        /**
         * (rowData, sectionID, rowID, highlightRow) => renderable
         *
         * Takes a data entry from the data source and its ids and should return
         * a renderable component to be rendered as the row.  By default the data
         * is exactly what was put into the data source, but it's also possible to
         * provide custom extractors. ListView can be notified when a row is
         * being highlighted by calling highlightRow function. The separators above and
         * below will be hidden when a row is highlighted. The highlighted state of
         * a row can be reset by calling highlightRow(null).
         */
        dataSource: React.PropTypes.array.isRequired,
        renderRow: React.PropTypes.func.isRequired,
        rowGuid: React.PropTypes.func,
        // onClick: React.PropTypes.func,
        // autoFocus: React.PropTypes.bool,
        spanCount:React.PropTypes.number.isRequired,
        loaded:React.PropTypes.bool.isRequired,
        layout:React.PropTypes.shape({
                type: React.PropTypes.string.isRequired,
                cellHeight: React.PropTypes.number,
                cellWidth: React.PropTypes.number,
                minLineSpacing: React.PropTypes.number,
                minItemSpacing: React.PropTypes.number,
                sectionInset: React.PropTypes.shape({
                    top: React.PropTypes.number,
                    left: React.PropTypes.number,
                    right: React.PropTypes.number,
                    bottom: React.PropTypes.number
                })
        }),
        /**
         * The amount by which the content is inset from the edges
         * of the ARCTCollectionView. Defaults to `{0, 0, 0, 0}`.
         * @platform ios
         */
        contentInset: React.EdgeInsetsPropType,
        /**
         * Used to manually set the starting scroll offset.
         * The default value is `{x: 0, y: 0}`.
         * @platform ios
         */
        contentOffset: React.PointPropType,
        /**
         * The amount by which the scroll view indicators are inset from the
         * edges of the ARCTCollectionView. This should normally be set to the same
         * value as the `contentInset`. Defaults to `contentInset` or
         * `{0, 0, 0, 0}`.
         * @platform ios
         */
        scrollIndicatorInsets: React.EdgeInsetsPropType,
    },
    getDefaultProps: function(){
        return {
            renderLoadingView : function(){
              return null;
            },
            rowGuid: function(rowDatam, sectionIdx, rowIdx){
                return 'r_' + sectionIdx + '_' + rowIdx;
            },
            dataSource: [[]] ,
            spanCount: 1,
            loaded: true,
            layout: {
                type: 'grid',
                cellHeight: 80,
                cellWidth: window.width,
                minLineSpacing: 5,
                minItemSpacing: 5,
                sectionInset: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,

                }
            }
        }
    },
    getInitialState: function() {
        return {
            actionSheetVisible:false
        };
    },
    componentDidMount() {
    },
    
    onRefresh: function(e){
        var self = this;
        this.props.onRefresh && this.props.onRefresh(function(){
            console.log('done');
            this.refs[SwipeRefreshRef].setNativeProps({
                "refreshing": false
            });
        }.bind(this), e);
    },
    onInfinite: function(e) {
        var self = this;
        this.props.onInfinite && this.props.onInfinite(function (code) {
            if (code == 'no-more-data') {
                this.refs[SwipeRefreshRef].setNativeProps({
                    "loadingMore": false
                });
            } else {
                console.log('done');
                this.refs[SwipeRefreshRef].setNativeProps({
                    "loadingMore": false
                });
            }

        }.bind(this), e);
    },
    onLongClick(sectionIndex, rowIndex, done){        
        if (this.props.onLongClick && this.props.onLongClick(sectionIndex, rowIndex, done)) {
            return;
        }else if (this.props.actionSheetConfig){
            this.showActionSheet(sectionIndex, rowIndex, done);
        }
        else if(this.props.alertConfig){
            this.showAlert(sectionIndex, rowIndex, done);            
        }
        this.setState({
            sectionIndex:sectionIndex,
            rowIndex:rowIndex
        })

    },
    showActionSheet(sectionIndex, rowIndex, done){
        this.setState({
            actionSheetVisible:true
        })    
    },
    showAlert(sectionIndex, rowIndex, done){
        var config = this.props.alertConfig;
          Alert.alert(
            config.title,
            config.text,
            [
              {text: '取消'},
              {text: config.option, onPress: () => {
                this.props.alertConfig.onPress(sectionIndex, rowIndex,done)
                }
              }
            ]
        )
    },
    onPressSheet(index,config){
        this.setState({
            actionSheetVisible:false
        })
        this.props.actionSheetConfig.onPress(index,config);
    },
    renderRecycle: function(){
        return (
            <View style = {this.props.collectionViewStyle}>
            <RecyclerView 
                {...this.props}
                rowGuid = {this.props.rowGuid}
                renderRow = { this.props.renderRow }
                dataSource = { this.props.dataSource }
                spanCount = { this.props.spanCount }
                layout = { this.props.layout }
                onLongClick = {this.onLongClick}
            />
            { this.renderActionSheet() }
            </View>
        );
    },
    onPressModal(){
         this.setState({
            actionSheetVisible:false
        })       
    },
    renderActionSheet(){
        
        if(this.props.actionSheetConfig){
           return (
            <ActionSheet
                title = {this.props.actionSheetConfig.title}
                options = {this.props.actionSheetConfig.options}
                onPressModal = {this.onPressModal}
                // cancelButtonIndex = {this.CANCEL_INDEX}
                onPress = {this.onPressSheet}
                actionSheetVisible={this.state.actionSheetVisible}
                config={{sectionIndex:this.state.sectionIndex,rowIndex:this.state.rowIndex}}
                />
            )
        }
    },
    render: function() {
        console.log('RecyclerView render', this.props.loaded);
        // if(!this.props.loaded){
        //     return this.props.renderLoadingView();
        // }
        if(this.props.onInfinite || this.props.onRefresh){
            // ToastAndroid.show("SwipeRefresh loaded", ToastAndroid.SHORT);
            return (
                <SwipeRefresh 
                    ref = { SwipeRefreshRef }
                    style = { [this.props.refreshStyle,
                  
                        {
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }]
                    }
                    onSwipeRefresh = { this.onRefresh }
                    onSwipeLoadMore = { this.onInfinite }
                    canRefresh={this.props.canRefresh}
                    canLoadMore={this.props.canLoadMore}
                >
                    {this.renderRecycle()}
                </SwipeRefresh>
            );
        }else{
            return this.renderRecycle();
        }
    },
});


module.exports = AKCollectionViewAndroid;
