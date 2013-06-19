
wz.app.addScript( 2, 'common', function( win, app, lang, params ){
    
    var contactsAsideUsers          = $( '.contacts-aside-users', win );
    var contactsAsideGroups         = $( '.contacts-aside-groups', win );
    var contactsInfo                = $( '.contacts-info', win );
    var contactsAsideFilePrototype  = $( '.contacts-aside-file.wz-prototype', win );
    var friendInfo                  = $( '.contacts-info-user.wz-prototype', win );
    var friendData                  = $( '.contacts-info-profile.wz-prototype', win );
    var friendDataSection           = $( '.contacts-info-profile-section.wz-prototype', win );
    var friendDataSectionArticle    = $( '.contacts-info-profile-section .wz-prototype', win );
    var location                    = '';
    
    var friends = function(){
                
        wz.user
            
            .friendList( function( error, list ){
                                
                // ToDo Error
                
                if( list.length === 0 ){
                                        
                    var userCard = contactsAsideFilePrototype.clone().removeClass();
                    userCard.children('img').remove();
                    userCard.addClass('alone').css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text( lang.noFriends );
                    contactsAsideUsers.append(userCard);
                
                }else{
                                    
                    for( var i = 0; i < list.length; i++ ){
                                                
                        var userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');
                        userCard.data( 'id', list[i].id );
                        userCard.children('img').attr( 'src', list[i].avatar.tiny )
                        userCard.children('span').text(list[i].fullName);
                        contactsAsideUsers.append(userCard);

                    }
                
                }
                
            });
        
    }
    
    var groups = function(){
                
        wz.group.list( function( error, list ){
                
                // ToDo Error               
                if( list.length === 0 ){
                                        
                    var userCard = contactsAsideFilePrototype.clone().removeClass();
                    userCard.children('img').remove();
                    userCard.css({'padding-left':'5px','padding-right':'20px','text-align':'justify'}).children('span').css({'font-size':'13px'}).text( lang.noGroups );
                    contactsAsideGroups.append(userCard);
                    
                }else{
                                    
                    for( var i = 0; i < list.length; i++ ){
                                                
                        var userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');
                        userCard.children('img').attr( 'src', list[i].avatar.tiny )
                        userCard.children('span').text(list[i].name);
                        contactsAsideGroups.append(userCard);

                    }
                
                }
                
            });
        
    }
    
    var addToFriends = function( user ){
        
        var userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');
        userCard.data( 'id', user.id );
        userCard.children('img').attr( 'src', user.avatar.tiny )
        userCard.children('span').text(user.fullName);
        contactsAsideUsers.children().remove('.alone');
        contactsAsideUsers.append(userCard);
        
    }
    
    var removeFromFriends = function( user ){
        
        var contactInfo = contactsAsideUsers.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });
        
        if( contactInfo.size() ){
            contactInfo.remove();
        }

        if( contactsAsideUsers.children().size() < 3 ){
            friends();
        }
        
    }
    
    var addToGroups = function( group ){
    }
    
    var removeFromGroups = function( group ){
    }
    
    var pendingRequests = function(){
        
        wz.user.pendingRequests( function( error, users ){

            if( users.length ){
                $( '.contacts-top-request-icon i' ).addClass( 'contacts-top-request-notification' ).text( users.length );               
            }else{
                $( '.contacts-top-request-icon i' ).removeClass( 'contacts-top-request-notification' ).text( '' );
            }
            
        });
        
    }
    
    var friendShowInfo = function( user, clean ){

        var friendCard = friendInfo.clone().removeClass( 'wz-prototype' );
        
        if( user.relation === 'friend' ){
            friendCard.addClass( 'friend' );
            friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
            friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.deleteFriend );
        }else if( user.relation === 'pending' && ( user.id === user.sender ) ){
            friendCard.addClass( 'pending-received' );
            friendCard.find( '.friend-contact span' ).text( lang.acceptRequest );
            friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequest );
        }else if( user.relation === 'pending' ){
            friendCard.addClass( 'pending-sent' );
            friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
            friendCard.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequestTwo );
        }else{
            friendCard.addClass( 'stranger' );
            friendCard.find( '.friend-contact span' ).text( lang.sendMessage );
            friendCard.find( '.friend-info span' ).text( lang.addFriend );
        }
        
        friendCard.data( 'id', user.id );
        friendCard.find( 'img' ).attr( 'src', user.avatar.normal )
        friendCard.find( '.contacts-info-user-name' ).text( user.fullName );
        //friendCard.find( '.contacts-info-user-bio' ).text( user.bio );
        //friendCard.find( '.contacts-info-user-location' ).text( user.location );
        //friendCard.find( '.contacts-info-user-url' ).text( user.url );
        
        if( clean ){            
            contactsInfo.children().not('.wz-prototype').remove();
        }
        
        contactsInfo.append( friendCard );
    
    }
    
    var friendsShowInfo = function( users, clean ){
        
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
            friendCard.find( 'img' ).attr( 'src', users[i].avatar.normal )
            friendCard.find( '.contacts-info-user-name' ).text( users[i].fullName );
            //friendCard.find( '.contacts-info-user-bio' ).text( users[i].bio );
            //friendCard.find( '.contacts-info-user-location' ).text( users[i].location );
            //friendCard.find( '.contacts-info-user-url' ).text( users[i].url );
            
            friendsList = friendsList.add( friendCard );
        
        }
        
        if( clean ){
            contactsInfo.children().not('.wz-prototype').remove();
        }
        
        contactsInfo.append( friendsList );
    
    }
    
    var removeFriendInfo = function( user ){
        
        var userRequest = contactsInfo.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });

        if( userRequest.size() ){
            userRequest.remove();
        }
        
    }
    
    friends();
    groups();
    pendingRequests();
        
    win
    
        .on( 'mousedown', '.contacts-aside-file', function(){
            
            contactsInfo.children().not('.wz-prototype').remove();
            location = 'user-info';
            
            wz.user( $(this).data('id'), function( error, user ){
                friendShowInfo( user, true );
            });
            
        })

        .on( 'mousedown', '.contacts-aside-groups-add', function(){
            
            alert( lang.notWorking, null, win.data().win );
            
        })
        
        .on( 'mousedown', '.friend-contact', function(){
            
            if( $(this).parents( '.contacts-info-user' ).hasClass( 'friend' ) ){
                
                alert( lang.notWorking, null, win.data().win );
                
            }else if( $(this).parents( '.contacts-info-user' ).hasClass( 'pending-received' ) ){
                
                wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
                    user.acceptRequest( function(){

                        wz.banner()
                            .title( lang.requestAcceptedTitle )
                            .text( user.fullName + ' ' + lang.requestAccepted )
                            .image( user.avatar.tiny )
                            .render();

                    });             
                });
                
            }else if( $(this).parents( '.contacts-info-user' ).hasClass( 'pending-sent' ) ){
                
                alert( lang.notWorking, null, win.data().win );
                
            }else{
                
                alert( lang.notWorking, null, win.data().win );
                
            }           
            
        })
        
        .on( 'mousedown', '.contacts-top-request', function(){
            
            location = 'pending-requests';
            
            wz.user.pendingRequests( function( error, users ){
                
                if( users.length ){
                                
                    friendsShowInfo( users, true );
                
                }else{
                    
                    location = 'empty-pending-requests';
                    
                    var friendCard = friendInfo.clone().removeClass();
                    friendCard.children().remove();
                    friendCard.css({ 'width' : '300px', 'text-align' : 'center', 'margin' : '100px auto', 'color' : '#404148', 'font-size' : '16px' }).text( lang.noRequests );
                    contactsInfo.children().not('.wz-prototype').remove();      
                    contactsInfo.append( friendCard );
                    
                }
                
            });
            
        })
        
        .on( 'mousedown', '.contacts-top-blocked', function(){
            
            location = 'blocked-users';
            
            wz.user.blockedList( function( error, users ){
                
                if( users.length ){
                                
                    friendsShowInfo( users, true );
                
                }else{
                    
                    location = 'empty-blocked-users';
                    
                    var friendCard = friendInfo.clone().removeClass();
                    friendCard.children().remove();
                    friendCard.css({ 'width' : '300px', 'text-align' : 'center', 'margin' : '100px auto', 'color' : '#404148', 'font-size' : '16px' }).text( lang.noBlocked );
                    contactsInfo.children().not('.wz-prototype').remove();      
                    contactsInfo.append( friendCard );
                    
                }
                
            });
            
        })
        
        .on( 'mousedown', '.friend-info', function(){
            
            if( $(this).parents( '.contacts-info-user' ).hasClass('friend') ){
                
                wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
                    user.removeFriend( function(){

                        wz.banner()
                            .title( lang.friendRemovedTitle )
                            .text( user.fullName + ' ' + lang.friendRemoved )
                            .image( user.avatar.tiny )
                            .render();

                    });             
                });
                
            }else if( $(this).parents( '.contacts-info-user' ).hasClass('pending-received') ){
                
                wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
                    user.cancelRequest( function(){

                        wz.banner()
                            .title( lang.requestCancelledTitle )
                            .text( user.fullName + ' ' + lang.requestCancelled )
                            .image( user.avatar.tiny )
                            .render();

                    });             
                });
                
            }else if( $(this).parents( '.contacts-info-user' ).hasClass('pending-sent') ){
                
                wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
                    user.cancelRequest( function(){
                        
                        wz.banner()
                            .title( lang.requestCancelledTitle )
                            .text( user.fullName + ' ' + lang.requestCancelled )
                            .image( user.avatar.tiny )
                            .render();

                    });             
                });
                
            }else{
                
                wz.user( $(this).parents( '.contacts-info-user' ).data( 'id' ), function( error, user ){
                    user.addFriend( 'Hello dolly', function(){

                        wz.banner()
                            .title( lang.requestSentTitle )
                            .text( lang.requestSent + ' ' + user.fullName )
                            .image( user.avatar.tiny )
                            .render();

                    });             
                });
                
            }
                                
        })
        
        .on( 'user-requestReceived', function( e, user ){
            
            pendingRequests();
            
            if( location === 'pending-requests' ){
                
                friendShowInfo( user );
                
            }else if( location === 'empty-pending-requests' ){
                
                friendShowInfo( user, true );
                
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
        
        .on( 'user-requestAccepted', function( e, user ){

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
        
        .on( 'user-requestRefused', function( e, user ){

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

        .on( 'user-requestSent', function( e, user ){

            var userRequest = contactsInfo.children().filter( function(){
                return $(this).data( 'id' ) === user.id;
            });
            
            if( userRequest.size() ){
                
                userRequest.removeClass( 'stranger' ).addClass( 'pending-sent' );
                userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
                userRequest.find( '.friend-info' ).addClass( 'warning' ).find( 'span' ).text( lang.cancelRequestTwo );
            }
            
        })
        
        .on( 'user-friendRemoved', function( e, user ){

            removeFromFriends( user );
            
            var userRequest = contactsInfo.children().filter( function(){
                return $(this).data( 'id' ) === user.id;
            });
                
            if( userRequest.size() ){
                    
                userRequest.removeClass( 'friend' ).addClass( 'stranger' );
                userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
                userRequest.find( '.friend-info' ).removeClass( 'warning' ).find( 'span' ).text( lang.addFriend );
            }
            
        })
        
        .key( 'enter', function( e ){
            
            location = 'user-seeker';
            
            if( $(e.target).is( '.contacts-top-finder input' ) ){
                
                if( $(e.target).val() ){

                    wz.user.search( $(e.target).val(), function( error, users ){

                        friendsShowInfo( users, true );
                    
                    });
                
                }
                
            }
            
        })

    $( '.contacts-aside-users-title', contactsAsideUsers ).text( lang.usersTitle );
    $( '.contacts-aside-groups-title', contactsAsideGroups ).text( lang.groupsTitle );
    $( '.contacts-info-user-bio', friendInfo ).text( lang.userBio );
    
});
