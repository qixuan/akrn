'use strict';
var React = require('react-native');
var {
    ReactNativeViewAttributes,
    NativeModules,
    StyleSheet,
    View,
    requireNativeComponent,
    TouchableWithoutFeedback,
    Alert,
    Text
} = React;

var RecyclerViewAndroid = requireNativeComponent('RecyclerView', null);
var RecyclerCellViewAndroid = requireNativeComponent('RecyclerViewCell', null);

var RecyclerViewManagerModule = NativeModules.RecyclerViewManagerModule;

function extend(el, map) {
    for (var i in map)
        if (typeof(map[i])!='object')
            el[i] = map[i];
    return el;
}

var RecyclerView = React.createClass({

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
        onClick: React.PropTypes.func,
        autoFocus: React.PropTypes.bool,
        spanCount:React.PropTypes.number,
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

    getInitialState: function() {
        console.log('state');
        return {
            rows: this._renderRows(this.props)
        };
    },

    componentDidMount: function() {
        console.log('componentDidMount');
        RecyclerViewManagerModule.notifyDataSetChanged(React.findNodeHandle(this));
    },

    componentDidUpdate: function() {
        console.log('componentDidUpdate');
        RecyclerViewManagerModule.notifyDataSetChanged(React.findNodeHandle(this));
    },

    componentWillReceiveProps: function(nextProps) {
        console.log('componentWillReceiveProps');
        var state = this._stateFromProps(nextProps);
        this.setState(state);
    },

    _stateFromProps: function(props) {
        return {
            rows: this._renderRows(props)
        };
    },
    _renderRowsContent: function(sectionIdx,rowIdx, rowData){
        var content = this.props.renderRow(rowData, sectionIdx, rowIdx, this._onRowHighlighted);
        var editConfig = content.props.editConfig || {};
        return (
                <TouchableWithoutFeedback onLongPress={() => this._onLongPress(sectionIdx,rowIdx,editConfig)}>
                    <View>
                        {content}
                    </View>
                </TouchableWithoutFeedback>
        );
    },
    _onLongPress:function(sectionIdx,rowIdx,editConfig){
        this.props.onLongClick(sectionIdx,rowIdx,editConfig, function(callback){
            callback(dataSource)
        });
    },
    _renderRowItem: function(cellData, rowData, sectionIdx, rowIdx){
        var contentView = this._renderRowsContent(sectionIdx, rowIdx, rowData);
        var content = this.props.renderRow(
            rowData,
            sectionIdx,
            rowIdx,
            this._onRowHighlighted
        );
        var rowGuid = this.props.rowGuid ? this.props.rowGuid(
            rowData,
            sectionIdx,
            rowIdx,
        ) : this._defaultRowGuid(rowData);

        var self = this;


        //  var onLongClickListener = function(event){}
        // if(this.props.deleteRow){
        var onLongClickListener = function(event){
                var data = event.nativeEvent;
                var sectionIdx = data.section;
                var rowIdx = data.row;
                var editConfig = content.props.editConfig || {};
                self.props.onLongClick(sectionIdx, rowIdx, editConfig, function(callback){
                    callback(dataSource)
                })
            }
        // }


        return <AKCell
                    key = {rowGuid}
                    indexPath = {{section: sectionIdx, item: rowIdx}}
                    style = {{
                        height: content.props.size ? content.props.size.height : this.props.layout.cellHeight,
                        width: content.props.size ? content.props.size.width : this.props.layout.cellWidth
                    }}
                    content = {contentView}
                    ref = {(row) => {
                        if(row){
                            PrivateMethods.captureReferenceFor(cellData, row);
                        }
                    }}
                    onCellClick= {(event)=>{this._onClick(event)}}
                    onCellLongClick= {(event)=>
                        {onLongClickListener(event)}
                    }
                >
                </AKCell>
    },
    _renderRows: function(props) {
        console.log('RecyclerViewAndroid renderRow',this.props);
        if(this.props.dataSource == null || this.props.dataSource.length == 0){
            return null
        }
        var dataSource = props.dataSource;
        var cellData = this.cellData = {};
        var rows = [];
        for (var sectionIdx = 0; sectionIdx < dataSource.length; sectionIdx++) {
            var section = dataSource[sectionIdx];
            for (var rowIdx = 0; rowIdx < section.length; rowIdx++) {
                var rowData = section[rowIdx];
                var row = this._renderRowItem(cellData, rowData, sectionIdx, rowIdx)
                rows.push(row);
            }
        }
        return rows;
    },

    render: function() {
        if(this.props.dataSource == null || this.props.dataSource.length == 0){
            return null
        }

        console.log('RecyclerViewAndroid render');
            return (
                <RecyclerViewAndroid
                    style={[this.props.style, {top: 0}]}
                    layout={this.props.layout}
                    spanCount={this.props.spanCount}
                    onLoadCell={this._onLoadCell}
                    onUnloadCell={this._onUnloadCell}
                    onClick={this._onClick}
                    onRefresh = {this._onRefresh}
                    onInfinite={this._onInfinite}>
                    {this.state.rows}
                </RecyclerViewAndroid>
            );
    },

    _onRowHighlighted: function(sectionID, rowID) {
        this.setState({highlightedRow: {sectionID, rowID}});
    },

    _onClick: function(event) {
        var data = event.nativeEvent;
        var selectedSection = data.section;
        var selectedIndex = data.row;

        if (this.props.onClick) {
            this.props.onClick({selectedSection, selectedIndex});
        }
        event.stopPropagation();
    },
    _onLoadCell: function(event) {
        // var data = event.nativeEvent;
        // var currentCell = this.cellData[data.section][data.item];
        // currentCell.setVisibility(true);
        // event.stopPropagation();
    },
    _onUnloadCell: function(event) {
        // var data = event.nativeEvent;
        // var currentCell = this.cellData[data.section][data.item];
        // currentCell.setVisibility(false);
        // event.stopPropagation();
    },

});

var PrivateMethods = {
    captureReferenceFor: function(cellData, row) {
        var sectionId = row.props.indexPath.section;
        var rowId = row.props.indexPath.item;
        if (cellData[sectionId] === undefined) {
            cellData[sectionId] = {};
        }

        cellData[sectionId][rowId] = row; // Capture the reference
    },
}

RecyclerView.Cell = React.createClass({
    propTypes: {
        content: React.PropTypes.element.isRequired
    },
    getInitialState(){
        return {
            visibility: true,
        }
    },
    componentWillMount() {
        this.viewProperties = {
            width: 0,
            height: 0,
        };
    },

    render: function() {
        if (this.state.visibility === false) {
            return (
                <RecyclerCellViewAndroid size={this.props.content.props.size} style={{width:this.viewProperties.width, height:this.viewProperties.height}} {...this.props} />
            );
        }
        return (
            <RecyclerCellViewAndroid onLayout={this.onLayout} size={this.props.content.props.size} {...this.props}>
                {this.props.content}
            </RecyclerCellViewAndroid>
        );
    },

    onLayout(evt) {
        // When the cell has actually been layed out, record the rendered width & height
        this.viewProperties.width = evt.nativeEvent.layout.width;
        this.viewProperties.height = evt.nativeEvent.layout.height;
    },

    setVisibility(visibility) {
        if (this.state.visibility == visibility) {
            return;
        }

        if (visibility == true) {
            this.setState({visibility: true});
        } else {
            this.setState({visibility: false});
        }
    },

});

var AKCell = RecyclerView.Cell;

module.exports = RecyclerView;
