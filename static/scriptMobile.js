var app 								= $(this);

var userListView				= $('.user-list-view');
var userListShadow  		= $('.shadow');
var userList 						= $('.user-list');

var friendOptions 			= $('.friend-options');

var notificationButton  = $('.notifications');
var notificationListView = $('.notification-list-view');
var backNotifications		 = $('.notification-list-view .back-button');
var notificationList 		= $('.notification-list');

var userPrototype					= $('.user.wz-prototype');
var notificationPrototype = $('.notification.wz-prototype');

var actualView = 'userList';

notificationButton.on( 'click' , function(){

	if (!$(this).hasClass('active')) {
		navigator.notification.alert( lang.noNotifications );
		return;
	}

	notificationListView.removeClass('hidden').transition({
		'transform'	: 'translate(0, 0)'
	}, 200, function(){

		userListView.addClass('hidden');
		actualView = 'notificationList';

	});

});

backNotifications.on( 'click' , function(){

	$('.search-friends input').val('').trigger('input');
	userListView.removeClass('hidden');
	notificationListView.transition({
		'transform'	: 'translate(100%, 0)'
	}, 200, function(){

		notificationListView.addClass('hidden');
		actualView = 'userList';

	});

});

userListShadow.on( 'click' , function(){

	//Activate scroll
	app.removeClass('no-scroll');
	StatusBar.backgroundColorByHexString("#fff");

	userListShadow.css({
		'opacity' : '0'
	});
	userListShadow.addClass('hidden');


	friendOptions.removeClass('hidden').transition({
		'transform'	: 'translate(0, '+ friendOptions.css('height') +')'
	}, 200, function(){

		friendOptions.addClass('hidden');

	});

});

app

.on( 'click' , '.user-options-button.friends' , function(){

	//Desactivate scroll
	app.addClass('no-scroll');
	StatusBar.backgroundColorByHexString("#b2b2b2");

	userListShadow.removeClass('hidden')
	userListShadow.css({
		'opacity' : '1'
	});

	friendOptions.removeClass('hidden').transition({
		'transform'	: 'translate(0, 0)'
	}, 200);

	setFriendOptions( $(this).parent().data('user') );

})

.on( 'click' , '.user-options-button.add' , function(){

	var domUser = $(this).parent();
	var user = domUser.data('user');
	user.addFriend( 'Hello dolly', function(){
		
		domUser.removeClass('no-friend').addClass('pending');

  });

})

.on( 'click' , '.remove-friend' , function(){

	var friend = friendOptions.data('user');
	friend.removeFriend( function(){
		$('.shadow').click();
		$('.search-friends input').val('').trigger('input');
	});

})

.on( 'click' , '.notification-options-button.add' , function(){

	var notification = $(this).parent();
	notification.data('user').acceptRequest( function(){
		notification.remove();
		if ($('.notification:not(.wz-prototype)').length === 0) {
			friends();
			backNotifications.click();
			$('.notifications').removeClass('active');
		}
	});

})

.on( 'click' , '.notification-options-button.decline' , function(){

	var notification = $(this).parent();
	notification.data('user').cancelRequest( function(){
		notification.remove();
		if ($('.notification:not(.wz-prototype)').length === 0) {
			backNotifications.click();
			$('.notifications').removeClass('active');
		}
	});

})

.on( 'input' , '.search-users input' , function(){

	/*
	var filter = $(this).val().toLowerCase();
	$('.friend.hidden').removeClass('hidden');
	$('.friend:not(.wz-prototype)').each(function( i , friend ){
		if(!$(friend).find('.friend-name').text().toLowerCase().includes( filter )){
			$(friend).addClass('hidden');
		}
	})
	*/

	$('.cleanable').remove();

	if( $('.search-users input').val() === '') {
		friends();
		return;
  }

  api.user.search( $(this).val(), function( error, users ){

  	if (users.length === 0 ){
  		$('.no-friends').addClass('active');
  	}else{
  		$('.no-friends').removeClass('active');
  	}

  	// Friends first
  	var friends = users.filter(function( user ){
  		return user.relation === 'friend';
  	});
  	var noFriends = $(users).not( $(friends) );
  	noFriends.each(function(i, user){
  		friends.push(user);
  	});
  	users = friends;

  	users.forEach(function( user ){
		  var userCard = userPrototype.clone().removeClass('wz-prototype');
      userCard.addClass( 'cleanable user-' + user.id );
      userCard.data( 'id', user.id );
      userCard.data( 'user', user );
      userCard.find('.user-avatar').css( 'background-image', 'url(' + user.avatar.small + ')' );
      userCard.find('.user-name').text(user.fullName);
      if ( user.relation === 'pending' ) {
      	userCard.addClass('pending');
      }else if( user.relation === 'friend' ){
      	userCard.addClass('friendly');
      }else{
      	userCard.addClass('no-friend');
      }
      if( $('.user-' + user.id).length === 0 ) userList.append(userCard);
  	});
  });

})

.on( 'click' , '.delete-content' , function(){

	$(this).parent().find('input').val('').trigger('input');

})

.on( 'focus' , '.search-users' , function(){
	$('.no-friends').addClass('hidden');
})

.on( 'blur' , '.search-users' , function(){
	$('.no-friends').removeClass('hidden');
})

.on( 'backbutton' , function( e ){

  e.stopPropagation();
	if( actualView === 'notificationList'){
		backNotifications.click();
	}else if( actualView === 'userList'){
		return;
	}

})

api.user.on( 'friendRemoved', function( user ){

	$('.user-' + user.id ).removeClass('friendly').addClass('no-friend').data('user' , user );

});

api.user.on( 'requestAccepted', function( user ){

	$('.user-' + user.id).removeClass('pending').addClass('friendly').data('user' , user );

});

api.user.on( 'requestRefused', function( user ){

	$('.user-' + user.id).removeClass('pending').addClass('no-friend').data('user' , user );

});

api.user.on( 'requestReceived', function( user ){

	$('.notifications').addClass('active');
	var notification = notificationPrototype.clone().removeClass('wz-prototype');
  notification.addClass( 'user-' + user.id );
  notification.data( 'id', user.id );
  notification.data( 'user', user );
  notification.find('.notification-avatar').css( 'background-image', 'url(' + user.avatar.small + ')' );
  notification.find('.notification-name').text(user.fullName);
  notificationList.append(notification);

});

var friends = function(){

	$('.cleanable').remove();

  api.user.friendList( false, function( error, list ){

  	if ( list.length === 0 ) {
  		$('.no-friends').addClass('active');
  	}else{
  		$('.no-friends').removeClass('active');
  	}

    list = list.sort( function( a, b ){
        return a.fullName.localeCompare( b.fullName );
    });

    if (error) {
    	console.warn(error);
    }

    var userCard = null;

  	list.forEach(function( user ){
		  var userCard = userPrototype.clone().removeClass('wz-prototype');
      userCard.addClass( 'cleanable friendly user-' + user.id );
      userCard.data( 'id', user.id );
      userCard.data( 'user', user );
      userCard.find('.user-avatar').css( 'background-image', 'url(' + user.avatar.small + ')' );
      userCard.find('.user-name').text(user.fullName);
      if( $('.user-' + user.id).length === 0 ) userList.append(userCard);
  	});
    
  });
}

var getRequests = function(){

  api.user.pendingRequests( false, function( error, users ){

  	if (users.length > 0) {
  		$('.notifications').addClass('active');
  	}else{
  		$('.notifications').removeClass('active');
  	}

  	users.forEach(function( user ){

  		var notification = notificationPrototype.clone().removeClass('wz-prototype');
      notification.addClass( 'user-' + user.id );
      notification.data( 'id', user.id );
      notification.data( 'user', user );
      notification.find('.notification-avatar').css( 'background-image', 'url(' + user.avatar.small + ')' );
      notification.find('.notification-name').text(user.fullName);
      notificationList.append(notification);

  	});


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

	translate();
	setMobile();
	friends();
	getRequests();

}

var setFriendOptions = function( user ){

	friendOptions.data( 'user', user );
	friendOptions.find('.friend-selected-name').text(user.fullName);
	friendOptions.find('.friend-selected-avatar').css( 'background-image', 'url(' + user.avatar.small + ')' );

}

var translate = function(){

	$('.user-list .view-title').text(lang.addFriends);
	$('.no-friends-text').text(lang.searchPeople);
	$('.user-options-button.add span').text(lang.add);
	$('.user-options-button.friends span').text(lang.friends);
	$('.user-options-button.pending span').text(lang.pending);
	$('.notification-list-view .view-title').text(lang.requests);
	$('.notification-options-button.decline span').text(lang.decline);
	$('.notification-options-button.add span').text(lang.add);
	$('.option-name.remove-friend').text(lang.rmFriend);
	$('.search-users input, .search-friends input').attr('placeholder' , lang.search);

}


initCommunity();
