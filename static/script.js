
wz.app.addScript( 2, 'common', function( win, params ){
	
	var contactsAsideUsers 			= $( '.contacts-aside-users', win );
	var contactsAsideGroups			= $( '.contacts-aside-groups', win );
	var contactsAsideFilePrototype 	= $( '.contacts-aside-file.prototype', win );

	var friends = function(){
				
		wz.user
			
			.friendList( function( error, list ){
								
				// ToDo Error
				
				if( list.length === 0 ){
										
					var userCard = contactsAsideFilePrototype.clone().removeClass();
					userCard.children('img').remove();
					userCard.css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text('No tienes ningún amigo agregado, búscalo en weeZeel con el buscador de arriba.');
					contactsAsideUsers.append(userCard);
					
				}else{
									
					for( var i = 0; i < list.length; i++ ){
												
						var userCard = contactsAsideFilePrototype.clone().removeClass('prototype');
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
	
	friends();
	groups();
		
});
