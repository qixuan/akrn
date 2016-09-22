/**
 * @providesModule Overlay
 * @flow-weak
 */

'use strict';

var React = require('react-native');
var {
    View,
    Text,
    PropTypes,
    StyleSheet,
    Dimensions,
    requireNativeComponent,
    TouchableWithoutFeedback
} = React;
const RootModal = require('./rootModal/RootModal')

var Overlay = require('./overlay');
var window = Dimensions.get('window');
var TimerMixin = require('react-timer-mixin');

var Toast = React.createClass({
    mixins: [TimerMixin],
    propTypes: {
        /**
         * Determines the visibility of the Overlay. When it is not visible,
         * an empty View is rendered.
         */
        isVisible: React.PropTypes.bool,
    },

    getInitialState: function () {
        return {
            isVisible: false,
            overlayCanClose: true,
            content: '',
            duration: null
        }
    },

    _onOverlayPress() {
        if (this.state.overlayCanClose) {
            this.setState({
                isVisible: false,
                overlayCanClose: true,
                content: ''
            });
        }
    },

    renderBtn(v, i) {
        const l = this.state.btnArr.length;
        const w = 260 / l;
        let b;
        if (l != 1 && i != l - 1) {
            b = styles.borderRight
        }
        return (
            <TouchableWithoutFeedback
                onPress = {v.onPress} >
                <View style = {[styles.btnArrContainer, b, { width: w, }]}>
                    <Text style = {styles.btnArrText}>{v.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    },

    render() {
        var {
            isVisible,
        } = this.props;
        if (this.state.isVisible) {
            var self = this;
            this.state.duration != null && this.setTimeout(function () {
                self.setState({
                    isVisible: false,
                    duration: null
                })
            }, this.state.duration)
            return (
                <RootModal onPressModal = {this._onOverlayPress} style={styles.rootModal} visible={this.state.isVisible} >
                    <View style={styles.container}>

                        <View style={styles.main}>
                            <View style = {styles.bigTitle}>
                                <Text style = {styles.titleText}>{this.state.title}</Text>
                            </View>
                            <View style = {styles.content}>
                                <Text style={styles.contentTitle}>{this.state.content}</Text>
                            </View>
                            <View style = {styles.btnArr}>
                                {this.state.btnArr.map((v, i) => this.renderBtn(v, i)) }
                            </View>
                        </View>


                    </View>
                </RootModal>
            );
        } else {
            return null;
        }
    },
});


var styles = StyleSheet.create({
    borderRight: {
        borderColor: '#ccc',
        borderRightWidth: 1
    },
    btnArrContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnArrText: {
        color: '#00C7B2',
        fontSize: 16
    },
    btnArr: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ccc',
        width: 260,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: window.height,
        backgroundColor: 'transparent'
    },
    bigTitle: {
        marginTop: 20,
        marginBottom: 20
    },
    main: {
        width: 260,
        top: window.height / 2 - 100,
        left: window.width / 2 - 130,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        width: 220,
        backgroundColor: 'transparent',
        marginBottom: 40,
    },
    contentTitle: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    rootModal: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    title: {

    },
    titleText: {
        color: '#000',
        fontSize: 20,
        textAlign: 'center'
    }
})

module.exports = Toast;
