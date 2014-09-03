    
    var win                        = $( this );
    var contactsAside              = $('.contacts-aside');
    var contactsInfo               = $('.contacts-info');
    var contactsAsideFilePrototype = $('.contacts-aside-file.wz-prototype');
    var friendInfo                 = $('.contacts-info-user.wz-prototype');
    var friendData                 = $('.contacts-info-profile.wz-prototype');
    var friendDataSection          = $('.contacts-info-profile-section.wz-prototype');
    var friendDataSectionArticle   = $('.contacts-info-profile-section .wz-prototype');
    var listStatus                 = $('.list-status');
    var location                   = '';

    var LIST_NORMAL   = 0;
    var LIST_SEARCH   = 1;
    var LIST_REQUESTS = 2;
    var LIST_BLOCKED  = 3;
    
    var friends = function(){
        
        wz.user.friendList( false, function( error, list ){

            list = list.sort( function( a, b ){
                return a.fullName.localeCompare( b.fullName );
            });

            // To Do -> Error
            
            var userCard = null;

            if( list.length === 0 ){
                                    
                userCard = contactsAsideFilePrototype.clone().removeClass();

                userCard.children('img').remove();
                // To Do -> Quitar estos estilos de aqui
                userCard.addClass('alone').css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text( lang.noFriends );
                contactsAside.append(userCard);
            
            }else{
                                
                for( var i = 0; i < list.length; i++ ){
                                            
                    userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');
                    
                    userCard.data( 'id', list[i].id );
                    userCard.children('img').attr( 'src', list[i].avatar.tiny );
                    userCard.children('span').text(list[i].fullName);
                    contactsAside.append(userCard);

                }
            
            }
            
        });
        
    };
    
    var addToFriends = function( user ){
        
        var userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');

        userCard.data( 'id', user.id );
        userCard.children('img').attr( 'src', user.avatar.tiny );
        userCard.children('span').text(user.fullName);
        contactsAside.children().remove('.alone');
        contactsAside.append(userCard);
        
    };

    var centerListStatus = function(){
        listStatus.css( 'margin-top', ( contactsInfo.height() - 36 /*listStatus.height()*/ ) / 2 ); // To Do -> Hacer que el alto de listStatus sea automático
    };
    
    var removeFromFriends = function( user ){
        
        var contactInfo = contactsAside.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });
        
        if( contactInfo.size() ){
            contactInfo.remove();
        }

        if( contactsAside.children().size() < 3 ){
            friends();
        }
        
    };
    
    var pendingRequests = function(){
        
        wz.user.pendingRequests( function( error, users ){

            if( users.length ){
                $( '.contacts-top-request-icon i' ).addClass( 'contacts-top-request-notification' ).text( users.length );
            }else{
                $( '.contacts-top-request-icon i' ).removeClass( 'contacts-top-request-notification' ).text( '' );
            }
            
        });
        
    };
    
    var friendsShowInfo = function( users, clean, type ){
        
        var friendsList = $();
        
        for( var i = 0 ; i < users.length ; i++ ){
                            
            var friendCard = friendInfo.clone().removeClass( 'wz-prototype' );

            if( users[i].relation === 'friend' ){
                friendCard.addClass( 'friend' );
                friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
                friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.deleteFriend );
            }else if( users[i].relation === 'pending' && ( users[i].id === users[i].sender ) ){
                friendCard.addClass( 'pending-received' );
                friendCard.find( '.friend-contact span' ).text( lang.acceptRequest );
                friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequest );
            }else if( users[i].relation === 'pending' ){
                friendCard.addClass( 'pending-sent' );
                friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
                friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequestTwo );
            }else{
                friendCard.addClass( 'stranger' );
                friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
                friendCard.find( '.friend-info span' ).text( lang.addFriend );
            }
            
            friendCard.data( 'id', users[i].id );
            friendCard.find( 'img' ).attr( 'src', users[i].avatar.normal );
            friendCard.find( '.contacts-info-user-name' ).text( users[i].fullName );
            //friendCard.find( '.contacts-info-user-bio' ).text( users[i].bio );
            //friendCard.find( '.contacts-info-user-location' ).text( users[i].location );
            //friendCard.find( '.contacts-info-user-url' ).text( users[i].url );
            
            friendsList = friendsList.add( friendCard );
        
        }
        
        if( clean ){

            contactsInfo.children().not('.wz-prototype').not( listStatus ).remove();

            if( users.length ){
                listStatus.css( 'display', 'none' );
            }else{
                listStatus.css( 'display', 'block' ).text( lang.noMessage[ type ] );
            }

        }
        
        contactsInfo.append( friendsList );
    
    };
    
    var removeFriendInfo = function( user ){
        
        var userRequest = contactsInfo.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });

        if( userRequest.size() ){
            userRequest.remove();
        }
        
    };
    
    friends();
    pendingRequests();
    centerListStatus();
    
    // WZ Events
    wz.user
    .on( 'requestReceived', function( user ){
        
        pendingRequests();
        
        if( location === 'pending-requests' ){
            friendsShowInfo( [ user ], false, LIST_NORMAL );
        }else if( location === 'pending-requests' ){
            friendsShowInfo( [ user ], true, LIST_NORMAL );
        }else{
        
            var userRequest = contactsInfo.children().filter( function(){
                return $(this).data( 'id' ) === user.id;
            });
            
            if( userRequest.size() ){
                
                userRequest.removeClass( 'stranger' ).addClass( 'pending-received' );
                userRequest.find( '.friend-contact span' ).text( lang.acceptRequest );
                userRequest.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequest );
            }
            
        }
        
    })
    
    .on( 'requestAccepted', function( user ){

        pendingRequests();
        addToFriends( user );
        
        if( location === 'pending-requests' ){
            
            removeFriendInfo( user );
            
        }else{
        
            var userRequest = contactsInfo.children().filter( function(){
                return $(this).data( 'id' ) === user.id;
            });
            
            if( userRequest.size() ){
                
                userRequest.removeClass( 'pending-received pending-sent stranger' ).addClass( 'friend' );
                userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
                userRequest.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.deleteFriend );
            }
                  
        }
        
    })
    
    .on( 'requestRefused', function( user ){

        pendingRequests();
        
        if( location === 'pending-requests' ){
            
            removeFriendInfo( user );
            
        }else{
        
            var userRequest = contactsInfo.children().filter( function(){
                return $(this).data( 'id' ) === user.id;
            });
            
            if( userRequest.size() ){
                
                userRequest.removeClass( 'pending-received pending-sent' ).addClass( 'stranger' );
                userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
                userRequest.find( '.friend-info' ).removeClass( 'warning' ).find( 'span' ).text( lang.addFriend );
            }
            
        }
        
    })

    .on( 'requestSent', function( user ){

        var userRequest = contactsInfo.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });
        
        if( userRequest.size() ){
            
            userRequest.removeClass( 'stranger' ).addClass( 'pending-sent' );
            userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
            userRequest.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequestTwo );
        }
        
    })
    
    .on( 'friendRemoved', function( user ){

        removeFromFriends( user );
        
        var userRequest = contactsInfo.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });
            
        if( userRequest.size() ){
                
            userRequest.removeClass( 'friend' ).addClass( 'stranger' );
            userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
            userRequest.find( '.friend-info' ).removeClass( 'warning' ).find( 'span' ).text( lang.addFriend );
        }
        
    });

    // DOM Events 
    win
    .on( 'mousedown', '.contacts-aside-file', function(){
        
        location = 'user-info';
        
        wz.user( $(this).data('id'), function( error, user ){
            friendsShowInfo( [ user ], true, LIST_NORMAL );
        });
        
    })
    
    .on( 'mousedown', '.friend-contact', function(){
        
        if( $(this).parents( '.contacts-info-user' ).hasClass( 'friend' ) ){
            alert( lang.notWorking );
        }else if( $(this).parents( '.contacts-info-user' ).hasClass( 'pending-received' ) ){
            
            wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){

                user.acceptRequest( function(){

                    /*wz.banner()
                        .title( lang.requestAcceptedTitle )
                        .text( user.fullName + ' ' + lang.requestAccepted )
                        .icon( user.avatar.tiny )
                        .render();*/

                });

            });
            
        }else if( $(this).parents( '.contacts-info-user' ).hasClass( 'pending-sent' ) ){
            alert( lang.notWorking );
        }else{
            alert( lang.notWorking );
            
        }
        
    })
    
    .on( 'mousedown', '.contacts-top-request', function(){
        
        location = 'pending-requests';
        
        wz.user.pendingRequests( false, function( error, users ){

            users = users.sort( function( a, b ){
                return a.fullName.localeCompare( b.fullName );
            });
            
            friendsShowInfo( users, true, LIST_REQUESTS );
            
        });
        
    })
    
    .on( 'mousedown', '.contacts-top-blocked', function(){
        
        location = 'blocked-users';
        
        wz.user.blockedList( false, function( error, users ){

            users = users.sort( function( a, b ){
                return a.fullName.localeCompare( b.fullName );
            });
                                        
            friendsShowInfo( users, true, LIST_BLOCKED );
            
        });
        
    })
    
    .on( 'mousedown', '.friend-info', function(){
        
        if( $(this).parents( '.contacts-info-user' ).hasClass('friend') ){
            
            wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){

                user.removeFriend( function(){

                    wz.banner()
                        .setTitle( lang.friendRemovedTitle )
                        .setText( user.fullName + ' ' + lang.friendRemoved )
                        .setIcon( user.avatar.tiny )
                        .render();

                });

            });
            
        }else if( $(this).parents( '.contacts-info-user' ).hasClass('pending-received') ){
            
            wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){

                user.cancelRequest( function(){

                    wz.banner()
                        .setTitle( lang.requestCancelledTitle )
                        .setText( user.fullName + ' ' + lang.requestCancelled )
                        .setIcon( user.avatar.tiny )
                        .render();

                });

            });
            
        }else if( $(this).parents( '.contacts-info-user' ).hasClass('pending-sent') ){
            
            wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){

                user.cancelRequest( function(){
                    
                    wz.banner()
                        .setTitle( lang.requestCancelledTitle )
                        .setText( user.fullName + ' ' + lang.requestCancelled )
                        .setIcon( user.avatar.tiny )
                        .render();

                });
                
            });
            
        }else{
            
            wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){

                user.addFriend( 'Hello dolly', function(){

                    wz.banner()
                        .setTitle( lang.requestSentTitle )
                        .setText( lang.requestSent + ' ' + user.fullName )
                        .setIcon( user.avatar.tiny )
                        .render();

                });
                
            });
            
        }
                            
    })

    /*
    .on( 'click', '.contacts-info-user img', function(){

        var imageUrl = $( this ).attr( 'src' );

        imageUrl = imageUrl.split( '/' );

        imageUrl = imageUrl.slice( 0, -1 );

        imageUrl.push( 512 );

        imageUrl = imageUrl.join( '/' );

        wz.app.createView( [ imageUrl, 'url' ] );

    })
    */
    
    .key( 'enter', function( e ){
        
        location = 'user-seeker';
        
        if( $(e.target).is( '.contacts-top-finder input' ) ){
            
            if( $(e.target).val() ){

                wz.user.search( $(e.target).val(), function( error, users ){

                    users = users.sort( function( a, b ){
                        return a.fullName.localeCompare( b.fullName );
                    });

                    friendsShowInfo( users, true, LIST_SEARCH );
                
                });
            
            }
            
        }
        
    })

    .on( 'ui-view-resize', function(){
        centerListStatus();
    })

    .on( 'ui-view-resize-end', function(){
        wql.changeSize( [ win.width(), win.height() ] );
    });

    $('input').attr( 'placeholder', lang.search );
    $( '.contacts-aside-title', contactsAside ).text( lang.usersTitle );
    $( '.contacts-info-user-bio', friendInfo ).text( lang.userBio );
    listStatus.text( lang.appName );
