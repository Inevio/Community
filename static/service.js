var window = $(this)[0];

var updateBadge = function(){

  api.user.pendingRequests( function( error, list ){
    wz.app.setBadge( list.length || '' );
  });

};

var addArrow = function( appName, text, position ){

  var arrow = $( '<div class="onboarding-arrow"><figure></figure><span></span></div>' );
  arrow.find( 'span' ).text( text );
  arrow.addClass( 'arrow-' + appName );

  var top = 32 + position*44 - 20;

  arrow.css({

    'position': 'absolute',
    'top': top,
    'left': $( '#wz-taskbar', window.document ).width(),
    'margin-left' : '10px',
    'box-sizing': 'border-box'

  });

  arrow.find('figure').css({

    'width': '55px',
    'height' : '43px',
    'background-image' : 'url("https://static.horbito.com/app/357/flecha-dock.png")',
    'background-size' : '55px 43px',
    'float' : 'left'

  })

  arrow.find('span').css({

    'margin-left': '16px',
    'margin-top' : '4px',
    'font-family' : 'Lato',
    'font-size' : '21px',
    'font-weight' : 'bold',
    'color' : '#fff',
    'float' : 'left',
    'text-shadow' : '0 5px 10px rgba(0,0,0,.3)'

  })

  $( 'body', window.document ).append( arrow );

}

wql.isFirstOpen( [ api.system.user().id ] , function( e , o ){

  if ( o.length === 0 ){

    addArrow( 'community', lang.arrow ,2 )

  }

});

api.user
.on( 'requestReceived', updateBadge )
.on( 'requestAccepted', updateBadge )
.on( 'requestRefused', updateBadge );



updateBadge();
