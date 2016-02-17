
var win                         = $( this );
var aside                       = $('.ui-navbar');
var contactsAside               = $('.users', aside);
var groupsAside                 = $('.groups', aside);
var content                     = $('.ui-window-content');
var contactsAsideFilePrototype  = $('.users-user.wz-prototype');
var contactsAsideGroupPrototype = $('.groups-group.wz-prototype');
var cardPrototype               = $('.card.wz-prototype');
var listStatus                  = $('.list-status');
var requestsTopButton           = $('.requests');
var blockedTopButton            = $('.blocked');
var location                    = '';

var LIST_NORMAL   = 0;
var LIST_SEARCH   = 1;
var LIST_REQUESTS = 2;
var LIST_BLOCKED  = 3;

var friends = function(){

    api.user.friendList( false, function( error, list ){

        list = list.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });

        // To Do -> Error

        var userCard = null;

        if( list.length === 0 ){

            userCard = contactsAsideFilePrototype.clone().removeClass();

            userCard.children('img').remove();
            // To Do -> Quitar estos estilos de aqui
            userCard.addClass('alone').children('span').html( lang.noFriends );
            contactsAside.append( userCard );

        }else{

            for( var i = 0; i < list.length; i++ ){

                userCard = contactsAsideFilePrototype.clone().removeClass('wz-prototype');

                userCard.addClass( 'user-' + list[i].id );
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
    listStatus.css( 'margin-top', ( content.height() - listStatus.height() ) / 2 ); // To Do -> Hacer que el alto de listStatus sea automático
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

    api.user.pendingRequests( function( error, users ){

        if( users.length ){
            $( '.requests-icon i' ).addClass( 'requests-notification' ).text( users.length );
        }else{
            $( '.requests-icon i' ).removeClass( 'requests-notification' ).text( '' );
        }

    });

};

var createCard = function( info ){

    var card   = cardPrototype.clone().removeClass( 'wz-prototype' );
    var isUser = !!info.avatar;

    card.data( 'id', info.id );
    //card.find( '.info' ).text( info.bio );

    if( isUser ){

        card.find('.card-data .name').text( info.fullName );
        card.find('img').attr( 'src', info.avatar.normal );

        if( info.relation === 'friend' ){
            card.addClass( 'friend' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.deleteFriend );
        }else if( info.relation === 'pending' && ( info.id === info.sender ) ){
            card.addClass( 'pending-received' );
            //card.find( '.friend-contact span' ).text( lang.acceptRequest );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequest );
        }else if( info.relation === 'pending' ){
            card.addClass( 'pending-sent' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequestTwo );
        }else if( info.id === api.system.user().id ){
            card.addClass( 'self' );
            card.find( '.friend-info' ).remove();
        }else{
            card.addClass( 'stranger' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info span' ).text( lang.addFriend );
        }

    }else{

        card.find('img').attr( 'src', 'https://staticbeta.inevio.com/app/2/flags@2x.png' );
        card.find('.card-data .name').text( info.name );
        card.find('.group-members').show();

        var found  = false;
        var userId = api.system.user().id;

        for( var i = 0; i < info.list.length; i++ ){

            if( info.list[ i ].id === userId ){
                found = true;
                break;
            }

        }

        var members         = card.find('.group-members');
        var memberList      = info.list.slice( 0, 7 );
        var memberPrototype = card.find('.member.wz-prototype');
        var tmp;

        for( var i = 0; i < memberList.length; i++ ){

            tmp = memberPrototype.clone().removeClass('wz-prototype');
            tmp.data( 'id', memberList[ i ].id );
            tmp.find('img').attr( 'src', memberList[ i ].avatar.normal );
            tmp.find('figcaption').text( memberList[ i ].name );
            memberList[ i ] = tmp;

        }

        members.append( memberList );

        if( found ){
            card.addClass( 'friend' );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.leaveGroup );
        }else{
            card.addClass('stranger');
            card.find( '.friend-info span' ).text( lang.addFriend );
        }

    }

    return card;

};

var cardsShowInfo = function( list, type ){

    var cardList = [];

    for( var i = 0 ; i < list.length ; i++ ){
        cardList.push( createCard( list[ i ] ) );
    }

    content.children().not('.wz-prototype').not( listStatus ).remove();
    content.append( cardList );

    aside.find('.active').removeClass('active');

    if( list.length ){

        listStatus.css( 'display', 'none' );

        if( list.length === 1 ){
            aside.find( ( list[ 0 ].avatar ? '.user-' : '.group' ) + list[ 0 ].id ).addClass('active');
        }

    }else{
        listStatus.css( 'display', 'block' ).text( lang.noMessage[ type ] );
        centerListStatus();
    }

};

var removeFriendInfo = function( user ){

    var userRequest = content.children().filter( function(){
        return $(this).data( 'id' ) === user.id;
    });

    if( userRequest.size() ){
        userRequest.remove();
    }

};

var profile = function(){

    var user    = api.system.user();
    var profile = $('.profile-user');

    profile.addClass( 'user-' + user.id );
    $( '.ui-navgroup-element-txt', profile ).text( user.fullName );
    $( 'img', profile ).attr( 'src', user.avatar.tiny );

};

var groups = function(){

  api.user.listGroups( function( error, list ){

    var groupCard = null;

    if( list.length === 0 ){

    return;

      groupCard = contactsAsideGroupPrototype.clone().removeClass();

      groupCard.children('img').remove();
      // To Do -> Quitar estos estilos de aqui
      groupCard.addClass('alone').children('span').html( lang.noGroups );
      groupsAside.append( groupCard );

    }else{

      groupsAside.show();

      for( var i = 0; i < list.length; i++ ){

        groupCard = contactsAsideGroupPrototype.clone().removeClass('wz-prototype');

        groupCard.data( 'id', list[ 0 ].id );
        groupCard.children('img').attr( 'src', 'https://staticbeta.inevio.com/app/2/flags.png' );
        groupCard.children('span').text( list[ 0 ].name );
        groupsAside.children().remove('.alone');
        groupsAside.append( groupCard );

      }

    }

  });

};

var translate = function(){

    $('input').attr( 'placeholder', lang.search );
    $('.profile-title').text( lang.profileTitle );
    $( '.users-title', contactsAside ).text( lang.usersTitle );
    $( '.groups-title', groupsAside ).text( lang.groupsTitle );
    $( '.card-data .info', cardPrototype ).text( lang.userBio );
    $( '.ui-header-brand span' ).text( lang.appName );
    $('.user-groups h3').text( lang.groupsTitle );
    $('.group-members h3').text( lang.membersTitle );
    listStatus.text( lang.appName );

};

// WZ Events
api.user
.on( 'requestReceived', function( user ){

    pendingRequests();

    if( location === 'pending-requests' ){
        // To Do -> friendsShowInfo( [ user ], false, LIST_NORMAL );
    }else{

        var userRequest = content.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });

        if( userRequest.size() ){

            userRequest.removeClass( 'stranger' ).addClass( 'pending-received' );
            userRequest.find( '.friend-contact span' ).text( lang.acceptRequest );
            userRequest.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequest );
        }

    }

})

.on( 'requestAccepted', function( user ){

    pendingRequests();
    addToFriends( user );

    if( location === 'pending-requests' ){

        removeFriendInfo( user );

    }else{

        var userRequest = content.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });

        if( userRequest.size() ){

            userRequest.removeClass( 'pending-received pending-sent stranger' ).addClass( 'friend' );
            userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
            userRequest.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.deleteFriend );
        }

    }

})

.on( 'requestRefused', function( user ){

    pendingRequests();

    if( location === 'pending-requests' ){

        removeFriendInfo( user );

    }else{

        var userRequest = content.children().filter( function(){
            return $(this).data( 'id' ) === user.id;
        });

        if( userRequest.size() ){

            userRequest.removeClass( 'pending-received pending-sent' ).addClass( 'stranger' );
            userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
            userRequest.find( '.friend-info' ).removeClass( 'cancel' ).find( 'span' ).text( lang.addFriend );
        }

    }

})

.on( 'requestSent', function( user ){

    var userRequest = content.children().filter( function(){
        return $(this).data( 'id' ) === user.id;
    });

    if( userRequest.size() ){

        userRequest.removeClass( 'stranger' ).addClass( 'pending-sent' );
        userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
        userRequest.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequestTwo );
    }

})

.on( 'friendRemoved', function( user ){

    removeFromFriends( user );

    var userRequest = content.children().filter( function(){
        return $(this).data( 'id' ) === user.id;
    });

    if( userRequest.size() ){

        userRequest.removeClass( 'friend' ).addClass( 'stranger' );
        userRequest.find( '.friend-contact span' ).text( lang.sendMessage );
        userRequest.find( '.friend-info' ).removeClass( 'cancel' ).find( 'span' ).text( lang.addFriend );
    }

});

// DOM Events
win
.on( 'mousedown', '.users-user, .member', function(){

    location = 'user-info';

    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');

    api.user( $(this).data('id'), function( error, user ){
        cardsShowInfo( [ user ], LIST_NORMAL );
    });

})

.on( 'mousedown', '.profile-user', function(){

    location = 'user-info';

    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');
    cardsShowInfo( [ api.system.user() ], LIST_NORMAL );

})

.on( 'mousedown', '.groups-group', function(){

    location = 'info';

    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');

    api.user.group( $(this).data('id'), function( error, group ){
        cardsShowInfo( [ group ], LIST_NORMAL );
    });

})

.on( 'mousedown', '.friend-contact', function(){

    if( $(this).parents( '.user' ).hasClass( 'friend' ) ){
        alert( lang.notWorking );
    }else if( $(this).parents( '.user' ).hasClass( 'pending-received' ) ){

        api.user( $(this).parents( '.user' ).data( 'id' ), function( error, user ){

            user.acceptRequest( function(){

                /*api.banner()
                    .title( lang.requestAcceptedTitle )
                    .text( user.fullName + ' ' + lang.requestAccepted )
                    .icon( user.avatar.tiny )
                    .render();*/

            });

        });

    }else if( $(this).parents( '.user' ).hasClass( 'pending-sent' ) ){
        alert( lang.notWorking );
    }else{
        alert( lang.notWorking );

    }

})

.on( 'mousedown', '.requests', function(){

    location = 'pending-requests';

    api.user.pendingRequests( false, function( error, users ){

        users = users.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });

        cardsShowInfo( users, LIST_REQUESTS );

    });

})

.on( 'mousedown', '.blocked', function(){

    location = 'blocked-users';

    api.user.blockedList( false, function( error, users ){

        users = users.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });

        cardsShowInfo( users, LIST_BLOCKED );

    });

})

.on( 'mousedown', '.friend-info', function(){

    if( $(this).parents( '.user' ).hasClass('friend') ){

        api.user( $(this).parents( '.user' ).data( 'id' ), function( error, user ){

            user.removeFriend( function(){

                api.banner()
                    .setTitle( lang.friendRemovedTitle )
                    .setText( user.fullName + ' ' + lang.friendRemoved )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }else if( $(this).parents( '.user' ).hasClass('pending-received') ){

        api.user( $(this).parents( '.user' ).data( 'id' ), function( error, user ){

            user.cancelRequest( function(){

                api.banner()
                    .setTitle( lang.requestCancelledTitle )
                    .setText( user.fullName + ' ' + lang.requestCancelled )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }else if( $(this).parents( '.user' ).hasClass('pending-sent') ){

        api.user( $(this).parents( '.user' ).data( 'id' ), function( error, user ){

            user.cancelRequest( function(){

                api.banner()
                    .setTitle( lang.requestCancelledTitle )
                    .setText( user.fullName + ' ' + lang.requestCancelled )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }else{

        api.user( $(this).parents( '.user' ).data( 'id' ), function( error, user ){

            user.addFriend( 'Hello dolly', function(){

                api.banner()
                    .setTitle( lang.requestSentTitle )
                    .setText( lang.requestSent + ' ' + user.fullName )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }

})

/*
.on( 'click', '.user img', function(){

    var imageUrl = $( this ).attr( 'src' );

    imageUrl = imageUrl.split( '/' );

    imageUrl = imageUrl.slice( 0, -1 );

    imageUrl.push( 512 );

    imageUrl = imageUrl.join( '/' );

    api.app.createView( [ imageUrl, 'url' ] );

})
*/

.key( 'enter', function( e ){

    location = 'user-seeker';

    aside.find('.active').removeClass('active');
    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');

    if( $(e.target).is('.ui-input-search input') ){

        if( $(e.target).val() ){

            api.user.search( $(e.target).val(), function( error, users ){

                users = users.sort( function( a, b ){
                    return a.fullName.localeCompare( b.fullName );
                });

                cardsShowInfo( users, LIST_SEARCH );

            });

        }

    }

})

.on( 'ui-view-resize', function(){
    centerListStatus();
});

// Start app
win.addClass('dark');
translate();
profile();
friends();
groups();
pendingRequests();
centerListStatus();
