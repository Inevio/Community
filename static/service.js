
var updateBadge = function(){

  api.user.pendingRequests( function( error, list ){
    wz.app.setBadge( list.length || '' );
  });

};

api.user
.on( 'requestReceived', updateBadge )
.on( 'requestAccepted', updateBadge )
.on( 'requestRefused', updateBadge );

updateBadge();
