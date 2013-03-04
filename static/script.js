
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
		
		var infoCard = friendData.clone().removeClass( 'prototype' );
		
		contactsInfo.append( infoCard );
		
		var userDataCard = friendDataSection.clone().removeClass( 'prototype' );
	
	}
	
	friends();
	groups();
		
	win
	
		.on('click', '.contacts-aside-file', function(){
			
			contactsInfo.children().not('.prototype').remove();
			friendShowInfo($(this).data('id'));
			
		})
	
});
