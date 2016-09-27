var React               =  require('react-native');
var EventEmitter        =  require('EventEmitter');
var Iconfont            =  require('../components/AKIconfont')
var SwitchItem          =  require('../components/SwitchItem')
var SwitchButton        =  require('../components/SwitchButton')
var Picker              =  require('../components/AKPicker')
var PipsSlider          =  require('../components/PipsSlider/PipsSlider')
var Slider              =  require('../components/Slider')
var PageTip             =  require('../components/PageTip')
var Overlay             =  require('../components/overlay')
var Grid                =  require('../components/Grid')
var List                =  require('../components/List')
var NarbarTransitional  =  require('../components/navbar/NarbarTransitional')
var AKLinking           = require('../components/AKLinking')
var Tab                 = require('../components/Tab')
var ActionSheet         = require('../components/ActionSheet')
var OffNet              = require('../components/OffNet')
var ColorPicker         = require('../components/ColorPicker')
var Resource            =  require('../resources/images');
var Bridge              =  require('./windvane');
var { 
  NativeModules,
  Platform
 } = React;
 // var WindVaneBridge = NativeModules.WindVaneBridge;
var SDK = require('./SDK');
var DA = {};
var NOOP = function(){};
DA.query = DA.query || {};
var uuid, model;
var currentViewsRouter;
var sceneContainers = [];
// var query = function(cb){
//     if(Object.length(DA.query)){
//         cb();
//         return;
//     }
//     NativeModules.URLParser.getQuery(function(query){
//         if (typeof query ==='string') {
//             query = JSON.parse(query);
//         };
//         DA.uuid = query.uuid;
//         DA.model = query.model;
//         DA.query = query;
//         if(DA.uuid){// 只有在有uuid的时候才注册UUID
//             NativeModules.AKRNSDKModule && NativeModules.AKRNSDKModule.registerUuid(DA.uuid);
//         }
//         cb();
//     });
// }
DA.Resource = Resource;
DA.onReady = function(cb){
    cb(DA);
    // query(function(query){
    //     cb(DA);
    // })
}
DA.getAccount = function(cb){
    Bridge.call('AlinkRequest', 'wsfProxy', {
        method: 'getCurrentAccountInfo',
        params: {}
    },function(data){
        console.log(data);
        AccountInfo = data;
        cb && cb(data);
    })
}
DA.login = function(){
    Bridge.call('AlinkHybrid', 'toLogin', {},function(data){
        console.log(data);
    })
}
DA.getEnv = function(cb){
    var className = Platform.OS == 'android' ? 'AlinkHybrid' : 'AlinkRequest';
    SDK.call({}, function(d){
        console.log('getEnv', d);

        if(d && d.h5env){
            cb(d);
        }else{
            cb({h5env: 'release'});
        }
    }, className, 'getEnvStatus');
}
DA.getAppInfo = function(cb){
    SDK.call({method:'getAppInfo',params:{}}, function(d){
        console.log('getAppInfo:', d);
        if(d && d.appVersion){
            cb(d);
        }else{
            cb({appVersion: '0'});
        }
    });    
}
DA.pushWebView = function(opt, cb, fcb){
    cb = cb || NOOP;
    fcb = fcb || NOOP;
    Bridge.call('AlinkHybrid', 'pushWebView', opt, cb, fcb);
}
DA.back = function(code){
    if(code == 'popRn'){
        var uuid = DA.uuid || '';
        if(Platform.OS == 'android'){
            NativeModules.DeviceEventManager.invokeDefaultBackPressHandler();
        }else{
            NativeModules.AKRNSDKModule.back(uuid);    
        }
    }else{
        DA.getRouter().pop();
    }
}
DA.registeRouter = function(router){
    currentViewsRouter = router;
}
DA.getRouter =function(router){
    return currentViewsRouter
}
DA.registeSceneContainer= function(ct){
    sceneContainers.push(ct)
}
DA.unRegisteSceneContainer = function(ct){
    var index = sceneContainers.indexOf(ct);
    if (index != -1) {
        sceneContainers.splice(index,1);
    };
}
DA.getSceneContainerByIndex = function(i){
    return sceneContainers[i];
}
DA.cmp = {
    modal:function(modalProps){
        var ct = sceneContainers[sceneContainers.length -1];
        ct.refs.modal.setState(modalProps)
    },
    toast:function  (modalProps) {
        var ct = sceneContainers[sceneContainers.length -1];
        ct.refs.toast.setState(modalProps)
    },
    navTip:function(props){
        var ct = sceneContainers[sceneContainers.length -1];
        ct.refs.navTip.setState(props)
    },
    alert:function(props){
        var ct = sceneContainers[sceneContainers.length -1];
        ct.refs.alert.setState(props)
    },
    AKCollectionView:(function(){
        if (Platform.OS === 'android') {
            console.log('get collection view from android');
            return require('../ListView/RecyclerView')
        }
        console.log('get collection view from ios');
        return require('../ListView/AKCollectionView.ios')
    })(),
    AKTableView: (function(){
        if (Platform.OS === 'android') {
            console.log('get tableview view from android');
            return require('../ListView/RecyclerView');
        }else{
            console.log('get tableview view from ios');
            return require('../ListView/RNTableView.ios');
        }
    })(),
    AKLinking:AKLinking,
    Overlay:Overlay,
    Iconfont:Iconfont,
    SwitchItem:SwitchItem,
    SwitchButton:SwitchButton,
    Picker:Picker,
    NarbarTransitional:NarbarTransitional,
    PipsSlider:PipsSlider,
    Slider:Slider,
    PageTip: PageTip,
    Grid:Grid,
    List:List,
    Tab:Tab,
    OffNet:OffNet,
    ActionSheet:ActionSheet,
    ColorPicker:ColorPicker
}

DA.event = {
    global_event_emitter : new EventEmitter()
}
 module.exports = DA;