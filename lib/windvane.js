var React = require('react-native');
var WindVaneBridge = React.NativeModules.WindVaneBridge;
var NOOP = function(){};
var { 
  NativeModules,
  DeviceEventEmitter,
  Platform
 } = React;
 var request = {
    request:{
        "token": "", //由native 补全
        "host": "com.aliyun.alink",
        "hostType": "app",
        "version": "1.0.0", //由native 补全
        "target": "",
        "account": ""
    }
    
};
var resCallback = function(opt, data, cb){
    try{
    data = typeof data === 'string' ? JSON.parse(data) : data;    
    }catch(e){
        console.log('parse data error');
    }
    if(Platform.OS  == 'android'){
      console.log('wsf 入参:',opt);
      console.log('wsf 响应',data);
    }

    cb && cb(data);
}
module.exports = {
  call:function(className,method,opt,cb, fcb){
    cb = cb || NOOP;
    fcb = fcb || NOOP;
    var p = Object.assign(opt,request);
    if (Platform.OS  == 'ios') {
        WindVaneBridge.call(className,method,p,function(a){
            resCallback(opt, a, cb);
        },function(a){
            resCallback(opt, a, fcb);
        })
    }else{
      // hybrid://objectName:sid/methodName?params
      var params = JSON.stringify(opt);
      //var LOCAL_PROTOCOL = 'hybrid';
      //var sid = Math.floor(Math.random() * (1 << 50)) + '' + 1
      //var uri = LOCAL_PROTOCOL + '://'+className+':'+ 'sid' + '/'+method+'?' + params;
      
      WindVaneBridge.call(JSON.stringify({class:className,method:method,data:params}), function(data){
         resCallback(opt, data, cb);
      }, function(data){
          resCallback(opt, data, fcb)
      });
    }
  }
}