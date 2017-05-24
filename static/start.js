api.user.friendList( false, function( error, list ){

  if( error ){
    console.log(error);
  }else{

    if( list.length === 0 ){
      $('.no-friends-content').addClass('no-friends');
    }

  }

  start();

});
