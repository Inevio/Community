
wz.app.addScript( 2, 'common', function( win, params ){
	
	var contactsAsideUsers 			= $( '.contacts-aside-users', win );
	var contactsAsideGroups			= $( '.contacts-aside-groups', win );
	var contactsInfo				= $( '.contacts-info', win );
	var contactsAsideFilePrototype 	= $( '.contacts-aside-file.prototype', win );
	var friendInfo				 	= $( '.contacts-info-user.prototype', win );
	var friendData				 	= $( '.contacts-info-profile.prototype', win );
	var friendDataSection		 	= $( '.contacts-info-profile-section.prototype', win );
	var friendDataSectionArticle 	= $( '.contacts-info-profile-section .prototype', win );
	
	var friends = function(){
				
		wz.user
			
			.friendList( function( error, list ){
								
				// ToDo Error
				
				if( list.length === 0 ){
										
					var userCard = contactsAsideFilePrototype.clone().removeClass();
					userCard.children('img').remove();
					userCard.css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text('You don\'t have any friends yet, look for them in weeZeel using the search engine at the top.');
					contactsAsideUsers.append(userCard);
					
				}else{
									
					for( var i = 0; i < list.length; i++ ){
												
						var userCard = contactsAsideFilePrototype.clone().removeClass('prototype');
						userCard.data( 'id', list[i].id );
						//userCard.children('img').attr('src')
						userCard.children('span').text(list[i].fullName);
						contactsAsideUsers.append(userCard);

					}
				
				}
				
			});
		
	}
	
	var groups = function(){
				
		wz.user
			
			.groupList( function( error, list ){
				
				// ToDo Error				
				if( list.length === 0 ){
										
					var userCard = contactsAsideFilePrototype.clone().removeClass();
					userCard.children('img').remove();
					userCard.css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text('No estás metido en ningún grupo, dale al + para crear uno.');
					contactsAsideGroups.append(userCard);
					
				}else{
									
					for( var i = 0; i < list.length; i++ ){
												
						var userCard = contactsAsideFilePrototype.clone().removeClass('prototype');
						//userCard.children('img').attr('src')
						userCard.children('span').text(list[i].name);
						contactsAsideGroups.append(userCard);

					}
				
				}
				
			});
		
	}
	
	var friendShowInfo = function( id ){
		
		var friendCard = friendInfo.clone().removeClass( 'prototype' );
		
		wz.user
		
			.getUser( id, function( error, object ){
				friendCard.find( '.contacts-info-user-name' ).text( object.fullName );
				friendCard.find( '.contacts-info-user-bio' ).text( object.bio );
				friendCard.find( '.contacts-info-user-location' ).text( object.location );
				friendCard.find( '.contacts-info-user-url' ).text( object.url );
			})
		
		contactsInfo.append( friendCard );
		
		/*var infoCard = friendData.clone().removeClass( 'prototype' );
		
		contactsInfo.append( infoCard );
		
		var userDataCard = friendDataSection.clone().removeClass( 'prototype' );*/
	
	}
	
	friends();
	groups();
		
	win
	
		.on( 'mousedown', '.contacts-aside-file', function(){
			
			contactsInfo.children().not('.prototype').remove();
			friendShowInfo($(this).data('id'));
			
		})
		
		.on( 'mousedown', '.friend-contact', function(){
			
			if( $(this).parents( '.contacts-info-user' ).hasClass( 'friend' ) ){
				alert( 'I\'m sorry but due to weeMail not working this functionality neither does' );
			}else if( $(this).parents( '.contacts-info-user' ).hasClass( 'pending' ) ){
				alert( 'In the future you\'ll be able to accept a pending user' )
			}else{
				alert( 'I\'m sorry but due to weeMail not working this functionality neither does' );
			}			
			
		})
		
		.on( 'mousedown', '.friend-info', function(){
			
			if( $(this).parents( '.contacts-info-user' ).hasClass('friend') ){
				wz.user.getUser( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
					user.removeFriend( function(){
						alert( user.fullName + ' is not your friend anymore!' );						
					});				
				});
			}else if( $(this).parents( '.contacts-info-user' ).hasClass('pending') ){
				alert('In the future you\'ll be able to cancel a pending user')
			}else{
				wz.user.getUser( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
					user.addFriend( 'Hello dolly', function(){
						alert( 'A request has been sended to ' + user.fullName );						
					});				
				});
			}
								
		})
		
		.key( 'enter', function( e ){
			
			if( $(e.target).is( '.contacts-top-finder input' ) ){
				
				if( $(e.target).val() ){
					
					var friendsList = $();

					wz.user.searchUser( $(e.target).val(), function( error, users ){

						for( var i = 0 ; i < users.length ; i++ ){
							
								var friendCard = friendInfo.clone().removeClass( 'prototype' );

								if( users[i].relation === 'friend' ){
									friendCard.addClass( 'friend' );
									friendCard.find( '.friend-contact span' ).text( 'Send message' );
									friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( 'Delete friend' );
								}else if( users[i].relation === 'pending' ){
									friendCard.addClass( 'pending' );
									friendCard.find( '.friend-contact span' ).text( 'Accept' );
									friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( 'Cancel' );
								}else{
									friendCard.addClass( 'stranger' );
									friendCard.find( '.friend-contact span' ).text( 'Send message' );
									friendCard.find( '.friend-info span' ).text( 'Add as friend' );
								}
								
								friendCard.data( 'id', users[i].id );
								friendCard.find( '.contacts-info-user-name' ).text( users[i].fullName );
								//friendCard.find( '.contacts-info-user-bio' ).text( object.bio );
								//friendCard.find( '.contacts-info-user-location' ).text( object.location );
								//friendCard.find( '.contacts-info-user-url' ).text( object.url );
								
								friendsList = friendsList.add( friendCard );
						
						}
						
						contactsInfo.children().not('prototype').remove();
						
						contactsInfo.append( friendsList );
					
					});
				
				}
				
			}
			
		})
	
});
