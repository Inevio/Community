
wz.app.addScript( 2, 'common', function( win, params ){
	
	var contactsAsideUsers = $( '.contacts-aside-users', win );
	var contactsAsideFilePrototype = $( '.contacts-aside-file.prototype', win );

	var friends = function(){
		
		console.log('1');
		
		wz.user
			
			.friendList( function( error, list ){
				
				console.log(error, list, '2');
				
				// ToDo Error
				
				if( list.length === 0 ){
					
					console.log('3');
					
					var userCard = contactsAsideFilePrototype.clone().removeClass('prototype');
					userCard.children('span').text('No tienes ningún amigo agregado, búscalo en weeZeel con el buscador de arriba.');
					contactsAsideUsers.append(userCard);
					
				}else{
					
					console.log('4');
				
					for( var i = 0; i < list.length; i++ ){
						
						console.log('5', contactsAsideFilePrototype);
						
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
			
			.friendList( function( error, list ){
				
				// ToDo Error
				
				if( list.length === 0 ){
					
				}else{
				
					for( var i = 0; i < list.length; i++ ){
						list[i];
					}
				
				}
				
			});
		
	}
	
	friends();
		
});
