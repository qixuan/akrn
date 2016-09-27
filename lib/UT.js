var Bridge              =  require('./windvane');
var UT = {
    rclick: function(eventId, code){
        var opt = {
            'eventID': eventId, 
            'properties': {
                rclick: code,
            }
        };
        Bridge.call('AlinkUserTrack', 'commitEvent', opt, function(data){
            console.log('UT Record', data);
        });
    }
}
module.exports = UT;