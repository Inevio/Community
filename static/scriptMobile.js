var app 								= $(this);
var friendListView			= $('.friend-list-view');
var friendListShadow  	= $('.friend-list-view .shadow');
var friendList 					= $('.friend-list');
var friendOptions 			= $('.friend-options');
var addFriendButton			= $('.add-friend-button');
var userListView				= $('.user-list');
var backUserList				= $('.user-list .back-button');
var notificationButton  = $('.notifications');
var notificationList    = $('.notification-list');
var backNotifications		= $('.notification-list .back-button');
var friendPrototype			= $('.friend.wz-prototype');

var optionsShowed				= false;

friendList.on( 'scroll' , function(e){

	if (optionsShowed) {
		console.log('noscroll!!')
		e.preventDefault();
		e.stopPropagation()
	}

});

addFriendButton.on( 'click' , function(){

	userListView.removeClass('hidden').transition({
		'transform'	: 'translate(0, 0)'
	}, 200);

});

notificationButton.on( 'click' , function(){

	notificationList.removeClass('hidden').transition({
		'transform'	: 'translate(0, 0)'
	}, 200);

});

backUserList.on( 'click' , function(){

	userListView.transition({
		'transform'	: 'translate(100%, 0)'
	}, 200, function(){

		userListView.addClass('hidden');

	});

});

backNotifications.on( 'click' , function(){

	notificationList.transition({
		'transform'	: 'translate(100%, 0)'
	}, 200, function(){

		notificationList.addClass('hidden');

	});

});

friendListShadow.on( 'click' , function(){

	optionsShowed = false;

	friendListShadow.transition({
		'opacity' : '0'
	}, 200, function(){

		friendListShadow.addClass('hidden');

	});

	friendOptions.removeClass('hidden').transition({
		'transform'	: 'translate(0, '+ friendOptions.css('height') +')'
	}, 200, function(){

		friendOptions.addClass('hidden');

	});

});

app

.on( 'click' , '.friend-options-button' , function(){

	optionsShowed = true;

	friendListShadow.removeClass('hidden').transition({
		'opacity' : '1'
	}, 200);

	friendOptions.removeClass('hidden').transition({
		'transform'	: 'translate(0, 0)'
	}, 200);

})


var friends = function(){
  api.user.friendList( false, function( error, list ){

      list = list.sort( function( a, b ){
          return a.fullName.localeCompare( b.fullName );
      });

      if (error) {
      	console.warn(error);
      }

      var userCard = null;

      if( list.length === 0 ){
      	friendList.addClass('no-friends');
      }else{
      	list.forEach(function( friend ){
    		  var userCard = friendPrototype.clone().removeClass('wz-prototype');
          userCard.addClass( 'user-' + friend.id );
          userCard.data( 'id', friend.id );
          userCard.find('.friend-avatar').css( 'background-image', 'url(' + friend.avatar.small + ')' );
          userCard.find('.friend-name').text(friend.fullName);
          friendList.append(userCard);
      	});
      }

  });
}

var setMobile = function(){

	StatusBar.backgroundColorByHexString("#fff");
	StatusBar.styleDefault();
  $('input, textarea').on('focus', function(){
    Keyboard.shrinkView(true);
  })
  .on('blur', function(){
    Keyboard.shrinkView(false);
  });

}

var initCommunity = function(){

	friends();

}


setMobile();
initCommunity();
