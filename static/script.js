
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

  api.user.pendingRequests( function( error, users ){

    if( users.length ){
      $( '.notification-icon').addClass('active');
      $( '.nt-badge').text(users.length);

      //$( '.ui-header .requests span' ).addClass( 'requests-notification' ).text( users.length );
    }else{
      //$( '.ui-header .requests span' ).removeClass( 'requests-notification' ).text( '' );
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
    });
    if(descript == ""){
      card.find( '.info ' ).text(lang.userBio);
    }else{
      card.find( '.info' ).html(descript.replace(/\n/g, "<br />"));
    }
    card.find( '.info-tittle').text(lang.description);
    card.find( '.edition-description').find('textarea').attr('placeholder', descript);

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
            card.find( '.friend-info' ).addClass( 'cancel' ).find( 'span' ).text( lang.deleteFriend );
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
        }else{
            card.addClass( 'stranger' );
            //card.find( '.friend-contact span' ).text( lang.sendMessage );
            card.find( '.friend-info span' ).text( lang.addFriend );
            card.find( '.block-friend').find('span').text(lang.blockFriend);
            card.find( '.block-friend').addClass('active');

        }

    }else{

        card.find('img').attr( 'src', 'https://staticbeta.inevio.com/app/2/flags@2x.png' );
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
      Quitar la imagen y asignar una aleatoria a los usuarios cuando se crea un usuario nuevo?
      o que cada vez que se cree la tarjeta de un usuario ponerle una img de fondo.
    */

    var valor = Math.floor((Math.random()*(5.999999-0.999999))+0.999999);

    /*var url = 'url('+'@static/f'+valor+'.png'+') no-repeat';*/
    var urlCabecera = 'url(/app';
    var urlCuerpo1 = '/380/f';
    var urlCuerpo2 = '.png) no-repeat';
    var urlFinal = urlCabecera+urlCuerpo1+valor+urlCuerpo2;

    card.css('background' , urlFinal);
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

        card.find('img').attr( 'src', 'https://staticbeta.inevio.com/app/2/flags@2x.png' );
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
    /*$('.list').find('more-card').removeClass('more-card');
    $('.list').children().slice(($('.list').children().size()-2),($('.list').children().size())).addClass('more-card');
*/

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

    /*$('.list').children().slice(($('.list').children().size()-2),($('.list').children().size())).addClass('more-card');*/

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
        groupCard.children('img').attr( 'src', 'https://staticbeta.inevio.com/app/2/flags.png' );
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
/*
.on( 'mousedown', '.friend-contact', function(){

    if( $(this).parents('.card').hasClass( 'friend' ) ){
        alert( lang.notWorking );
    }else if( $(this).parents('.card').hasClass( 'pending-received' ) ){

        api.user( $(this).parents('.card').data( 'id' ), function( error, user ){

            user.acceptRequest( function(){

                /*api.banner()
                    .title( lang.requestAcceptedTitle )
                    .text( user.fullName + ' ' + lang.requestAccepted )
                    .icon( user.avatar.tiny )
                    .render();*/
                    /*
            });

        });

    }else if( $(this).parents('.card').hasClass( 'pending-sent' ) ){
        alert( lang.notWorking );
    }else{
        alert( lang.notWorking );

    }
})
*/

.on('mousedown', '.nt-accept', function(){

  api.user( $(this).parents('.nt-buttons').parents('.notification-card').data( 'id' ), function( error, user ){

      user.acceptRequest( function(){


        api.banner()
            .setTitle( lang.requestAcceptedTitle )
            .setText( user.fullName + ' ' + lang.requestAccepted )
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

/*
.on( 'mousedown', '.blocked', function(){

    location = 'blocked-users';

    api.user.blockedList( false, function( error, users ){

        users = users.sort( function( a, b ){
            return a.fullName.localeCompare( b.fullName );
        });

        cardsShowInfo( users, LIST_BLOCKED );

    });

})
*/

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

  var idBlockUser = $(this).parents('.card').data().id;

  wz.user.block( idBlockUser );
  console.log(idBlockUser);

wz.user.blockedList( function( error, list ){
    console.log(list);
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
/*

Cuando se haga scroll
if($('.ui-window-content').hasClass('list')){
  /*
  159 px por card de la lista
  1591 scroll max con 10 usuarios

  Numero de hijos de list tiene que ser min 12 y que el scrollTop sea numeroDeHijos-3x159 (implica que el scroll este mas menos sobre el ultimo usuario )para que se ejecute el método.
  Entonces se hace una peticion con la siguiente pagina (Contador). SE AÑADEN A LISTA.
  Numero de hijos de list va a ser 2 + 10 hijos primeros + resto de la peticion,
          El resto pueden ser 10 o menos de 10 ( si es menos de 10 fin se acabo toda la historia)
          El resto es 10 implica que puede que haya mas.

}
*/

.on('mousewheel', /*'.more-card',*/ function(e){

  /*$(this).parents().find('.more-card').removeClass('more-card');*/

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

          /*
            Cambiar los parametros, poner la paginacion en el parametro del medio (valor, pagina, callback)
          */

            cadenaBusqueda = $(e.target).val();
            numPagina = 0;

            api.user.search( $(e.target).val(), function( error, users ){

                users = users.sort( function( a, b ){
                    return a.fullName.localeCompare( b.fullName );
                });

                cardsShowInfo( users, LIST_SEARCH );
                content.addClass( 'list');
                /*$('.list').children().slice(($('.list').children().size()-2),($('.list').children().size())).addClass('more-card');*/

            });
        }
    }
})

.on('click', '.edit-me', function(){

  $(this).parents('.more-options').removeClass('active');
  content.addClass('edit-mode');

})

.on('click', '.cancel-changes', function(){

  content.removeClass('edit-mode');


})

.on('click', '.save-changes', function(){



      var texto = $(this).parents('.card').find('textarea').val();

              api.user.setDescription( texto , function(){

                console.log('Se coge este texto: '+texto);

              });
                content.removeClass('edit-mode');
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
