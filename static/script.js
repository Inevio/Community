
var win                         = $( this );
var aside                       = $('.ui-navbar');
var contactsAside               = $('.users', aside);
var groupsAside                 = $('.groups', aside);
var content                     = $('.ui-window-content');
var ntContent                   = $('.ui-content-bottom');
var contactsAsideFilePrototype  = $('.users-user.wz-prototype');
var contactsAsideGroupPrototype = $('.groups-group.wz-prototype');
var cardPrototype               = $('.card.wz-prototype');
var ntCardPrototype             = $('.notification-card.wz-prototype');
var listStatus                  = $('.list-status');
var ntListStatus                = $('.nt-list-status');
var requestsTopButton           = $('.requests');
var blockedTopButton            = $('.blocked');
var notificationCenter          = $('.notification');
var location                    = '';
var condicion                   = true;
var numPagina                   = 0;
var cadenaBusqueda              = "";
var inviteByMail                = $('.invite-by-mail');

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

            $('.no-friends-content').addClass('no-friends');

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
var centerNtListStatus = function(){
    ntListStatus.css( 'margin-top', ( ntContent.height() - ntListStatus.height() ) / 2 ); // To Do -> Hacer que el alto de listStatus sea automático
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

  api.user.pendingRequests( false, function( error, users ){

    if( users.length ){
      $( '.notification-icon').addClass('active');
      $( '.nt-badge').text(users.length);
      ntCardsShowInfo( users, LIST_REQUESTS );


    }else{
      $( '.notification-icon').removeClass('active');
      $( '.nt-badge').text('');
    }
    wz.app.setBadge( users.length || '' );

  });

};

var createCard = function( info ){

    var card   = cardPrototype.clone().removeClass( 'wz-prototype' );
    var isUser = !!info.avatar;

    card.data( 'id', info.id );
    var descript ='';
    api.user( info.id, function( error, user ){
      descript = user.description;

      if(descript == ""){
        card.find( '.info ' ).text(lang.userBio);
        card.find( '.edition-description').find('textarea').attr('placeholder', descript);

      }else{
        card.find( '.info' ).html(descript.replace(/\n/g, "<br />"));
        card.find( '.edition-description').find('textarea').attr('placeholder', descript);

      }
    });

    card.find( '.info-tittle').text(lang.description);

    //card.find( '.info' ).text( info.fullName);
    card.find( '.text-edit').css( 'display', 'none');
    card.find( '.edit-info').css( 'display', 'none');


    if( isUser ){

        card.find('.edition-name').find('section').find('span').text(info.fullName);
        card.find('.card-data .name').text( info.fullName );
        card.find('img').attr( 'src', info.avatar.normal );

        if( info.relation === 'friend' ){
            card.addClass( 'friend' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            //card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.deleteFriend );
            card.find( '.friend-info' ).addClass( 'cancel' ).hide();
            card.find( '.friend-msg').find( 'span').text(lang.sendMessage);
            card.find( '.rm-friend').find('span').text(lang.rmFriend);
            card.find( '.block-friend').find('span').text(lang.blockFriend);
            card.find( '.block-friend').addClass('active');
            card.find( '.rm-friend').addClass('active');
        }else if( info.relation === 'pending' && ( info.id === info.sender ) ){
            card.addClass( 'pending-received' );
            card.find( '.friend-contact' ).addClass('accept').find('span').text( lang.acceptRequest );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequest );
            card.find( '.block-friend').find('span').text(lang.blockFriend);
            card.find( '.block-friend').addClass('active');
        }else if( info.relation === 'pending' ){
            card.addClass( 'pending-sent' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.cancelRequestTwo );
            card.find( '.block-friend').find('span').text(lang.blockFriend);
            card.find( '.block-friend').addClass('active');

        }else if( info.id === api.system.user().id ){
            card.addClass( 'self' );
            card.find( '.edit-me').find('span').text(lang.editMe);
            card.find( '.edit-me').addClass('active');
            card.find( '.friend-info' ).remove();
            card.find( '.edit-info').css( 'display', 'block');
            card.find( '.edit-info').addClass('right');
            card.find( '.edit-info').find('span').text(lang.edit);
            card.find( '.save-changes').find('span').text(lang.saveChanges);
            card.find( '.cancel-changes').find('span').text(lang.cancelChanges);
            card.find( '.edition-name').find('.tittle').text(lang.name);
            card.find( '.edition-description').find('.tittle').text(lang.description);
        }else if (info.relation === 'blocked') {
            card.addClass('blockedUser');
            card.find( '.unBlock span').text(lang.unBlock);
        }
        else{
            card.addClass( 'stranger' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info span' ).text( lang.addFriend );
            card.find( '.block-friend').find('span').text(lang.blockFriend);
            card.find( '.block-friend').addClass('active');

        }

    }else{

        card.find('img').attr( 'src', 'https://staticbeta.horbito.com/app/2/flags@2x.png' );
        card.find('.card-data .name').text( info.name );
        card.find('.group-members').show();

        if( info.fsnodeId ){

            card.find('.group-folder').show();
            card.find('.group-folder-button').data( 'id', info.fsnodeId );

        }

        var found  = false;
        var userId = api.system.user().id;

        for( var i = 0; i < info.list.length; i++ ){

            if( info.list[ i ].id === userId ){
                found = true;
                break;
            }

        }

        var members         = card.find('.group-members');
        var memberList      = info.list;//.slice( 0, 7 );
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

    /*
      Quitar la imagen y asignar una aleatoria a los usuarios cuando se crea un usuario nuevo
      Por ahora cada vez que se genere una tarjeta de un usuario, se le asigna a esa tarjeta una iamgen aleatoria
    */

    var valor = Math.floor((Math.random()*(5.999999-0.999999))+0.999999);
    card.css('background' , 'url(/app/2/f'+valor+'.png) no-repeat');
    return card;

};

var createNtCard = function( info ){

    var card   = ntCardPrototype.clone().removeClass( 'wz-prototype' );
    var isUser = !!info.avatar;

    card.data( 'id', info.id );
    card.find('.accept span').text(lang.acceptRequest);
    card.find('.cancel span').text(lang.cancelRequest);
    card.find('.info-friend').text(lang.wantToBeFriend);

    if( isUser ){
        card.find('.info-name').text( info.fullName );
        card.find('img').attr( 'src', info.avatar.normal );
    }else{

        card.find('img').attr( 'src', 'https://staticbeta.horbito.com/app/2/flags@2x.png' );
        card.find('.card-data .name').text( info.name );
        card.find('.group-members').show();

        if( info.fsnodeId ){

            card.find('.group-folder').show();
            card.find('.group-folder-button').data( 'id', info.fsnodeId );

        }

        var found  = false;
        var userId = api.system.user().id;

        for( var i = 0; i < info.list.length; i++ ){

            if( info.list[ i ].id === userId ){
                found = true;
                break;
            }

        }

        var members         = card.find('.group-members');
        var memberList      = info.list;//.slice( 0, 7 );
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

var appendCardsShowInfo = function (list, type){

    var cardList = [];

    for( var i = 0 ; i < list.length ; i++ ){
        cardList.push( createCard( list[ i ] ) );
    }


    $('.list').append( cardList );

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


var cardsShowInfo = function( list, type ){

    var cardList = [];

    for( var i = 0 ; i < list.length ; i++ ){

        if(type == '3' && list[i] != null ){
          list[ i ].relation = 'blocked';
        }

        cardList.push(createCard( list[ i ] ));
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

var ntCardsShowInfo = function( list, type ){

    var cardList = [];

    for( var i = 0 ; i < list.length ; i++ ){
        cardList.push(createNtCard( list[ i ] ) );
    }


    ntContent.children().not('.wz-prototype').not( ntListStatus ).remove();
    ntContent.append( cardList );

    aside.find('.active').removeClass('active');

    if( list.length ){

        ntListStatus.css( 'display', 'none' );

        if( list.length === 1 ){
            aside.find( ( list[ 0 ].avatar ? '.user-' : '.group' ) + list[ 0 ].id ).addClass('active');
        }

    }else{
        ntListStatus.css( 'display', 'block' ).text( lang.noMessage[ type ] );
        centerNtListStatus();
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

        groupCard.data( 'id', list[ i ].id );
        groupCard.children('img').attr( 'src', 'https://staticbeta.horbito.com/app/2/flags.png' );
        groupCard.children('span').text( list[ i ].name );
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
    //$( '.card-data .info', cardPrototype ).text( lang.userBio );
    $( '.tittleApp' ).text( lang.appName );
    $('.user-groups h3').text( lang.groupsTitle );
    $('.group-members h3').text( lang.membersTitle );
    $('.ui-content-top span').text(lang.friendRequests);
    listStatus.text( lang.appName );
    $('.invite-by-mail span').text(lang.inviteByMail);
    $('.no-friends-content .title').text(lang.noContacts);
    $('.no-friends-content .subtitle').text(lang.findContacts);
    $('.no-friends-content .subtitle2').text(lang.inviteContacts);
    $('.no-friends-content .invite-by-mail span').text(lang.inviteFriends);
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

    if(content.hasClass('list')){
      content.removeClass('list');
      numPagina = 0;
      cadenaBusqueda = "";
    }
    if(content.hasClass('edit-mode')){
      content.removeClass('edit-mode');
    }
    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');

    api.user( $(this).data('id'), function( error, user ){
        cardsShowInfo( [ user ], LIST_NORMAL );
    });

})

.on( 'mousedown', '.profile-user', function(){

    location = 'user-info';

    if(content.hasClass('edit-mode')){
      content.removeClass('edit-mode');

    }

    if(content.hasClass('list')){
      content.removeClass('list');
      numPagina = 0;
      cadenaBusqueda = "";
    }
    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');
    cardsShowInfo( [ api.system.user() ], LIST_NORMAL );

})

.on( 'mousedown', '.groups-group', function(){

    location = 'info';

    if(content.hasClass('list')){
      content.removeClass('list');
      numPagina = 0;
      cadenaBusqueda = "";
    }
    requestsTopButton.removeClass('active');
    blockedTopButton.removeClass('active');

    api.user.group( $(this).data('id'), function( error, group ){
        cardsShowInfo( [ group ], LIST_NORMAL );
    });

})

.on( 'mousedown', '.friend-contact', function(){

  api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

      user.acceptRequest( function(){


        api.banner()
            .setTitle( lang.requestAcceptedTitle )
            .setText( user.fullName + ' ' + lang.requestAccepted )
            .setIcon( user.avatar.tiny )
            .render();

      });
  });
  $(this).parents('.card').removeClass('pending-received');
  $(this).parents('.card').addClass('friend');



})


.on('mousedown', '.nt-accept', function(){

  api.user( $(this).parents('.nt-buttons').parents('.notification-card').data( 'id' ), function( error, user ){

      user.acceptRequest( function(){


        /*api.banner()
            .setTitle( lang.requestAcceptedTitle )
            .setText( user.fullName + ' ' + lang.requestAccepted )
            .setIcon( user.avatar.tiny )
            .render();*/



            if($(this).parents('.nt-buttons').parents('.notification-card').find('.notification-card').size() < 3){
              $(this).parents('.nt-buttons').parents('.notification-card').remove();
              $('.notification').removeClass('active');
              $('.notification-icon').removeClass('active');
            }else{
              $(this).parents('.nt-buttons').parents('.notification-card').remove();
            }

          if($('.no-friends-content').hasClass('no-friends')){
            $('.no-friends-content').removeClass('no-friends');
          }

      });

  });
})

.on('mousedown', '.nt-cancel', function(){

  api.user( $(this).parents('.nt-buttons').parents('.notification-card').data( 'id' ), function( error, user ){

    user.cancelRequest( function(){

      api.banner()
            .setTitle( lang.requestCancelledTitle )
            .setText( user.fullName + ' ' + lang.requestCancelled )
            .setIcon( user.avatar.tiny )
            .render();

            if($(this).parents('.nt-buttons').parents('.notification-card').find('.notification-card').size() < 3){
              $(this).parents('.nt-buttons').parents('.notification-card').remove();
              $('.notification').removeClass('active');
              $('.notification-icon').removeClass('active');
            }else{
              $(this).parents('.nt-buttons').parents('.notification-card').remove();
            }

    });

  });
})

.on( 'mousedown', '.notification-icon', function(){




      api.user.pendingRequests( false, function( error, users ){

          users = users.sort( function( a, b ){
              return a.fullName.localeCompare( b.fullName );
          });
          ntCardsShowInfo( users, LIST_REQUESTS );
      });

})


.on( 'mousedown', '.blocked', function(){

    location = 'blocked-users';
    content.removeClass('list');
    content.addClass('block-list');

    api.user.blockedList( false, function( error, users ){

        users = users.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });

        cardsShowInfo( users, LIST_BLOCKED );

    });

})


.on( 'mousedown', '.friend-info', function(){

    if( $(this).parents('.card').hasClass('friend') ){

        api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

            user.removeFriend( function(){

                api.banner()
                    .setTitle( lang.friendRemovedTitle )
                    .setText( user.fullName + ' ' + lang.friendRemoved )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }
    else if( $(this).parents('.card').hasClass('pending-received') ){

        api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

            user.cancelRequest( function(){

                api.banner()
                    .setTitle( lang.requestCancelledTitle )
                    .setText( user.fullName + ' ' + lang.requestCancelled )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        });

    }else if( $(this).parents('.card').hasClass('pending-sent') ){

        api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

            user.cancelRequest( function(){

                api.banner()
                    .setTitle( lang.requestCancelledTitle )
                    .setText( user.fullName + ' ' + lang.requestCancelled )
                    .setIcon( user.avatar.tiny )
                    .render();

            });

        }); 

    }else if(  $(this).parents('.card').hasClass('stranger') ){

      console.log( this, $(this).parents('.card'), $(this).parents('.card').data() );
      api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

          user.addFriend( 'Hello dolly', function(){

              api.banner()
                  .setTitle( lang.requestSentTitle )
                  .setText( lang.requestSent + ' ' + user.fullName )
                  .setIcon( user.avatar.tiny )
                  .render();

          });

      });

    }
    else{

        console.log( "Error card without relation" ,this, $(this).parents('.card'), $(this).parents('.card').data() );

    }

})

.on( 'mousedown', '.group-folder-button', function(){

    console.log( $(this).data('id') );

    wz.fs( $(this).data('id'), function( error, fsnode ){
        fsnode.open();
    });

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

.on( 'click', '.edit-info', function(){

    var card = $('.card-data');
    if(condicion){
      card.find( '.info').css( 'display', 'none');
      card.find( '.text-edit').css( 'display', 'inline-block');

      var buttonSave = $('.button').eq(1).clone();
      buttonSave.removeClass('edit-info');
      buttonSave.addClass('saveChanges').find('span').text('Save');
      card.append(buttonSave);
      condicion=false;
    }
})

.on( 'click', '.block-friend', function(){

  var userCard = $(this).parents('.card');
  var idBlockUser = userCard.data().id;
  var sidebarUser = $('.users').find('user-'+idBlockUser);


  api.user.block( idBlockUser, function(){

    console.log(idBlockUser);
    userCard.remove();
    sidebarUser.remove();
    //wz.user.blockedList( function( error, list ){
    //    console.log(list);
    //});
  });

})

.on( 'click', '.unBlock', function(){

  var userCard = $(this).parents('.card');
  var idBlockUser = userCard.data().id;
  var sidebarUser = $('.users').find('user-'+idBlockUser);


  api.user.unblock( idBlockUser, function(){

    console.log(idBlockUser);
    userCard.remove();
    //wz.user.blockedList( function( error, list ){
      //  console.log(list);
    //});
  });

})

.on( 'click', '.saveChanges' , function () {

    var card = $('.card-data');
    card.find( '.info').css( 'display', 'inline-block');
    card.find( '.text-edit').css( 'display', 'none');
    condicion=true;
    card.find('.saveChanges').remove();
})

.on( 'click', '.notification-icon' ,function(){

    var ntIcon = $('.notification-icon');

      if (notificationCenter.hasClass('active')) {
        notificationCenter.removeClass('active');
      }else {
        notificationCenter.addClass('active');
      }
})
.on( 'click', '.ui-window-content' ,function(){

      if (notificationCenter.hasClass('active')) {
        notificationCenter.removeClass('active');
      }
})


.on( 'click', '.ui-input-search' ,function(){
      if (notificationCenter.hasClass('active')) {
        notificationCenter.removeClass('active');
      }
})
.on( 'click', '.tittleApp' ,function(){
      if (notificationCenter.hasClass('active')) {
        notificationCenter.removeClass('active');
      }
})

.on( 'click', '.ui-navbar' ,function(){
      if (notificationCenter.hasClass('active')) {
        notificationCenter.removeClass('active');
      }
})

.on( 'click', '.options' ,function(){
  var options = $(this).parents('.ui-header-btn-top').parents('.ui-header-btn').parents('.card').find('.more-options');
  if(options.hasClass('active')){
    options.removeClass('active');
  }else {
    options.addClass('active');
  }

})
.on('mousewheel', function(e){

  var listaVisualizada = $('.list').children();

  if ((listaVisualizada.size()>12) && (  $('list').scrollTop() < (listaVisualizada.size()-3) * 159 ) && ($('.list').scrollTop() > (listaVisualizada.size()-5) * 159) ) {

    api.user.search( cadenaBusqueda, numPagina + 1 ,function( error, users ){
        if(users.length > 0){
        numPagina++;

        users = users.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });
        appendCardsShowInfo( users, LIST_SEARCH );
      }
    });
  }
})

.key( 'enter', function( e ){
  $('.no-friends-content').removeClass('no-friends');
  if($('.ui-input-search').hasClass('active')){

      $('.list').scrollTop( 0 );
      if(content.hasClass('edit-mode')){
        content.removeClass('edit-mode');
      }
        location = 'user-seeker';

        aside.find('.active').removeClass('active');
        requestsTopButton.removeClass('active');
        blockedTopButton.removeClass('active');


        if( $(e.target).is('.ui-input-search input') ){

            if( $(e.target).val()){

                cadenaBusqueda = $(e.target).val();
                numPagina = 0;

                api.user.search( $(e.target).val(), function( error, users ){

                    users = users.sort( function( a, b ){
                        return a.fullName.localeCompare( b.fullName );
                    });

                    cardsShowInfo( users, LIST_SEARCH );
                    content.addClass( 'list');
                });
            }
        }

  }
})

.on('click', '.edit-me', function(){

  $(this).parents('.more-options').removeClass('active');
  content.removeClass('block-list');
  content.addClass('edit-mode');

})

.on('click', '.cancel-changes', function(){

  content.removeClass('edit-mode');


})

.on( 'click', '.rm-friend', function(){


      if( $(this).parents('.card').hasClass('friend') ){

          api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

              user.removeFriend( function(){

                  api.banner()
                      .setTitle( lang.friendRemovedTitle )
                      .setText( user.fullName + ' ' + lang.friendRemoved )
                      .setIcon( user.avatar.tiny )
                      .render();

              });

          });

      }
      else if( $(this).parents('.card').hasClass('pending-received') ){

          api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

              user.cancelRequest( function(){

                  api.banner()
                      .setTitle( lang.requestCancelledTitle )
                      .setText( user.fullName + ' ' + lang.requestCancelled )
                      .setIcon( user.avatar.tiny )
                      .render();

              });

          });

      }else if( $(this).parents('.card').hasClass('pending-sent') ){

          api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

              user.cancelRequest( function(){

                  api.banner()
                      .setTitle( lang.requestCancelledTitle )
                      .setText( user.fullName + ' ' + lang.requestCancelled )
                      .setIcon( user.avatar.tiny )
                      .render();

              });

          }); 

      }else{

          console.log( this, $(this).parents('.card'), $(this).parents('.card').data() );
          api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

              user.addFriend( 'Hello dolly', function(){

                  api.banner()
                      .setTitle( lang.requestSentTitle )
                      .setText( lang.requestSent + ' ' + user.fullName )
                      .setIcon( user.avatar.tiny )
                      .render();

              });

          });

      }

      if (!($(this).parents().hasClass('list'))) {
        api.user( $(this).parents('.card').data('id'), function( error, user ){
            cardsShowInfo( [ user ], LIST_NORMAL );
        });
      }else{
        $(this).parents('.more-options').removeClass('active');
        $(this).removeClass('active');
      }

})

.on( 'click' , '.friend-msg' , function(){
  var idUsr = $(this).parents('.card').data().id;
  console.log(idUsr);

  wz.app.openApp( 14 , [ 'open-chat' , { 'openMode' : 'user' , 'chatId' : idUsr } , function( o ){

    console.log(o);

  }] , 'hidden' );

})

.on('click', '.save-changes', function(){



      var texto = $(this).parents('.card').find('textarea').val();

              api.user.setDescription( texto , function(){

                $('.self .info-bottom').find('span').html(texto.replace(/\n/g, "<br />"));

              });
                content.removeClass('edit-mode');



})


.on('focusin', '.ui-input-textarea', function(){
  $(this).parents('.ui-input').addClass('active');
})

.on('focusout', '.ui-input-textarea', function(){
  $(this).parents('.ui-input').removeClass('active');
})


.on( 'ui-view-resize', function(){
    centerListStatus();
});

inviteByMail.on( 'click' , function(){
  api.app.createView( {} , 'inviteByMail' );
});

// Start app
win.addClass('dark');
translate();
profile();
friends();
groups();
pendingRequests();
centerListStatus();
